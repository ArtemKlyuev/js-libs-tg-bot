import { Either } from '@sweet-monads/either';

import { FiltersConfig } from './Filters';

export interface ErrorArgs {
  message: string;
  code: number;
}

export interface DatabaseError extends Error {
  code: number;
}

export interface IdentifiedData<Data> {
  id: string;
  data: Data[];
}

export type InsertResult = Either<DatabaseError, void>;
export type SearchByFiltersResult<Error, Data> = Either<Error, IdentifiedData<Data>[]>;
export type QueryResult<Error, Data> = Either<Error, IdentifiedData<Data>[]>;
export type DatabaseInfo<Error, Data> = Either<Error, Data>;

export interface Database<InsertData, QueryData, DatabaseSignature> {
  insert: (data: InsertData) => Promise<InsertResult>;
  findByFilters: (
    config: FiltersConfig,
  ) => Promise<SearchByFiltersResult<DatabaseError, QueryData>>;
  findByQuery: (query?: string) => Promise<QueryResult<DatabaseError, QueryData>>;
  getDatabaseInfo: () => Promise<DatabaseInfo<DatabaseError, DatabaseSignature>>;
}
