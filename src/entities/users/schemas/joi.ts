import Joi from 'joi';
import { IUser } from '../types';

export const UserSchemaJoi = Joi.object<IUser>().keys({
  _id: Joi.string(),
  firstName: Joi.string().min(3),
  lastName: Joi.string().min(3),
  email: Joi.string()
    .min(10)
    .email({ minDomainSegments: 2, tlds: { allow: false } }),
  passwordHash: Joi.string(),
  salt: Joi.string(),
  permissions: Joi.array().items(Joi.string()),
});
