import { Document } from 'mongoose';
import { THooks } from './utils/hooks-type';
import { makeFastifyRoute, RouteMethod } from '../../utils/fastify';
import { ENTITIES } from '../../entities/types';
import { getModel, MongooseModelsDefinitions } from '../../utils/mongoose';
import { validateJoiSchema } from '../../utils/validate-joi-schema';
import { CheckPermissions } from '../../utils/check-permission';
import { JoiModelsDefinitions } from '../../utils/joi';

export const createOne = ({
  path,
  entity,
  hooks = { onSend: [], preHandler: [], onResponse: [] },
  permissions = [],
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
      const response = await model.create(body);
      return reply.status(201).send(response);
    },
    {
      preValidation: [
        CheckPermissions(permissions),
        validateJoiSchema(JoiModelsDefinitions[entity]!.required(), 'body'),
      ],
      preHandler: [...(hooks.preHandler || [])],
      onSend: [...(hooks.onSend || [])],
      onResponse: [...(hooks.onResponse || [])],
    },
  );
