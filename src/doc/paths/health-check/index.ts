import { OpenAPIV3 } from 'openapi-types';
import { responses } from '../../components/responses';

const path: OpenAPIV3.PathsObject = {
  '/health-check': {
    get: {
      security: [{ BearerAuth: [] }],
      parameters: [],
      tags: ['Health-check'],
      responses: {
        '200': {
          description: 'Health-check',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  appVersion: {
                    type: 'string',
                    example: '0.3.42',
                  },
                  uptime: {
                    type: 'number',
                    example: 64759.479049163,
                  },
                },
              },
            },
          },
        },
        '400': responses['400'],
      },
    },
  },
};

export default path;
