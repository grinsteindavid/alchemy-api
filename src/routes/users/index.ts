import { RouteOptions } from 'fastify';
import * as CrudFactory from '../../factory/crud';

export const usersRoutes: RouteOptions[] = [
  CrudFactory.readOne({ entity: 'User', modelId: 'id', path: '/users/:id' }),
  CrudFactory.readMany({
    entity: 'User',
    path: '/users',
    permissions: ['users'],
    hooks: { preHandler: [] },
  }),
  CrudFactory.createOne({
    entity: 'User',
    path: '/users',
    hooks: { onSend: [], preHandler: [] },
  }),
  CrudFactory.createMany({ entity: 'User', path: '/users/many' }),
  CrudFactory.updateOne({ entity: 'User', modelId: 'id', path: '/users/:id' }),
  CrudFactory.updateMany({ entity: 'User', path: '/users/many' }),
  CrudFactory.count({
    entity: 'User',
    path: '/users/count',
    permissions: ['users'],
    hooks: { preHandler: [] },
  }),
  CrudFactory.deleteMany({ entity: 'User', path: '/users/many' }),
];
