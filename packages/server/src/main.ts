import { fastifyAwilixPlugin } from '@fastify/awilix';

import { createApp } from './app';
import { apiRoutes } from './routes';
import { createDIContainer } from './diContainer';

const app = createApp();

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
