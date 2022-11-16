import { FastifyPluginCallback } from 'fastify';

import { propertiesRoute } from './properties';
import { libraryRoutes } from './library';

export const apiRoutes: FastifyPluginCallback = async (app) => {
  app.register(propertiesRoute);
  app.register(libraryRoutes, { prefix: '/library' });
};
