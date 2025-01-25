import MonoContext
  from '@simplyhexagonal/mono-context';
import { RouteOptions } from 'fastify';
import { getLogger } from '../../utils/logger';
import { getSystemStats } from '../../utils/get-system-stats';

export const healthCheckRoute: RouteOptions = {
  method: 'GET',
  url: '/health-check',
  handler: async (request, reply) => {
    const stats = {
      appVersion: MonoContext.getStateValue('version'),
      status: 'ok',
      uptime: process.uptime(),
      system: await getSystemStats()
    }

    getLogger().debug(`${request.url} ${request.ip}`,JSON.stringify(stats, null, 2) );

    return stats;
  },
};
