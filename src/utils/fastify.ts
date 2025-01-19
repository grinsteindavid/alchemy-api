import {
    FastifyReply,
    FastifyRequest,
    RouteOptions,
    FastifyInstance,
    preValidationHookHandler,
  } from 'fastify';

  export enum RouteMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
    HEAD = 'HEAD',
    OPTIONS = 'OPTIONS',
  }
  
  export const makeFastifyRoute = (
    method: `${RouteMethod}`,
    url: string,
    handler: (req: FastifyRequest, reply: FastifyReply) => Promise<void>,
    extraOptions?: Partial<Omit<RouteOptions, 'handler'>>,
  ): RouteOptions => {
    if (
      (RouteMethod.POST === method || RouteMethod.PUT === method) &&
      (extraOptions?.preValidation === undefined || extraOptions?.preValidation?.length === 0)
    ) {
      throw new Error('POST and PUT must be accompanied by a preValidation hook and joi schema');
    }
  
    if (url.includes(':') && (extraOptions?.preValidation === undefined || extraOptions?.preValidation?.length === 0)) {
      throw new Error('URL Params must be accompanied by a preValidation hook and joi schema');
    }
  
    return {
      ...extraOptions,
      method,
      url,
      handler,
    };
  };
  
  export const registerRoutes = (
    fastify: FastifyInstance,
    routes: RouteOptions[],
    preValidationHookHandler?: preValidationHookHandler,
  ) => {
    if (preValidationHookHandler) {
      fastify.addHook('preValidation', preValidationHookHandler);
    }
    routes.map((route) => fastify.route(route));
  };