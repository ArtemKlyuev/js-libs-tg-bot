import fastify from 'fastify';

const app = fastify({ logger: true });

app.get('/', async (request, reply) => {
  return { hello: 'world' };
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
    await app.listen({ port: 3000 });
    console.log(`Server started at port ${3000}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
