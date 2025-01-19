import { Document } from 'mongoose';
import Joi from 'joi';
import { THooks } from './utils/hooks-type';
import { makeFastifyRoute, RouteMethod } from '../../utils/fastify';
import { ENTITIES } from '../../entities/types';
import { getModel, MongooseModelsDefinitions } from '../../utils/mongoose';
import { validateJoiSchema } from '../../utils/validate-joi-schema';
import { CheckPermissions } from '../../utils/check-permission';
import { Querystring, querystringSchema } from './utils/querystring-schema';
import { preHandlerDefaults } from './utils/pre-handler-defaults';
import { JoiModelsDefinitions } from '../../utils/joi';

export const updateOne = ({
  path,
  entity,
  modelId,
  permissions = [],
  hooks = { onSend: [], preHandler: [], onResponse: [] },
}: {
  path: string;
  entity: `${ENTITIES}`;
  modelId: string;
  permissions?: string[];
  hooks?: THooks;
}) =>
  makeFastifyRoute(
    RouteMethod.PUT,
    path,
    async (request, reply) => {
      const { params, query, body } = request as {
        headers: any;
        params: { modelId: string };
        body: any;
        query: Querystring;
      };
      const id = (params as any)[modelId];

      const model = getModel<Document>(entity, MongooseModelsDefinitions[entity]!);
      let mainQuery = model.findOneAndUpdate({ _id: id }, { $set: body as any }, { new: true });
      query.populate.forEach((docName) => {
        mainQuery = mainQuery.populate({
          path: docName,
        });
      });

      const response = await mainQuery;

      return reply.status(Boolean(response) === false ? 404 : 200).send(response);
    },
    {
      preValidation: [
        CheckPermissions(permissions),
        preHandlerDefaults,
        validateJoiSchema(JoiModelsDefinitions[entity]!.required(), 'body'),
        validateJoiSchema(Joi.object().keys({ [modelId]: Joi.string().alphanum().min(24).required() }), 'params'),
        validateJoiSchema(Joi.object<Querystring>().keys(querystringSchema), 'query'),
      ],
      preHandler: [...(hooks.preHandler || [])],
      onSend: [...(hooks.onSend || [])],
      onResponse: [...(hooks.onResponse || [])],
    },
  );