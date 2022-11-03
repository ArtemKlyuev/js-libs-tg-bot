import { fastifyAwilixPlugin } from '@fastify/awilix';
import cors from '@fastify/cors';

import { createApp } from './app';
import { apiRoutes } from './routes';
import { createDIContainer } from './diContainer';

const app = createApp();

await app.register(cors, { origin: true, credentials: true });

app.addHook('onRequest', (request, reply, done) => {
  // TODO: auth check goes here
  done();
});

app.register(fastifyAwilixPlugin, { disposeOnClose: true, disposeOnResponse: true });
createDIContainer();
app.register(apiRoutes, { prefix: '/api' });

app.get('/healthcheck', async (request, reply) => {
  return 'ok';
});

app.start();
