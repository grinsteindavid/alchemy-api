import { OpenAPIV3 } from 'openapi-types';
import { components, servers } from './components';
import paths from './paths';

const API: OpenAPIV3.Document = {
  openapi: '3.0.2',
  info: {
    title: 'Alchemy API',
    version: '1.0',
    description: '',
  },
  tags: [
    { name: 'Users' },
    { name: 'Health-check' },
  ],

  security: [{ BearerAuth: [] }],
  components: components,
  servers: servers,
  paths: paths,
};

export default API;
