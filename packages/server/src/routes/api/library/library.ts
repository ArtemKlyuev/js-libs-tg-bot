import { FastifyPluginAsync } from 'fastify';

import { addLibraryRoute } from './add';
import { checkExistingLibraryRoute } from './check-existing';
import { searchRoute } from './search';

export const libraryRoutes: FastifyPluginAsync = async (app) => {
  app.register(addLibraryRoute);
  app.register(checkExistingLibraryRoute);
  app.register(searchRoute);
};
