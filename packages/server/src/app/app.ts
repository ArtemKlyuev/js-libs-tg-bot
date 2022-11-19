import fastify from 'fastify';

import { Config } from '@config';

interface Options {
  host?: string;
  port?: number | undefined;
}

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

const DEFAULT_OPTIONS: Options = { host: Config.env.HOST, port: Config.env.PORT };

export const createApp = (options?: Options) => {
  const app = fastify({
    logger: envToLogger[Config.env.NODE_ENV] ?? true,
    ignoreTrailingSlash: true,
  });

  const { port } = { ...DEFAULT_OPTIONS, ...options };

  const start = async () => {
    try {
      await app.listen({ port });
    } catch (err) {
      app.log.error(err);
      process.exit(1);
    }
  };

  app.decorate('start', start);

  return app;
};
