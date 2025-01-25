import { FastifyReply } from 'fastify';
import { FastifyRequest, RouteOptions } from 'fastify';
import { login } from '../../utils/auth';
import { getModel } from '../../utils/mongoose';
import { IUser, UserSchemaMongoose } from '../../entities';
import { ENTITIES } from '../../entities/types';
import { validateJoiSchema } from '../../utils/validate-joi-schema';
import { makeFastifyRoute } from '../../utils/fastify';
import Joi from 'joi';
import * as bcrypt from 'bcrypt';

export const authRoutes: RouteOptions[] = [
  makeFastifyRoute('POST', 'auth/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as { email: string; password: string };
      
    const userModel = getModel(ENTITIES.USERS, UserSchemaMongoose);

    const user = await userModel.findOne({ email }).lean() as IUser;

    if (!user) {
      return reply.status(401).send({ message: 'Invalid email' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash); // Assume user.password is the hashed password stored in DB
    if (!isPasswordValid) {
      return reply.status(401).send({ message: 'Invalid password' });
    }

    const { _id, permissions } = user;
    const token = await login({ _id: _id!, email, permissions });

    return reply.send({ token });
  },
  {
    preValidation: [
        validateJoiSchema(
          Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
          }).required(),
          'body',
        ),
      ],
  }
),
];