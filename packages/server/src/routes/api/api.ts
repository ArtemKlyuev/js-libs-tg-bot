import { FastifyPluginCallback } from 'fastify';

import { getPropertiesRoute } from './get-properties';
import { libraryRoutes } from './library';

export const apiRoutes: FastifyPluginCallback = async (app) => {
  app.register(getPropertiesRoute);
  app.register(libraryRoutes, { prefix: '/library' });
};
