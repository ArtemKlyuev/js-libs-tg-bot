import { Markup } from 'telegraf';

import { searchController } from '@controllers';
import { unwrapEither } from '@utils';

import { Scene } from '../../../Scene';

export const platformStep = Scene.createStep();

type CallbackButton = ReturnType<typeof Markup.button.callback>;

const getPlatformsButtons = (platforms: string[]): CallbackButton[][] => {
  return platforms.map((platform) => [Markup.button.callback(platform, platform)]);
};

platformStep.on('text', async (ctx) => {
  ctx.scene.session.state.addScene!.state.name = ctx.message.text;
  const { dbRepository } = ctx.diContainer;

  const eitherSearchExistingResult = await searchController(dbRepository, ctx.message.text);

  const eitherSearchExistingResultValue = eitherSearchExistingResult
    .mapRight((libraries) => {
      const findedExistLibrary = libraries.find(({ Name }) => Name === ctx.message.text);

      if (findedExistLibrary) {
        return { hasExistingLibrary: true, message: 'Такая библиотека уже существует' };
      }

      return { hasExistingLibrary: false, message: '' };
    })
    .mapLeft(() => ({ hasExistingLibrary: false, message: '' }));

  const { hasExistingLibrary, message } = unwrapEither(eitherSearchExistingResultValue);

  if (hasExistingLibrary) {
    await ctx.reply(message);
    return ctx.scene.leave();
  }

  const { platforms } = ctx.scene.session.state.addScene!.properties;

  await ctx.reply('Выберите платформу', Markup.inlineKeyboard(getPlatformsButtons(platforms)));

  return ctx.wizard.next();
});
