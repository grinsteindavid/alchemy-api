import { IncomingHttpHeaders } from 'http';
import * as jwt from 'jsonwebtoken';

export const verify = async (headers: IncomingHttpHeaders): Promise<{ _id: string; email: string; permissions: string[] }> => {
  if (!process.env.SECRET_TOKEN) {
    throw new Error('SECRET_TOKEN is not defined');
  }

  try {
    return jwt.verify(headers.authorization!, process.env.SECRET_TOKEN) as { _id: string; email: string; permissions: string[] };
  } catch (e) {
    throw new Error('Invalid token');
  }
};

export const login = async (user: { _id: string; email: string; permissions: string[] }) => {
  if (!process.env.SECRET_TOKEN) {
    throw new Error('SECRET_TOKEN is not defined');
  }

  return jwt.sign({ user }, process.env.SECRET_TOKEN, {
    expiresIn: '1h',
  });
};
