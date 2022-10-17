import { diContainer } from '@fastify/awilix';
import { asFunction, asValue, Lifetime } from 'awilix';
import { NPMRegistryAPI } from 'common/services';

import { Config } from './config';
import { NotionDatabase, GithubAPI } from './services';
import { NotionDbRepository } from './repository';

export const createDIContainer = () => {
  diContainer.register({
    config: asValue(Config.env),
    github: asFunction(() => GithubAPI).singleton(),
    notionDb: asFunction(
      ({ config }) => {
        return new NotionDatabase({
          authToken: config.NOTION_TOKEN,
          databaseID: config.NOTION_DATABASE_ID,
        });
      },
      {
        lifetime: Lifetime.SINGLETON,
        // dispose: (module) => module.dispose(),
      },
    ),
    notionRepository: asFunction(
      ({ notionDb }) => {
        return new NotionDbRepository(notionDb);
      },
      {
        lifetime: Lifetime.SINGLETON,
        // dispose: (module) => module.dispose(),
      },
    ),
    npmRegistry: asFunction(() => NPMRegistryAPI).singleton(),
  });
};
