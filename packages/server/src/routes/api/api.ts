import { FastifyPluginCallback } from 'fastify';
import { findLibrary } from '@controllers';

export const apiRoutes: FastifyPluginCallback = (app, options, done) => {
  app.get(
    '/check-existing-library',
    { schema: { querystring: { name: { type: 'string' } } } },
    async (request, reply) => {
      const { name } = request.query;

      if (!name) {
        return reply.code(400).send({ error: `you should specify "name" query param` });
      }

      // app.diContainer.cradle;

      // console.log('cardle', app.diContainer.cradle.notionRepository);

      const dbRepository = app.diContainer.resolve('notionRepository');

      console.log('dbRepository');

      const result = await findLibrary(name, dbRepository);

      result
        .mapRight(({ Name }) => {
          reply.status(200).send({ error: null, exist: true });
        })
        .mapLeft(({ message }) => {
          reply.status(400).send({ error: message, exist: false });
        });

      // result.mapLeft((err) => {
      //   console.log('EEEE', err);
      // });

      // try {
      //   result.unwrap();
      // } catch (error) {
      //   console.log('eerrrrrrrrrr', error);
      // }

      // // const res2 = result.unwrap();

      // // return `requested library: ${String(request.query)}`;
      // // return `requested library: ${res2.Name}`;
      // return 'kek';
    },
  );

  done();
};
