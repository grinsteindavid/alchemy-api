import { Document } from 'mongoose';
import Joi from 'joi';
import { THooks } from './utils/hooks-type';
import { makeFastifyRoute, RouteMethod } from '../../utils/fastify';
import { ENTITIES } from '../../entities/types';
import { getModel, MongooseModelsDefinitions } from '../../utils/mongoose';
import { validateJoiSchema } from '../../utils/validate-joi-schema';
import { CheckPermissions } from '../../utils/check-permission';
import { Querystring, querystringSchema } from './utils/querystring-schema';
import { getPopulateQuery } from './utils/get-populate-query';
import { getSelectFiltered } from './utils/get-select-filtered';
import { preHandlerDefaults } from './utils/pre-handler-defaults';

export const readOne = ({
  path,
  entity,
  modelId,
  permissions = [],
  hooks = { onSend: [], preHandler: [] },
}: {
  path: string;
  entity: `${ENTITIES}`;
  modelId: string;
  permissions?: string[];
  hooks?: THooks;
}) =>
  makeFastifyRoute(
    RouteMethod.GET,
    path,
    async (request, reply) => {
      const { params, query } = request as {
        params: { modelId: string };
        query: Querystring;
      };
      const id = (params as any)[modelId];

      const model = getModel<Document>(entity, MongooseModelsDefinitions[entity]!);
      let mainQuery = model.findById(id);
      query.populate.forEach((docName) => {
        mainQuery = mainQuery.populate(getPopulateQuery(docName, query.select));
      });
      const response = await mainQuery.select(getSelectFiltered(query.select, query.populate));

      return reply.status(Boolean(response) === false ? 404 : 200).send(response);
    },
    {
      preValidation: [
        CheckPermissions(permissions),
        preHandlerDefaults,
        validateJoiSchema(Joi.object<Querystring>().keys(querystringSchema), 'query'),
        validateJoiSchema(Joi.object().keys({ [modelId]: Joi.string().alphanum().min(24).required() }), 'params'),
      ],
      preHandler: [...(hooks.preHandler || [])],
      onSend: [...(hooks.onSend || [])],
    },
  );
