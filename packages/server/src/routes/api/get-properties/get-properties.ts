import { FastifyPluginAsync, RequestGenericInterface } from 'fastify';
import { ReplyGenericInterface } from 'fastify/types/reply';

import { getLibraryProperties } from '@controllers';
import { isValidationError } from '@utils';

import { Reply, schema } from './schema';

interface Route extends RequestGenericInterface, ReplyGenericInterface {
  Reply: Reply;
}

export const getPropertiesRoute: FastifyPluginAsync = async (app) => {
  app.get<Route>(
    '/get-properties',
    {
      schema,
      errorHandler(error, request, reply) {
        if (isValidationError(error)) {
          return reply.status(error.statusCode).send({ error: error.message, created: false });
        }

        throw error;
      },
    },
    async (request, reply) => {
      const dbRepository = app.diContainer.resolve('notionRepository');

      const result = await getLibraryProperties(dbRepository);

      result
        .mapRight((properties) => {
          reply.status(200).send({ error: null, properties });
        })
        .mapLeft(({ code, message }) => {
          reply.status(code).send({ error: message, properties: [] });
        });
    },
  );
};
