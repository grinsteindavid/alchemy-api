import { FastifyRequest, FastifyReply } from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { AsyncValidationOptions, AnySchema } from 'joi';
import _ from 'lodash';

export const validateJoiSchema =
  (
    schema: AnySchema,
    requestPayloadType: keyof FastifyRequest<RouteGenericInterface, Server, IncomingMessage, unknown>,
    schemaOptions?: AsyncValidationOptions,
  ) =>
  async (
    req: FastifyRequest<RouteGenericInterface, Server, IncomingMessage, unknown>,
    reply: FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown>,
  ) => {
    let payload = _.cloneDeep(req[requestPayloadType]);

    try {
      await schema.validateAsync(
        payload,
        schemaOptions || {
          abortEarly: false,
          stripUnknown: true,
        },
      );
    } catch (error) {
      reply.code(400);
      throw Error((error as unknown as Error).message);
    }
  };
