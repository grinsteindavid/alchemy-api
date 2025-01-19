import { FastifyRequest, FastifyReply } from 'fastify';

export const preHandlerDefaults = async (
  req: FastifyRequest<any, any, any, any>,
  reply: FastifyReply<any, any, any, any, any>,
) => {

  const { query } = req as { query: any };

  query.populate = Array.isArray(query.populate) ? query.populate : [];

  if (query.pageSize) {
    query.pageSize = parseInt(query.pageSize);
  }

  if (query.page) {
    query.page = parseInt(query.page);
  }

  if (query.select && (query.select as string).split(' ').some((item) => item === '_id') === false) {
    query.select = `_id ${query.select}`;
  }

  if (query.ids) {
    query.ids = query.ids.split(',');
  }

  if(query.dateFrom) {
    query.dateFrom = new Date(query.dateFrom);
  }

  if(query.dateTo) {
    query.dateTo = new Date(query.dateTo);
  }

  if(query.sortField && Array.isArray(query.sortField) === false) {
    query.sortField = [query.sortField]
  }

  query.searchType = query.searchType || 'regex';
};
