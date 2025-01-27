// @ts-ignore
import { version, name } from '../../package.json';

import qs from 'qs';
import fastify from 'fastify';
import compress from '@fastify/compress';
import MonoContext from '@simplyhexagonal/mono-context';
import FastifySwagger from '@fastify/swagger';
import FastifySecureSession from '@fastify/secure-session';
import fastifyCors from 'fastify-cors';
import { ApolloServer } from 'apollo-server-fastify';

import { requestContext, fastifyRequestContextPlugin } from '@fastify/request-context';
import SwaggerDoc from '../doc/api';
import { openRoutes, protectedRoutes, tokenRoutes } from '../routes';
import { initMongoose } from '../data-sources/mongoose';
import { getLogger } from '../utils/logger';
import printRoutesPlugin from '../utils/print-routes';
import { printUndocumentedRoutes } from '../utils/print-undocumented-routes';
import { registerRoutes } from '../utils/fastify';
import { registerMongooseModels } from '../utils/mongoose';
import { generateGraphqlEntityQueryFields } from '../utils/graphql';
import { verify } from '../utils/auth';

const {
  NODE_ENV,
  SECRET_TOKEN,
  LOG_LEVEL,
  SESSION_SECRET,
  SESSION_SALT,
  SWAGGER_UI_TOKEN,
  DISCORD_WEBHOOK,
  AUTH_SECRET
} = process.env;

MonoContext.setState({
  version,
  secret: null,
  appName: name,
  isSentryRunning: true,
});

interface Fastify {
  register: (plugin: any) => void;
  addHook: (hook: string, handler: (request: any, reply: any, error: Error) => void) => void;
}

export const connectDatasources = async () => {
  await initMongoose();
  registerMongooseModels();
};

export const getApplication = async () => {
  const app = fastify({
    logger: LOG_LEVEL === 'debug',
    querystringParser: (str) => qs.parse(str),
    bodyLimit: 10 * 1024 * 1024, // 10mb
  });

  app.setErrorHandler((error, request, reply) => {
    app.log.error(error);
    if (Boolean(DISCORD_WEBHOOK))
      getLogger().channel('api-errors').error({
        url: request.url,
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

    const response = { message: error.message, error: error };
    reply.status(500).send(response);
  });

  getLogger().info(
    `Environment Variables - SESSION_SECRET: ${Boolean(SESSION_SECRET)}, SESSION_SALT: ${Boolean(
      SESSION_SALT,
    )}, AUTH_SECRET: ${Boolean(AUTH_SECRET)}, SECRET_TOKEN: ${Boolean(SECRET_TOKEN)}, SWAGGER_UI_TOKEN: ${Boolean(
      SWAGGER_UI_TOKEN,
    )}`,
  );
  
  await app.register(FastifySecureSession, {
    cookieName: `${name}${version}`,
    secret: SESSION_SECRET as string,
    salt: SESSION_SALT as string,
    logLevel: LOG_LEVEL === 'debug' ? 'debug' : 'error',
  });

  const apolloServer = new ApolloServer({
    schema: generateGraphqlEntityQueryFields(),
    debug: NODE_ENV !== 'production',
    introspection: true,
  });
  await apolloServer.start();

  await app.register(compress, {
    encodings: ['gzip'],
    threshold: 1024,
  });
  await app.register(require('@fastify/multipart'));
  await app.register(fastifyRequestContextPlugin);
  await app.register(printRoutesPlugin);
  await app.register(apolloServer.createHandler(), { prefix: '/api/v1' });

  app.addHook('onRequest', async (request, reply) => {
    const { headers, routerPath, query } = request;
    if (routerPath === '/api/v1/graphql' && NODE_ENV === 'production') {
      const token = (query as { token?: string }).token;
      const normalizedHeaders = headers.authorization ? headers : { authorization: `Bearer ${token}` };

      try {
        const user = await verify(normalizedHeaders)
        requestContext.set('auth/user', user);
      } catch (error) {
        reply.code(401);
        reply.send((error as unknown as Error).message);
      }
    }
  });
  await app.register(printUndocumentedRoutes);

  await app.register(fastifyCors, {
    origin: '*',
    methods: ['POST', 'GET', 'PUT', 'OPTIONS', 'PATCH', 'DELETE'],
    strictPreflight: false,
  });
  await app.register(FastifySwagger, {
    routePrefix: 'api/doc',
    exposeRoute: true,
    mode: 'static',
    uiHooks: {
      onRequest: async (req: any, reply: any) => {
        const { swaggerToken } = req.query as { swaggerToken: string };
        // @ts-ignore
        const swaggerSession = req.session.get('FastifySwagger|isValid');

        if (swaggerSession === undefined && swaggerToken !== SWAGGER_UI_TOKEN) {
          reply.status(401).send(`Unauthorized`);
          return;
        }

        if (swaggerToken === SWAGGER_UI_TOKEN) {
          // @ts-ignore
          req.session.set('FastifySwagger|isValid', true);
          reply.redirect(`/api/doc`);
        }
      },
    },
    uiConfig: { validatorUrl: null, syntaxHighlight: false },
    specification: {
      document: SwaggerDoc,
    },
  });

  await app.register(
    (instance, options, next) => {
      registerRoutes(instance, openRoutes);
      next();
    },
    { prefix: '/api/v1' },
  );

  await app.register(
    (instance, options, next) => {
      registerRoutes(instance, protectedRoutes, async ({ headers, query}, reply) => {
        try {
          const token = (query as { token?: string }).token;
          const normalizedHeaders = headers.authorization ? headers : { authorization: `Bearer ${token}` };
          const user = await verify(normalizedHeaders)
          requestContext.set('auth/user', user);
        } catch (error) {
          reply.code(401);
          reply.send((error as unknown as Error).message);
        }
      });
      next();
    },
    { prefix: '/api/v1' },
  );

  await app.register(
    (instance, options, next) => {
      registerRoutes(instance, tokenRoutes, async ({ headers }, reply) => {
        if (NODE_ENV === 'production' && headers.authorization !== `Bearer ${SECRET_TOKEN}`) {
          reply.code(401);
          reply.send('Invalid application secret token');
        }
      });
      next();
    },
    { prefix: '/api/v1' },
  );

  return app;
};
