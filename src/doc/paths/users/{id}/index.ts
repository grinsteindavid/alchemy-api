import { OpenAPIV3 } from 'openapi-types';
import { crudFactoryParameters } from '../../../components/params';
import schemas from '../../../components/schemas';
import { schemasCreateUpdateDTO } from '../../../components/schemas/schemas';
import { responses } from '../../../components/responses';

const path: OpenAPIV3.PathsObject = {
  '/users/{id}': {
    get: {
      security: [{ BearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', schema: { type: 'string' }, required: true },
        crudFactoryParameters.select,
        crudFactoryParameters.populate,
      ],
      tags: ['Users'],
      responses: {
        '200': {
          description: '',
          content: {
            'application/json:': {
              schema: schemas.User,
            },
          },
        },
        '400': responses['400'],
        '401': responses['401'],
        '404': responses['404'],
      },
    },
    put: {
      security: [{ BearerAuth: [] }],
      parameters: [{ in: 'path', name: 'id', schema: { type: 'string' }, required: true }],
      tags: ['Users'],
      requestBody: {
        description: '',
        content: {
          'application/json': {
            schema: {
              ...schemasCreateUpdateDTO.User,
              properties: {
                ...schemasCreateUpdateDTO.User.properties,
                credentials: {
                  type: 'object',
                  properties: {
                    current: { type: 'string' },
                    newPassword: { type: 'string' },
                  },
                  required: ['current', 'newPassword'],
                },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: '',
          content: {
            'application/json:': {
              schema: schemas.User,
            },
          },
        },
        '400': responses['400'],
        '401': responses['401'],
      },
    },
  },
};

export default path;
