import { FastifyPluginCallback } from 'fastify';

import { findLibrary } from '@controllers';

export const checkExistingLibraryRoute: FastifyPluginCallback = async (app) => {
  app.get(
    '/check-existing-library',
    { schema: { querystring: { name: { type: 'string' } } } },
    async (request, reply) => {
      const { name } = request.query;

      if (!name) {
        return reply
          .code(400)
          .send({ error: `you should specify "name" query param`, exist: false });
      }

      const dbRepository = app.diContainer.resolve('notionRepository');

      const result = await findLibrary(name, dbRepository);

      result
        .mapRight(() => {
          reply.status(200).send({ error: null, exist: true });
        })
        .mapLeft(({ message }) => {
          reply.status(400).send({ error: message, exist: false });
        });
    },
  );
};
