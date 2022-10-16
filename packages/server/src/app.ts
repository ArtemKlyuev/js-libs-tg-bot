import fastify from 'fastify';
import { fastifyAwilixPlugin } from '@fastify/awilix';

const app = fastify({ logger: true });

app.register(fastifyAwilixPlugin, { disposeOnClose: true, disposeOnResponse: true });

app.get('/healthcheck', async (request, reply) => {
  return 'ok';
});

app.get(
  '/check-library',
  { schema: { querystring: { name: { type: 'string' } } } },
  async (request, reply) => {
    if (!request.query.name) {
      return reply.code(400).send({ error: `you should specify "name" param` });
    }

    // return `requested library: ${String(request.query)}`;
    return `requested library: kek`;
  },
);

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
