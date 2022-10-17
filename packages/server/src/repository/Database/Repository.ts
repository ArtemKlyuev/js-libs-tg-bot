import { Either } from '@sweet-monads/either';

import { FindError } from '@services';

// TODO: избавиться от `null` у `summary`, `repoURL`, `npmDownloads`, `githubStars`, `status`
export interface LegacyLibraryData {
  name: string;
  platform: string;
  tags: string[];
  summary: string | null;
  repoURL: string | null;
  npmDownloads: number | null;
  githubStars: number | null;
  status: string | null;
  score: string | null;
  review: string | null;
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
  repoURL: string;
  npmDownloads: number;
  githubStars: number;
  summary: string;
  tags: string[];
  status: string;
  score?: string;
  review?: string;
}

export type SearchResult = Either<FindError, LegacyLibraryData[]>;
export type SearchLibraryResult = Either<FindError, LegacyLibraryData>;
export type PropertiesResult = Either<Error, Properties>;
export type AddResult = Either<Error, void>;

export interface DatabaseRepository {
  /**
   * Поиск библиотеки по критерию(название/тег и т.д.)
   */
  searchLibraries: (query: string) => Promise<SearchResult>;
  searchLibraryByName: (name: string) => Promise<SearchLibraryResult>;
  addLibrary: (library: Library) => Promise<AddResult>;
  getProperties: () => Promise<PropertiesResult>;
}
