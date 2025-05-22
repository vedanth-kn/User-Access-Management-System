import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePasswords = async (plain: string, hashed: string) => {
  return await bcrypt.compare(plain, hashed);
};

export const generateJWT = (id: number, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
};
