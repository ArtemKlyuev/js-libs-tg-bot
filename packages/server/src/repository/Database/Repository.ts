import { Either } from '@sweet-monads/either';

import { DbProperty as DbPropertyModel } from '../../models';

interface SearchedLibraryData {
  id: string;
  name: string;
  value: { id: string; name: string }[] | { id: string; name: string } | string | number | null;
}

interface ErrorWithCode extends Error {
  code: number;
}

export type LibraryInfo = InsertedProperty[];

interface InsertedProperty<Value = string[] | string | number | null> {
  id: string;
  value: Value;
}

interface DbProperty {
  id: string;
  name: string;
  type: string;
  value: [{ id: string; name: string }, ...{ id: string; name: string }[]] | null;
}

export type SearchResult = Either<ErrorWithCode, SearchedLibraryData[][]>;
export type SearchLibraryResult = Either<ErrorWithCode, SearchedLibraryData[]>;
export type SearchByFiltersResult = Either<ErrorWithCode, SearchedLibraryData[]>;
export type PropertiesResult = Either<ErrorWithCode, DbProperty[]>;
export type AddResult = Either<ErrorWithCode, void>;

interface Filter {
  property: string;
  value: boolean | string | number | string[] | number[];
}

interface Sort {
  property: string;
  direction: 'ascending' | 'descending';
}

export interface RespositoryFiltersConfig {
  filters: Filter[];
  sort?: Sort;
}

export interface DatabaseRepository {
  /**
   * Поиск библиотеки по критерию(название/тег и т.д.)
   */
  searchLibraries: (query: string) => Promise<SearchResult>;
  searchLibraryByName: (name: string) => Promise<SearchLibraryResult>;
  searchLibraryByFilters: (
    filtersConfig: RespositoryFiltersConfig,
  ) => Promise<SearchByFiltersResult>;
  // addLibrary: (library: Library) => Promise<AddResult>;
  addLibrary: (library: DbPropertyModel[]) => Promise<AddResult>;
  getProperties: () => Promise<PropertiesResult>;
}
