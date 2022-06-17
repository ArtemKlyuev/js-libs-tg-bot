import { Markup } from 'telegraf';

import { Scene } from '../../Scene';

export const ratingStep = Scene.createStep();

const getRatingButtons = (rating: string[]) => {
  return rating.map((status) => [Markup.button.callback(status, status)]);
};

ratingStep.on('callback_query', async (ctx) => {
  await ctx.answerCbQuery();

  ctx.scene.session.state.addScene!.state.status = ctx.update.callback_query.data!;

  const { scores } = ctx.scene.session.state.addScene!.properties;

  await ctx.editMessageText(
    'Выберите рейтинг',
    Markup.inlineKeyboard([
      [Markup.button.callback('Пропустить', 'next')],
      ...getRatingButtons(scores),
    ]),
  );

  return ctx.wizard.next();
});
