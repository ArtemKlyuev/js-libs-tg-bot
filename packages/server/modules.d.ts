import { ParsedEnvVariables } from './src/config';
import { NotionDb } from './src/services';
import { DatabaseRepository } from './src/repository';

declare module '@fastify/awilix' {
  interface Cradle {
    config: ParsedEnvVariables;
    notionDb: NotionDb;
    notionRepository: DatabaseRepository;
  }
  // interface RequestCradle {
  //   user: User;
  // }
}
