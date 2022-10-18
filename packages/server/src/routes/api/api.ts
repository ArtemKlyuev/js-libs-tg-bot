import { FastifyPluginCallback } from 'fastify';

import { addLibraryRoute } from './add-library';
import { checkExistingLibraryRoute } from './check-existing-library';

export const apiRoutes: FastifyPluginCallback = async (app) => {
  app.register(addLibraryRoute);
  app.register(checkExistingLibraryRoute);
};
