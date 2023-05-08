import { fastifyAwilixPlugin } from '@fastify/awilix';
import cors from '@fastify/cors';
import auth from '@fastify/auth';
import basicAuth, { FastifyBasicAuthOptions } from '@fastify/basic-auth';

import { Config } from '@config';

import { createApp } from './app';
import { apiRoutes } from './routes';
import { createDIContainer } from './diContainer';

const configApp = async () => {
  const app = createApp();

  app.register(cors, {
    origin: Config.isDev ? '*' : Config.env.ALLOWED_ORIGINS,
    credentials: true,
  });

  await app.register(auth);

  const validate: FastifyBasicAuthOptions['validate'] = async (username, password) => {
    if (Number(username) === Config.env.LOGIN && password === Config.env.PASSWORD) {
      return;
    }

    return new Error('Invalid credentials');
  };

  await app.register(basicAuth, { validate });

  app.addHook('onRequest', app.auth([app.basicAuth]));

  app.register(fastifyAwilixPlugin, { disposeOnClose: true, disposeOnResponse: false });
  createDIContainer();
  app.register(apiRoutes, { prefix: '/api' });

  app.get('/healthcheck', async () => {
    return 'ok';
  });

  app.setErrorHandler(function (err, req, reply) {
    if (err.statusCode === 401) {
      return reply.code(401).send('unauthorized');
    }

    return reply.send(`Unknown error!\n${err}`);
  });

  app.start();
};

configApp();
