import { GithubApi, NPMRegistry } from '@services';

import { DatabaseRepository } from '@repository';

export interface Dependencies {
  github: typeof GithubApi;
  NPMRegistry: typeof NPMRegistry;
  dbRepo: DatabaseRepository;
}

export interface LibraryUserDefinedMeta {
  name: string;
  platform: string;
  tags: string[];
  status: string;
  score?: string;
  review?: string;
}
