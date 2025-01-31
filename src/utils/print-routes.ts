import { FastifyError, FastifyInstance, FastifyPluginOptions, RouteOptions } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { table } from 'table';

interface RouteConfig {
  [key: string]: any;
}

const methodsOrder = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH', 'OPTIONS'];

function getRouteConfig(r: RouteOptions): RouteConfig {
  return (r.config as RouteConfig) ?? {};
}

function sortRoutes(a: RouteOptions, b: RouteOptions): number {
  return a.url.localeCompare(b.url);
}

function unifyRoutes(routes: RouteOptions[]): RouteOptions[] {
  const routesMap = new Map<string, RouteOptions>();

  for (const route of routes) {
    const unifiedRoute = routesMap.get(route.url);

    if (unifiedRoute) {
      if (typeof unifiedRoute.method === 'string') {
        unifiedRoute.method = [unifiedRoute.method];
      }

      // Unify the routes
      if (typeof route.method === 'string') {
        unifiedRoute.method.push(route.method);
      } else {
        unifiedRoute.method.push(...route.method);
      }

      // Remove the description as it is now not appropriate anymore
      const config = unifiedRoute?.config as RouteConfig | undefined;

      if (config) {
        config.description = undefined;
      }
    } else {
      routesMap.set(route.url, route);
    }
  }

  return [...routesMap.values()].sort(sortRoutes);
}

function printRoutes(routes: RouteOptions[], useColors: boolean, compact: boolean): void {
  if (routes.length === 0) {
    return;
  }

  // Sort and eventually unify routes
  routes = routes.filter((r) => getRouteConfig(r).hide !== true).sort(sortRoutes);

  if (compact) {
    routes = unifyRoutes(routes);
  }

  const hasDescription = routes.some((r) => 'description' in getRouteConfig(r));

  // Build the output
  const headers = ['Method(s)', 'Path'];

  if (hasDescription) {
    headers.push('Description');
  }

  const rows: string[][] = [headers];

  for (const route of routes) {
    const methods = Array.isArray(route.method) ? route.method : [route.method];

    const row = [methods.sort((a, b) => methodsOrder.indexOf(a) - methodsOrder.indexOf(b)).join(' | '), `${route.url}`];

    if (hasDescription) {
      row.push(`${getRouteConfig(route).description ?? ''}`);
    }

    rows.push(row);
  }

  const output = table(rows, {
    columns: {
      0: {
        alignment: 'right',
      },
      1: {
        alignment: 'left',
      },
      2: {
        alignment: 'left',
      },
    },
    drawHorizontalLine(index: number, size: number): boolean {
      return index < 2 || index > size - 1;
    },
  });

  console.log(`Available routes:\n\n${output}`);
}

export const printRoutesPlugin = fastifyPlugin(
  function (instance: FastifyInstance, options: FastifyPluginOptions, done: (error?: FastifyError) => void): void {
    const useColors = options.useColors ?? true;
    const compact = options.compact ?? false;

    const routes: RouteOptions[] = [];

    // Utility to track all the RouteOptionss we add
    instance.addHook('onRoute', (route) => {
      routes.push(route);
    });

    instance.addHook('onReady', (done) => {
      printRoutes(routes, useColors, compact);
      done();
    });

    done();
  },
  { name: 'fastify-print-routes', fastify: '3.x' },
);

export default printRoutesPlugin;
