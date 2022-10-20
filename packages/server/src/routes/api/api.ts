import { FastifyPluginCallback } from 'fastify';

import { libraryRoutes } from './library';

export const apiRoutes: FastifyPluginCallback = async (app) => {
  app.register(libraryRoutes, { prefix: '/library' });
};
