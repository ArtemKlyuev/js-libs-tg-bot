import { Telegraf, Markup } from 'telegraf';

import { Config } from '@config';

import { userPermissionGuard } from './middlewares';
import { commands } from './commands';

export const startBot = async (): Promise<void> => {
  const bot = new Telegraf(Config.env.TELEGRAM_BOT_TOKEN);

  bot.use(userPermissionGuard(Config.env.TELEGRAM_VALID_USER_ID));

  await bot.telegram.setMyCommands(commands);

  bot.start(async (ctx) => {
    await ctx.reply(
      'Welcome!',
      Markup.keyboard([
        [
          Markup.button.webApp('youtube', 'https://www.youtube.com/'),
          Markup.button.webApp('youtube2', 'https://www.youtube.com/'),
        ],
      ]),
    );
  });

  bot.command('healthcheck', async (ctx) => {
    await ctx.reply(
      'Ok',
      Markup.keyboard([
        [
          Markup.button.webApp('youtube', 'https://www.youtube.com/'),
          Markup.button.webApp('youtube2', 'https://www.youtube.com/'),
          Markup.button.webApp('localhost', 'https://localhost:3000/'),
        ],
      ]),
    );
  });
  bot.command('add', (ctx) => ctx.reply('kek')), bot.launch();

  process.once('SIGINT', () => {
    console.log('bot SIGINT');
    bot.stop('SIGINT');
  });
  process.once('SIGTERM', () => {
    console.log('bot SIGTERM');
    bot.stop('SIGTERM');
  });
};
