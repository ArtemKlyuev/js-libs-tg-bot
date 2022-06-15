import { Config } from '@config';
import { NotionDbRepository } from '@repository';
import { NotionDatabase, GithubApi, NPMRegistry } from '@services';

import { MyContext } from '../../bot';

export const diContainer = (
  ctx: MyContext,
  next: () => Promise<void>,
): Promise<void> | undefined => {
  if (ctx.diContainer) {
    return next();
  }

  // ctx.sess

  const notionDb = new NotionDatabase({
    authToken: Config.env.NOTION_TOKEN,
    databaseID: Config.env.NOTION_DATABASE_ID,
  });

  const dbRepository = new NotionDbRepository(notionDb);

  ctx.diContainer = { dbRepository, GithubApi, NPMRegistry };

  return next();
};
