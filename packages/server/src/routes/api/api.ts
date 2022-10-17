import { FastifyPluginCallback } from 'fastify';

import { checkExistingLibraryRoute } from './check-existing-library';

export const apiRoutes: FastifyPluginCallback = async (app) => {
  app.register(checkExistingLibraryRoute);
};
