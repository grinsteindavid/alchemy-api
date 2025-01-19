import { Document } from 'mongoose';
import Joi from 'joi';
import { THooks } from './utils/hooks-type';
import { makeFastifyRoute, RouteMethod } from '../../utils/fastify';
import { ENTITIES } from '../../entities/types';
import { getModel, MongooseModelsDefinitions } from '../../utils/mongoose';
import { validateJoiSchema } from '../../utils/validate-joi-schema';
import { CheckPermissions } from '../../utils/check-permission';
import { Querystring, querystringSchema } from './utils/querystring-schema';
import { getSearchFilter } from './utils/get-search-filter';
import { getDateRangeQuery } from './utils/get-date-range-query';
import { getPopulateQuery } from './utils/get-populate-query';
import { setQueryPagination } from './utils/set-query-pagination';
import { getSelectFiltered } from './utils/get-select-filtered';
import { preHandlerDefaults } from './utils/pre-handler-defaults';

export const readMany = ({
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
        headers: any;
        params: any;
        query: Querystring;
      };
      const { ids, page, pageSize, populate, search, searchAttribute, select, sortField, sortOrder, dateField,dateFrom,dateTo, searchType} = query;
      let filter: Record<any, {}> = {};

      filter = getSearchFilter({ filter, search, searchAttribute, searchType, entity });
      filter = ids ? { ...filter, _id: { $in: ids } } : filter;

      const model = getModel<Document>(entity, MongooseModelsDefinitions[entity]!);
      let mainQuery = model.find(filter);
      mainQuery = getDateRangeQuery({query: mainQuery, dateField,dateFrom,dateTo});
      populate.forEach((docName) => {
        mainQuery = mainQuery.populate(getPopulateQuery(docName, select));
      });
      const response = await setQueryPagination({
        query: mainQuery,
        page,
        pageSize,
        sortField,
        sortOrder,
      }).select(getSelectFiltered(select, populate));
      return reply.status(200).send(response);
    },
    {
      preValidation: [
        CheckPermissions(permissions),
        preHandlerDefaults,
        validateJoiSchema(Joi.object<Querystring>().keys(querystringSchema), 'query'),
      ],
      preHandler: [...(hooks.preHandler || [])],
      onSend: [...(hooks.onSend || [])],
    },
  );
