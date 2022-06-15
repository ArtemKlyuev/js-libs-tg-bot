import { addController } from '@controllers';
import { unwrapEither } from '@utils';

import { Scene } from '../../Scene';

export const seventhStep = Scene.createStep();

const handler = async (ctx: any): Promise<void> => {
  const { state } = ctx.scene.session.state.addScene!;
  const { dbRepository, GithubApi, NPMRegistry } = ctx.diContainer;

  const eitherAdd = await addController(
    { NPMRegistry, github: GithubApi, dbRepo: dbRepository },
    state,
  );

  const eitheraddMessage = eitherAdd
    .mapRight(() => `Библиотека <code>${state.name}</code> успешно добавлена!`)
    .mapLeft((error) => {
      const errorPattern = `Ошибка при добавлении библиотеки ${state.name}`;

      if (Array.isArray(error)) {
        console.log('array errors', error);

        const errorsMesssage = (error as Error[]).map(({ message }) => message).join('\n');

        return `${errorPattern}\n${errorsMesssage}`;
      }

      return `${errorPattern}\n${error.message}`;
    });

  const message = unwrapEither(eitheraddMessage);

  ctx.replyWithHTML(message);

  return ctx.scene.leave();
};

seventhStep.on('text', (ctx) => {
  ctx.scene.session.state.addScene!.state.review = ctx.message.text;
  return handler(ctx);
});

seventhStep.on('callback_query', async (ctx) => {
  await ctx.answerCbQuery();

  return handler(ctx);
});
