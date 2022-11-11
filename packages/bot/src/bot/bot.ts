import { Telegraf, Markup } from 'telegraf';

import { Config } from '../config';

import { userPermissionGuard } from './middlewares';
import { commands } from './commands';

export const startBot = async (): Promise<void> => {
  const bot = new Telegraf(Config.env.TELEGRAM_BOT_TOKEN);

  bot.use(userPermissionGuard(Config.env.TELEGRAM_VALID_USER_ID));

  await bot.telegram.setMyCommands(commands);

  const addLibraryButton = (id: number) => {
    return Markup.button.webApp(
      'Добавить библиотеку',
      `${Config.env.WEB_APP_URL}/library/add?id=${id}`,
    );
  };

  bot.start(async (ctx) => {
    await ctx.reply('Welcome!', Markup.keyboard([[addLibraryButton(ctx.update.message.from.id)]]));
  });

  bot.command('healthcheck', async (ctx) => {
    await ctx.reply('Ok', Markup.keyboard([[addLibraryButton(ctx.update.message.from.id)]]));
  });

  bot.launch();

  process.once('SIGINT', () => {
    console.log('bot SIGINT');
    bot.stop('SIGINT');
  });
  process.once('SIGTERM', () => {
    console.log('bot SIGTERM');
    bot.stop('SIGTERM');
  });
};
