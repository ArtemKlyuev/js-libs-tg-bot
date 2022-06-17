import { startBot } from './bot';

startBot()
  .then(() => console.log('Бот успешно запущен!'))
  .catch((error) => console.error(`Ошибка пи запуске бота!\nОшибка:${error}`));
