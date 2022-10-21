import { FastifyPluginAsync, RequestGenericInterface } from 'fastify';
import { ReplyGenericInterface } from 'fastify/types/reply';

import { isValidationError } from '@utils';

import { Querystring, Reply, schema } from './schema';

interface RouteConfig extends RequestGenericInterface, ReplyGenericInterface {
  Querystring: Querystring;
  Reply: Reply;
}

export const checkExistingLibraryRoute: FastifyPluginAsync = async (app) => {
  app.get<RouteConfig>(
    '/search',
    {
      schema,
      errorHandler(error, request, reply) {
        if (isValidationError(error)) {
          return reply.status(error.statusCode).send({ error: error.message, results: null });
        }

        throw error;
      },
    },
    async (request, reply) => {
      const { sort, direction, ...filtersQuery } = request.query;

      if (!sort && direction) {
        return reply
          .status(422)
          .send({ error: '"sort" param must be defined when defining "direction"', results: [] });
      }

      const filtersKeys = Object.keys(filtersQuery);

      if (!filtersKeys.length) {
        return reply
          .status(422)
          .send({ error: 'Filters must have minimum 1 active filter', results: [] });
      }

      //   const { name } = request.query;

      const dbRepository = app.diContainer.resolve('notionRepository');

      //   const result = await findLibrary(name, dbRepository);

      //   result
      //     .mapRight(() => {
      //       reply.status(200).send({ error: null, exist: true });
      //     })
      //     .mapLeft(({ message }) => {
      //       reply.status(400).send({ error: message, exist: false });
      //     });
    },
  );
};
