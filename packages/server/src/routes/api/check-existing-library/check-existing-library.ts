import { FastifyPluginAsync, RequestGenericInterface } from 'fastify';
import { ReplyGenericInterface } from 'fastify/types/reply';

import { findLibrary } from '@controllers';

import { Querystring, Reply, schema } from './schema';

interface RouteConfig extends RequestGenericInterface, ReplyGenericInterface {
  Querystring: Querystring;
  Reply: Reply;
}

export const checkExistingLibraryRoute: FastifyPluginAsync = async (app) => {
  app.get<RouteConfig>(
    '/check-existing-library',
    {
      schema,
      errorHandler(error, request, reply) {
        if ('validation' in error) {
          return reply.status(error.statusCode!).send({ error: error.message, exist: false });
        }

        throw error;
      },
    },
    async (request, reply) => {
      const { name } = request.query;

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
