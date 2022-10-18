import { FastifyPluginAsync, RequestGenericInterface } from 'fastify';
import { ReplyGenericInterface } from 'fastify/types/reply';

import { isValidationError } from '@utils';

import { Body, Reply, schema } from './schema';

interface Route extends RequestGenericInterface, ReplyGenericInterface {
  Body: Body;
  Reply: Reply;
}

export const addLibraryRoute: FastifyPluginAsync = async (app) => {
  app.post<Route>(
    '/add-library',
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
      const { name, platform, status, tags, review, score } = request.body;
    },
  );
};
