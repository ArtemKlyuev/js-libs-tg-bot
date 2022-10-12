import fastify from 'fastify';

const app = fastify({ logger: true });

app.get('/', async (request, reply) => {
  return { hello: 'world' };
});

app.get('/check-library', async (request, reply) => {
  return { hello: 'world' };
});

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
