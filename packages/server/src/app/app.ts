import fastify from 'fastify';

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

interface Options {
  port?: number | undefined;
}

export const createApp = ({ port }: Options = { port: 3000 }) => {
  // @ts-expect-error
  const app = fastify({ logger: envToLogger[env] ?? true });

  const start = async () => {
    try {
      const url = await app.listen({ port });
      console.log(`Server started at ${url}`);
    } catch (err) {
      app.log.error(err);
      process.exit(1);
    }
  };

  return { ...app, start };
};