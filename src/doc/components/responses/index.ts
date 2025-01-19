import { OpenAPIV3 } from 'openapi-types';
import { IResponse } from '../types';

export const responses: Record<IResponse, OpenAPIV3.ResponseObject> = {
  '400': {
    description: '',
    content: {
      'application/json:': {
        schema: {
          type: 'string',
          example: 'User errors like validation failed.',
        },
      },
    },
  },
  '401': {
    description: '',
    content: {
      'application/json:': {
        schema: {
          type: 'string',
          example: 'Unauthorized',
        },
      },
    },
  },
  '404': {
    description: '',
    content: {
      'application/json:': {
        schema: {
          type: 'string',
          example: 'Not Found',
        },
      },
    },
  },
  '412': {
    description: '',
    content: {
      'application/json:': {
        schema: {
          type: 'string',
          example: 'Not Supported',
        },
      },
    },
  },
  bulkWrite: {
    description: '',
    content: {
      'application/json:': {
        schema: {
          type: 'object',
          properties: {
            ok: { type: 'number' },
            writeErrors: { type: 'array', items: {} },
            writeConcernErrors: { type: 'array', items: {} },
            insertedIds: { type: 'array', items: { type: 'string' } },
            nInserted: { type: 'number' },
            nUpserted: { type: 'number' },
            nMatched: { type: 'number' },
            nModified: { type: 'number' },
            nRemoved: { type: 'number' },
            upserted: { type: 'array', items: {} },
            lastOp: {
              type: 'object',
              properties: {
                ts: { type: 'string' },
                t: { type: 'number' },
              },
            },
          },
        },
      },
    },
  },
};
