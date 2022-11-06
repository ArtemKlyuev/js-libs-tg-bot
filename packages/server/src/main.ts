import { fastifyAwilixPlugin } from '@fastify/awilix';
import cors from '@fastify/cors';

import { Config } from '@config';

import { createApp } from './app';
import { apiRoutes } from './routes';
import { createDIContainer } from './diContainer';

const app = createApp();

app.register(cors, {
  origin: Config.env.ALLOWED_ORIGINS,
  credentials: true,
});

app.addHook('onRequest', (request, reply, done) => {
  // TODO: auth check goes here
  done();
});

app.register(fastifyAwilixPlugin, { disposeOnClose: true, disposeOnResponse: false });
createDIContainer();
app.register(apiRoutes, { prefix: '/api' });

app.get('/healthcheck', async () => {
  return 'ok';
});

app.start();
