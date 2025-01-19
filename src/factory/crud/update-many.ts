import { Document } from 'mongoose';
import Joi from 'joi';
import { THooks } from './utils/hooks-type';
import { makeFastifyRoute, RouteMethod } from '../../utils/fastify';
import { ENTITIES } from '../../entities/types';
import { getModel, MongooseModelsDefinitions } from '../../utils/mongoose';
import { validateJoiSchema } from '../../utils/validate-joi-schema';
import { CheckPermissions } from '../../utils/check-permission';
import { JoiModelsDefinitions } from '../../utils/joi';

export const updateMany = ({
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
    RouteMethod.PUT,
    path,
    async (request, reply) => {
      const { body } = request;

      const model = getModel<Document>(entity, MongooseModelsDefinitions[entity]!);
      const response = await model.bulkWrite(
        (body as any[]).map((item) => ({
          updateOne: {
            filter: {
              _id: item._id,
            },
            update: {
              $set: item as any,
            },
            upsert: false,
          },
        })),
      );
      return reply.status(200).send(response);
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
