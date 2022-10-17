import fastify from 'fastify';
import { fastifyAwilixPlugin } from '@fastify/awilix';

import { apiRoutes } from './routes';

import { createDIContainer } from './diContainer';

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
};

const env = process.env.NODE_ENV!;

// @ts-expect-error
const app = fastify({ logger: envToLogger[env] ?? true });

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

const start = async () => {
  try {
    const url = await app.listen({ port: 3000 });
    console.log(`Server started at ${url}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
