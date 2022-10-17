import { NPMRegistry } from 'common/services';

import { ParsedEnvVariables } from './src/config';
import { NotionDb, Github } from './src/services';
import { DatabaseRepository } from './src/repository';

declare module '@fastify/awilix' {
  interface Cradle {
    config: ParsedEnvVariables;
    github: Github;
    notionDb: NotionDb;
    notionRepository: DatabaseRepository;
    npmRegistry: NPMRegistry;
  }
}
