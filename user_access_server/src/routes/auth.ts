import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import { hashPassword, comparePasswords, generateJWT } from '../utils/auth';

const router = Router();
const userRepo = AppDataSource.getRepository(User);

// POST /api/auth/signup
router.post('/signup', async (req: Request, res: Response): Promise<void>  => {
  const { username, password, role = 'Employee' } = req.body;

  try {
    const existingUser = await userRepo.findOne({ where: { username } });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    } 

    const hashedPassword = await hashPassword(password);

    const user = userRepo.create({ username, password: hashedPassword, role });
    await userRepo.save(user);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Signup error', error: err });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await userRepo.findOne({ where: { username } });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    } 

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    } 
    const token = generateJWT(user.id, user.role);
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err });
  }
});

export default router;