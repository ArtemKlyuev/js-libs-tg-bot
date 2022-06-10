import { addController } from '@controllers';
import { GithubApi, NPMRegistry } from '@services';
import { Scene } from '../../Scene';

export const seventhStep = Scene.createStep();

const handler = async (ctx: any): Promise<void> => {
  const { state } = ctx.scene.session.state.addScene!;

  await addController({ NPMRegistry, github: GithubApi }, state.name);

  await ctx.replyWithHTML(`Библиотека <code>${state.name}</code> успешно добавлена!`);
  await ctx.reply(JSON.stringify(state, null, 2));

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
