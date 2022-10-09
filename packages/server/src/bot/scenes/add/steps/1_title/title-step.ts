import { unwrapEither } from '@utils';

import { AddScene } from '../../../../bot';

import { Scene } from '../../../Scene';

export const titleStep = Scene.createStep();

titleStep.on('text', async (ctx) => {
  await ctx.reply('Введите название библиотеки');

  ctx.scene.session.state.addScene ??= { state: {}, properties: {} } as AddScene;

  const eitherDbProperties = await ctx.diContainer.dbRepository.getProperties();

  const eitherDbPropertiesValue = eitherDbProperties
    .mapRight((properties) => ({ properties, errorMessage: '' }))
    .mapLeft(({ message }) => ({
      properties: null,
      errorMessage: `Произошла ошибка при попытке получения инфы о свойствах.\nОшибка: ${message}`,
    }));

  const { errorMessage, properties } = unwrapEither(eitherDbPropertiesValue);

  if (errorMessage) {
    await ctx.reply(errorMessage);
    return ctx.scene.leave();
  }

  ctx.scene.session.state.addScene!.properties = properties!;
  return ctx.wizard.next();
});
