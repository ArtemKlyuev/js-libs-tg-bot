import { FastifyPluginAsync } from 'fastify';

import { addLibraryRoute } from './add';
import { checkExistingLibraryRoute } from './check-existing';

export const libraryRoutes: FastifyPluginAsync = async (app) => {
  app.register(addLibraryRoute);
  app.register(checkExistingLibraryRoute);
};
