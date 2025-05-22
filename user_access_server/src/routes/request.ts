import express from 'express';
import { AppDataSource } from '../config/data-source';
import { Request as AccessRequest } from '../entity/Request';
import { Software } from '../entity/Software';
import { User } from '../entity/User';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = express.Router();
const requestRepo = AppDataSource.getRepository(AccessRequest);
const softwareRepo = AppDataSource.getRepository(Software);
const userRepo = AppDataSource.getRepository(User);

// POST /api/requests
router.post('/', authenticateJWT, authorizeRoles('Employee'), async (req, res) => {
  const { softwareId, accessType, reason } = req.body;

  try {
    const software = await softwareRepo.findOne({ where: { id: softwareId } });
    if (!software) {
        res.status(404).json({ message: 'Software not found' });
        return;
    } 

    const userId = (req as any).user.id;
    const user = await userRepo.findOne({ where: { id: userId } });

    const request = requestRepo.create({
      user: user!,
      software: software,
      accessType,
      reason,
      status: 'Pending',
    });

    await requestRepo.save(request);
    res.status(201).json({ message: 'Access request submitted', request });
  } catch (err) {
    res.status(500).json({ message: 'Request submission failed', error: err });
  }
});

// PATCH /api/requests/:id → Approve or Reject
router.patch('/:id', authenticateJWT, authorizeRoles('Manager'), async (req, res) => {
  const requestId = parseInt(req.params.id);
  const { status } = req.body;

  if (!['Approved', 'Rejected'].includes(status)) {
    res.status(400).json({ message: 'Status must be "Approved" or "Rejected"' });
    return;
  }

  try {
    const request = await requestRepo.findOne({
      where: { id: requestId },
      relations: ['user', 'software'],
    });

    if (!request) {
       res.status(404).json({ message: 'Request not found' });
       return;
    }

    request.status = status;
    await requestRepo.save(request);

    res.status(200).json({ message: `Request ${status.toLowerCase()}`, request });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update request status', error: err });
  }
});

// GET /api/requests/pending
router.get('/pending', authenticateJWT, authorizeRoles('Manager'), async (req, res) => {
  try {
    const requests = await requestRepo.find({
      where: { status: 'Pending' },
      relations: ['user', 'software'],
    });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch requests', error: err });
  }
});

router.get('/my-pending', authenticateJWT, authorizeRoles('Employee'), async (req, res) => {
  try {
    const userId = (req as any).user.id;
    
    const requests = await requestRepo.find({
      where: { 
        user: { id: userId },
        status: 'Pending' 
      },
      relations: ['user', 'software'],
    });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your pending requests', error: err });
  }
});

// GET /api/requests/my-requests → Get all requests for the logged-in employee (optional - for complete history)
router.get('/my-requests', authenticateJWT, authorizeRoles('Employee'), async (req, res) => {
  try {
    const userId = (req as any).user.id;
    
    const requests = await requestRepo.find({
      where: { 
        user: { id: userId }
      },
      relations: ['user', 'software'],
      order: { id: 'DESC' } // Most recent first
    });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your requests', error: err });
  }
});

export { router as requestRoutes };
