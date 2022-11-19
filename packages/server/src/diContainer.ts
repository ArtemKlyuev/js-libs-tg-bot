import { diContainer } from '@fastify/awilix';
import { asFunction, asValue, Lifetime } from 'awilix';
import { BestOfJSAPI, NPMRegistryAPI, AxiosHttpRequest } from 'common/services';

import { Config } from './config';
import { NotionDatabase, GithubAPI } from './services';
import { NotionDbRepository } from './repository';

export const createDIContainer = (): void => {
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
    bestOfJS: asFunction(() => new BestOfJSAPI(new AxiosHttpRequest())).singleton(),
  });
};
