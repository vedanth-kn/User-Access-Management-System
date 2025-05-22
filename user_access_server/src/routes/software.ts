import express from 'express';
import { AppDataSource } from '../config/data-source';
import { Software } from '../entity/Software';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = express.Router();
const softwareRepo = AppDataSource.getRepository(Software);

// POST /api/software
router.post('/', authenticateJWT, authorizeRoles('Admin'), async (req, res) => {
  const { name, description, accessLevels } = req.body;

  try {
    const newSoftware = softwareRepo.create({ name, description, accessLevels });
    await softwareRepo.save(newSoftware);
    res.status(201).json({ message: 'Software created successfully', software: newSoftware });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create software', error: err });
  }
});

// GET /api/software
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const softwares = await softwareRepo.find();
    res.status(200).json(softwares);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch software list', error: err });
  }
});


export { router as softwareRoutes };
