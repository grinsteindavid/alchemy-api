import { Document } from 'mongoose';
import Joi from 'joi';
import { Querystring, querystringSchema } from './utils/querystring-schema';
import { THooks } from './utils/hooks-type';
import { getSearchFilter } from './utils/get-search-filter';
import { makeFastifyRoute, RouteMethod } from '../../utils/fastify';
import { ENTITIES } from '../../entities/types';
import { getModel, MongooseModelsDefinitions } from '../../utils/mongoose';
import { getDateRangeQuery } from './utils/get-date-range-query';
import { validateJoiSchema } from '../../utils/validate-joi-schema';
import { CheckPermissions } from '../../utils/check-permission';

export const count = ({
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
    RouteMethod.GET,
    path,
    async (request, reply) => {
      const { query } = request as {
        query: Querystring;
      };
      const { search, searchAttribute, dateField,dateFrom,dateTo, searchType } = query;
      let filter: Record<any, {}> = {};
      filter = getSearchFilter({ filter, search, searchAttribute, searchType, entity });

      const model = getModel<Document>(entity, MongooseModelsDefinitions[entity]!);
      let mainQuery = model.find(filter);
      mainQuery = getDateRangeQuery({query: mainQuery, dateField,dateFrom,dateTo});
      const response = await mainQuery.count();
      return reply.status(200).send(response);
    },
    {
      preValidation: [CheckPermissions(permissions), validateJoiSchema(Joi.object<Querystring>().keys(querystringSchema), 'query')],
      preHandler: [...(hooks.preHandler || [])],
      onSend: [...(hooks.onSend || [])],
    },
  );
