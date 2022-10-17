import { FastifyPluginCallback } from 'fastify';

export const addLibraryRoute: FastifyPluginCallback = async (app) => {
  app.post(
    '/add-library',
    { schema: { querystring: { name: { type: 'string' } } } },
    async (request, reply) => {},
  );
};
