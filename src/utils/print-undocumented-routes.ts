import MonoContext from '@simplyhexagonal/mono-context';
import { FastifyError, FastifyInstance, FastifyPluginOptions } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { getLogger } from './logger';

export const printUndocumentedRoutes = fastifyPlugin(function (
  instance: FastifyInstance,
  options: FastifyPluginOptions,
  done: (error?: FastifyError) => void,
): void {
  instance.addHook('onRoute', (route) => {
    const { routePath, method } = route;
    const appRoutes = MonoContext.getStateValue('appRoutes') || [];
    MonoContext.setState({
      appRoutes: [...appRoutes, { routePath, method }],
    });
  });

  instance.addHook('onReady', (done) => {
    const appRoutes: { routePath: string; method: string }[] = MonoContext.getStateValue('appRoutes') || [];
    // @ts-ignore
    const swaggerRoutes: Record<string, any> = instance.swagger().paths!;
    let warnings: string[] = [];

    appRoutes
      .filter(
        (r) =>
          ![`*`, 'swagger', 'doc', '/uiConfig', '/json', '/yaml', '/initOAuth', '/static/*', '/*'].includes(
            r.routePath,
          ) && r.routePath.length > 0,
      )
      .forEach((route) => {
        if (
          Object.keys(swaggerRoutes).some(
            (r) =>
              r
                .replace(/^\/{version}\//, '/')
                .replace(/{([^}]*)}/g, ':$1')
                .replace(/\/v1\//g, '/')
                .replace(/\/v2\//g, '/') === route.routePath &&
              Object.keys(swaggerRoutes[r]).includes(route.method.toLowerCase()),
          ) === false
        ) {
          warnings.push(`${route.routePath} - ${route.method}`);
        }
      });

    getLogger().warn(`The following routes did not match in Swagger Doc:`, warnings);
    done();
  });

  done();
});
