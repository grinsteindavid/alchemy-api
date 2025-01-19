import { RouteOptions } from 'fastify';

import { healthCheckRoute } from './health-check';
import { usersRoutes } from './users';

export const tokenRoutes: RouteOptions[] = [];

export const protectedRoutes: RouteOptions[] = [...usersRoutes];

export const openRoutes = [healthCheckRoute];
