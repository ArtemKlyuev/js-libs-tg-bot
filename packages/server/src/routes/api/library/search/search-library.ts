import { FastifyPluginAsync, RequestGenericInterface } from 'fastify';
import { ReplyGenericInterface } from 'fastify/types/reply';

import { isValidationError } from '@utils';
import { SearchFilters, searchLibraryByFilters, searchLibraryByQuery } from '@controllers';

import { Querystring, Reply, schema } from './schema';

interface RouteConfig extends RequestGenericInterface, ReplyGenericInterface {
  Querystring: Querystring;
  Reply: Reply;
}

export const searchRoute: FastifyPluginAsync = async (app) => {
  app.get<RouteConfig>(
    '/search',
    {
      schema,
      errorHandler(error, request, reply) {
        if (isValidationError(error)) {
          return reply.status(error.statusCode).send({ error: error.message, results: null });
        }

        return error;
      },
    },
    async (request, reply) => {
      const { query } = request.query;

      if (query) {
        const result = await searchLibraryByQuery(
          query,
          request.diScope.resolve('notionRepository'),
        );

        result
          .mapRight((libraries) => {
            reply.status(200).send({ error: null, results: libraries });
          })
          .mapLeft((error) => {
            reply.status(error.code).send({ error: error.message, results: [] });
          });

        return;
      }

      // TODO: filters

      // const { sort, direction, ...filters } = request.query;

      // if (!sort && direction) {
      //   return reply
      //     .status(422)
      //     .send({ error: '"sort" param must be defined when defining "direction"', results: [] });
      // }

      // const filtersKeys = Object.keys(filters);

      // if (!filtersKeys.length) {
      //   return reply
      //     .status(422)
      //     .send({ error: 'Filters must have minimum 1 active filter', results: [] });
      // }

      // const dbRepository = app.diContainer.resolve('notionRepository');

      // const finalFilters: SearchFilters = sort
      //   ? { filters, sort: { property: sort, direction: direction ?? 'descending' } }
      //   : { filters };

      // const result = await searchLibraryByFilters(finalFilters, { dbRepository });

      // result
      //   .mapRight(() => {
      //     reply.status(200).send({ error: null, exist: true });
      //   })
      //   .mapLeft(({ message }) => {
      //     reply.status(400).send({ error: message, exist: false });
      //   });
    },
  );
};
