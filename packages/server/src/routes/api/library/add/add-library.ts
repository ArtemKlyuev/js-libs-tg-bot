import { FastifyPluginAsync, RequestGenericInterface } from 'fastify';
import { ReplyGenericInterface } from 'fastify/types/reply';

import { addLibrary } from '@controllers';
import { isValidationError } from '@utils';

import { Body, Reply, schema } from './schema';

interface Route extends RequestGenericInterface, ReplyGenericInterface {
  Body: Body;
  Reply: Reply;
}

export const addLibraryRoute: FastifyPluginAsync = async (app) => {
  app.put<Route>(
    '/add',
    {
      schema,
      errorHandler(error, request, reply) {
        if (isValidationError(error)) {
          return reply.status(error.statusCode).send({ error: error.message, created: false });
        }

        return error;
      },
    },
    async (request, reply) => {
      const dbRepository = app.diContainer.resolve('notionRepository');
      const github = app.diContainer.resolve('github');
      const npmRegistry = app.diContainer.resolve('npmRegistry');

      const result = await addLibrary(request.body, { dbRepository, github, npmRegistry });

      result
        .mapRight(() => {
          reply.status(201).send({ error: null, created: true });
        })
        .mapLeft((errors) => {
          const message = Array.isArray(errors)
            ? // @ts-expect-error
              errors[0]?.message
            : // @ts-expect-error
              errors?.message ?? 'Unknown error';
          reply.status(400).send({ error: message, created: false });
        });
    },
  );
};
