import { Either } from '@sweet-monads/either';

export interface InsertError extends Error {
  code: number;
}

export interface FindError extends Error {}

export interface IdentifiedData<Data> {
  id: string;
  data: Data;
}

export type InsertResult = Either<InsertError, void>;
export type FiltersResult<Error, Data> = Either<Error, IdentifiedData<Data>[]>;
export type QueryResult<Error, Data> = Either<Error, IdentifiedData<Data>[]>;
export type DatabaseInfo<Error, Data> = Either<Error, Data>;

interface Filters {}

interface Sort {
  property: string;
  direction: 'ascending' | 'descending';
}

interface Config {
  filters: Filters;
  sort?: Sort[];
}

export interface Database<InsertData, QueryData, DatabaseSignature> {
  insert: (data: InsertData) => Promise<InsertResult>;
  findByFilters: (config: Config) => Promise<FiltersResult<FindError, QueryData>>;
  findByQuery: (query: string) => Promise<QueryResult<FindError, QueryData>>;
  getDatabaseInfo: () => Promise<DatabaseInfo<Error, DatabaseSignature>>;
}
