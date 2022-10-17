import { FastifyPluginAsync, RequestGenericInterface } from 'fastify';
import { ReplyGenericInterface } from 'fastify/types/reply';

import { Body, Reply, schema } from './schema';

interface Route extends RequestGenericInterface, ReplyGenericInterface {
  Body: Body;
  Reply: Reply;
}

export const addLibraryRoute: FastifyPluginAsync = async (app) => {
  app.post<Route>('/add-library', { schema }, async (request, reply) => {
    const { name } = request.body;

    if (!name) {
      return reply
        .code(400)
        .send({ error: `you should specify "name" body param`, created: false });
    }
  });
};
