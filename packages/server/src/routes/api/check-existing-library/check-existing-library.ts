import { FastifyPluginAsync, RequestGenericInterface } from 'fastify';
import { ReplyGenericInterface } from 'fastify/types/reply';

import { findLibrary } from '@controllers';

import { Querystring, Reply, schema } from './schema';

interface RouteConfig extends RequestGenericInterface, ReplyGenericInterface {
  Querystring: Querystring;
  Reply: Reply;
}

export const checkExistingLibraryRoute: FastifyPluginAsync = async (app) => {
  app.get<RouteConfig>('/check-existing-library', { schema }, async (request, reply) => {
    const { name } = request.query;

    if (!name) {
      return reply.code(400).send({ error: `you should specify "name" query param`, exist: false });
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
  });
};
