import { NPMRegistry } from 'common/services';

import { Github } from '@services/Github';
import { DatabaseRepository } from '@repository';

export interface Dependencies {
  dbRepository: DatabaseRepository;
  github: Github;
  npmRegistry: NPMRegistry;
}

export interface LibraryData {
  name: string;
  platform: string;
  tags: string[];
  status: string;
  score?: string | undefined;
  review?: string | undefined;
}
