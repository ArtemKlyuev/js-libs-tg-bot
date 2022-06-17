import { Markup } from 'telegraf';

import { Scene } from '../../Scene';

export const statusStep = Scene.createStep();

const getStatusesButtons = (statuses: string[]) => {
  return statuses.map((status) => [Markup.button.callback(status, status)]);
};

statusStep.on('callback_query', async (ctx) => {
  await ctx.answerCbQuery();

  const { statuses } = ctx.scene.session.state.addScene!.properties;

  await ctx.editMessageText('Выберите статус', Markup.inlineKeyboard(getStatusesButtons(statuses)));

  return ctx.wizard.next();
});