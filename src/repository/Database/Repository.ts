import { Either } from '@sweet-monads/either';

import { FindError } from '@services';

export interface LibraryData {
  Name: string;
  Platform: string | null;
  'Repo link': string | null;
  'NPM weekly downloads': number | null;
  Tags: string[];
  Summary: string | null;
  Status: string | null;
  'Score /5': string | null;
  Review: string | null;
}

export interface Properties {
  platforms: string[];
  tags: string[];
  statuses: string[];
  scores: string[];
}

export interface Library {
  name: string;
  platform: string;
  tags: string[];
  status: string;
  rating?: string;
  review?: string;
}

export type SearchResult = Either<FindError, LibraryData[]>;
export type PropertiesResult = Either<Error, Properties>;
export type AddResult = Either<Error, unknown>;

export interface DatabaseRepository {
  /**
   * Поиск библиотеки по критерию(название/тег и т.д.)
   */
  searchLibrary: (query: string) => Promise<SearchResult>;
  addLibrary: (library: Library) => Promise<AddResult>;
  getProperties: () => Promise<PropertiesResult>;
}
