import { IncomingHttpHeaders } from 'http';
import * as jwt from 'jsonwebtoken';

export const verify = async (headers: IncomingHttpHeaders): Promise<{ _id: string; email: string; permissions: string[] }> => {
  if (!process.env.AUTH_SECRET) {
    throw new Error('AUTH_SECRET is not defined');
  }

  try {
    return jwt.verify(headers.authorization!, process.env.AUTH_SECRET) as { _id: string; email: string; permissions: string[] };
  } catch (e) {
    throw new Error('Invalid token');
  }
};

export const login = async (user: { _id: string; email: string; permissions: string[] }) => {
  if (!process.env.AUTH_SECRET) {
    throw new Error('AUTH_SECRET is not defined');
  }

  return jwt.sign({ user }, process.env.AUTH_SECRET, {
    expiresIn: '1h',
  });
};
