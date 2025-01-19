import { OpenAPIV3 } from 'openapi-types';
import schemas from './schemas';
import { responses } from './responses';

export const servers: OpenAPIV3.ServerObject[] = [
  {
    url: `http://localhost:${process.env.PORT}/api/v1`,
    description: 'Local',
  },
];

export const components: OpenAPIV3.ComponentsObject = {
  securitySchemes: {
    BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
  },
  responses,
  schemas,
};

