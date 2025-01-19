import { FastifyRequest, FastifyReply } from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { requestContext } from '@fastify/request-context';
import { getLogger } from './logger';

export const CheckPermissions =
  (permissions: string[]) =>
  async (
    req: FastifyRequest<RouteGenericInterface, Server, IncomingMessage, unknown>,
    reply: FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown>,
  ) => {
    const {} = req as FastifyRequest<{}>;

    if (permissions.length === 0) {
      return;
    }

    const user: { _id: string; permissions: string[] } | undefined = requestContext.get('auth/user');

    if (Boolean(user) === false) {
      reply.code(500);
      throw Error('User is not authenticated');
    }

    if (user?.permissions.length === 0) {
      reply.code(500);
      throw Error('User does not have any permissions');
    }

    permissions.forEach((permission) => {
      if (user?.permissions.some((userPermission) => userPermission === permission) === false) {
        getLogger().warn(`User ${user!._id} has no access to ${permission}`);
        reply.code(403);
        throw Error(`User ${user!._id} has no access to ${permission}`);
      }
    });
  };
