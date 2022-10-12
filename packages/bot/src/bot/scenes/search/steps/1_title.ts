import { Scene } from '../../Scene';

export const firstStep = Scene.createStep();

firstStep.on('text', async (ctx) => {
  await ctx.reply('Введите название библиотеки');
  return ctx.wizard.next();
});
