import { AddScene, notionDbRepository } from '../../../../bot';

import { Scene } from '../../../Scene';

export const titleStep = Scene.createStep();

titleStep.on('text', async (ctx) => {
  await ctx.reply('Введите название библиотеки');

  ctx.scene.session.state.addScene ??= { state: {}, properties: {} } as AddScene;

  const properties = await notionDbRepository.getProperties();

  let result: Function;

  properties
    .mapRight((properties) => {
      ctx.scene.session.state.addScene!.properties = properties;
      result = ctx.wizard.next.bind(ctx.wizard);
    })
    .mapLeft(async (error) => {
      await ctx.reply(
        `Произошла ошибка при попытке получения инфы о свойствах.\nОшибка: ${error.message}`,
      );

      result = ctx.scene.leave.bind(ctx.scene);
    });

  return result!();
});
