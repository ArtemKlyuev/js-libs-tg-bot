import { Markup } from 'telegraf';

import { Scene } from '../../Scene';

export const reviewStep = Scene.createStep();

reviewStep.on('callback_query', async (ctx) => {
  await ctx.answerCbQuery();

  if (ctx.update.callback_query.data && ctx.update.callback_query.data !== 'next') {
    ctx.scene.session.state.addScene!.state.score = ctx.update.callback_query.data!;
  }

  await ctx.editMessageText(
    'Напишите ревью',
    Markup.inlineKeyboard([Markup.button.callback('Пропустить', 'skip')]),
  );

  return ctx.wizard.next();
});
