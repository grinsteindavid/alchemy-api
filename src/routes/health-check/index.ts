import MonoContext
  from '@simplyhexagonal/mono-context';
import { RouteOptions } from 'fastify';
import os from 'os';
import { getLogger } from '../../utils/logger';

export const getSystemStats = () => {
    const cpuCount = os.cpus().length;
  
    const cpuUsage = os.cpus().reduce((acc, cpu) => {
      acc.user += cpu.times.user;
      acc.system += cpu.times.sys;
      acc.idle += cpu.times.idle;
      acc.irrq += cpu.times.irq;
      return acc;
    }, { user: 0, system: 0, idle: 0, irrq: 0 });
  
    const total = cpuUsage.user + cpuUsage.system + cpuUsage.irrq;
    const idle = cpuUsage.idle;
    const usage = Math.round((total / idle) * 100);
  
    const freeMem = os.freemem() / 1024 / 1024;
    const totalMem = os.totalmem() / 1024 / 1024; 
    const memUsage = Math.round((totalMem - freeMem) * 100 / totalMem);
  
    return { cpuCount, cpuUsage: `${usage}%`, memoryUsage: `${memUsage}%` };
  }

export const healthCheckRoute: RouteOptions = {
  method: 'GET',
  url: '/health-check',
  handler: async (request, reply) => {
    const stats = {
      appVersion: MonoContext.getStateValue('version'),
      status: 'ok',
      uptime: process.uptime(),
      system: getSystemStats()
    }

    getLogger().debug(`${request.url} ${request.ip}`,JSON.stringify(stats, null, 2) );

    return stats;
  },
};
