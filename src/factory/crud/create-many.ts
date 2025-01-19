import { Document } from 'mongoose';
import Joi from 'joi';
import { THooks } from './utils/hooks-type';
import { makeFastifyRoute, RouteMethod } from '../../utils/fastify';
import { ENTITIES } from '../../entities/types';
import { getModel, MongooseModelsDefinitions } from '../../utils/mongoose';
import { validateJoiSchema } from '../../utils/validate-joi-schema';
import { CheckPermissions } from '../../utils/check-permission';
import { JoiModelsDefinitions } from '../../utils/joi';

export const createMany = ({
  path,
  entity,
  permissions = [],
  hooks = { onSend: [], preHandler: [] },
}: {
  path: string;
  entity: `${ENTITIES}`;
  permissions?: string[];
  hooks?: THooks;
}) =>
  makeFastifyRoute(
    RouteMethod.POST,
    path,
    async (request, reply) => {
      const { body } = request;

      const model = getModel<Document>(entity, MongooseModelsDefinitions[entity]!);
      const response = await model.insertMany(body as any[], { rawResult: false });
      return reply.status(201).send(response);
    },
    {
      preValidation: [
        CheckPermissions(permissions),
        validateJoiSchema(Joi.array().items(JoiModelsDefinitions[entity]!).min(1), 'body'),
      ],
      preHandler: [...(hooks.preHandler || [])],
      onSend: [...(hooks.onSend || [])],
    },
  );
