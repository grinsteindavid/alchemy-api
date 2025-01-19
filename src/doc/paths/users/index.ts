import { OpenAPIV3 } from 'openapi-types';
import { crudFactoryParameters } from '../../components/params';
import schemas from '../../components/schemas';
import { schemasCreateUpdateDTO } from '../../components/schemas/schemas';
import { responses } from '../../components/responses';
import UserByID from './{id}';

const path: OpenAPIV3.PathsObject = {
  '/users': {
    get: {
      security: [{ BearerAuth: [] }],
      parameters: [
        crudFactoryParameters.select,
        crudFactoryParameters.page,
        crudFactoryParameters.pageSize,
        crudFactoryParameters.sortField,
        crudFactoryParameters.sortOrder,
        crudFactoryParameters.search,
        crudFactoryParameters.searchAttribute,
        crudFactoryParameters.ids,
        crudFactoryParameters.populate,
      ],
      tags: ['Users'],
      responses: {
        '200': {
          description: '',
          content: {
            'application/json:': {
              schema: {
                type: 'array',
                items: schemas.User,
              },
            },
          },
        },
        '400': responses['400'],
        '401': responses['401'],
      },
    },
    post: {
      security: [{ BearerAuth: [] }],
      requestBody: {
        content: {
          'application/json:': {
            schema: schemasCreateUpdateDTO.User,
          },
        },
      },
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
  },
  '/users/count': {
    get: {
      security: [{ BearerAuth: [] }],
      parameters: [
        crudFactoryParameters.select,
        crudFactoryParameters.page,
        crudFactoryParameters.pageSize,
        crudFactoryParameters.sortField,
        crudFactoryParameters.sortOrder,
        crudFactoryParameters.search,
        crudFactoryParameters.searchAttribute,
        crudFactoryParameters.ids,
        crudFactoryParameters.populate,
      ],
      tags: ['Users'],
      responses: {
        '200': {
          description: '',
          content: {
            'application/json:': {
              schema: {
                type: 'number',
              },
            },
          },
        },
        '400': responses['400'],
        '401': responses['401'],
      },
    },
  },
  '/users/many': {
    post: {
      security: [{ BearerAuth: [] }],
      tags: ['Users'],
      requestBody: {
        content: {
          'application/json:': {
            schema: {
              type: 'array',
              items: schemas.User,
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Create multiple users',
          content: {
            'application/json:': {
              schema: {
                type: 'array',
                items: schemas.User,
              },
            },
          },
        },
        '400': responses['400'],
        '401': responses['401'],
      },
    },
    put: {
      security: [{ BearerAuth: [] }],
      tags: ['Users'],
      requestBody: {
        content: {
          'application/json:': {
            schema: {
              type: 'array',
              items: schemas.User,
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Update multiple users',
          content: {
            'application/json:': {
              schema: {
                type: 'array',
                items: schemas.User,
              },
            },
          },
        },
        '400': responses['400'],
        '401': responses['401'],
      },
    },
  },
  '/users/new': {
    post: {
      security: [{ BearerAuth: [] }],
      tags: ['Users'],
      requestBody: {
        content: {
          'application/json:': {
            schema: schemas.User,
          },
        },
      },
      responses: {
        '200': {
          description: 'Create a new user',
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
  ...UserByID,
};
export default path;
