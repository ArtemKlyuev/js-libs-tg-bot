import { Markup } from 'telegraf';

import { Scene } from '../../../Scene';

export const platformStep = Scene.createStep();

type CallbackButton = ReturnType<typeof Markup.button.callback>;

const getPlatformsButtons = (platforms: string[]): CallbackButton[][] => {
  return platforms.map((platform) => [Markup.button.callback(platform, platform)]);
};

platformStep.on('text', async (ctx) => {
  ctx.scene.session.state.addScene!.state.name = ctx.message.text;

  const { platforms } = ctx.scene.session.state.addScene!.properties;

  await ctx.reply('Выберите платформу', Markup.inlineKeyboard(getPlatformsButtons(platforms)));

  return ctx.wizard.next();
});
