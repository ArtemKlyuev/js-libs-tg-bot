import { Telegraf, Markup } from 'telegraf';

import { Config } from '../config';

import { userPermissionGuard } from './middlewares';

export const startBot = async (): Promise<void> => {
  const bot = new Telegraf(Config.env.TELEGRAM_BOT_TOKEN);

  bot.use(userPermissionGuard(Config.env.TELEGRAM_VALID_USER_ID));

  const addLibraryButton = (id: number) => {
    return Markup.button.webApp(
      'Добавить библиотеку',
      `${Config.env.WEB_APP_URL}/library/add?id=${id}`,
    );
  };

  const searchLibraryButton = (id: number) => {
    return Markup.button.webApp(
      'Найти библиотеку',
      `${Config.env.WEB_APP_URL}/library/search?id=${id}`,
    );
  };

  bot.start(async (ctx) => {
    const { id } = ctx.update.message.from;
    await ctx.reply(
      'Welcome!',
      Markup.keyboard([[addLibraryButton(id), searchLibraryButton(id)]]).resize(),
    );
  });

  bot.on('web_app_data', async (ctx) => {
    const result = ctx.update.message.web_app_data.data;

    const sendLibrary = (library: string) => ctx.reply(library, { disable_web_page_preview: true });

    try {
      const parsed = JSON.parse(result) as string[];
      const promises = parsed.map((library) => sendLibrary(library));
      await Promise.all(promises);
    } catch {
      await sendLibrary(result);
    }
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
