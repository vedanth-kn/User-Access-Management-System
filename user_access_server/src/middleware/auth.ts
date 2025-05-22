import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: 'Missing token' });
    return;
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      res.status(403).json({ message: 'Invalid token' });
      return;
    }

    (req as any).user = user;
    next(); // ✅ must call next()
  });
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!roles.includes(user.role)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    next(); // ✅ must call next()
  };
};
