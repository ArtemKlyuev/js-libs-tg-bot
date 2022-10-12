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
export type QueryResult<Error, Data> = Either<Error, IdentifiedData<Data>[]>;
export type DatabaseInfo<Error, Data> = Either<Error, Data>;

export interface Database<InsertData, QueryData, DatabaseSignature> {
  insert: (data: InsertData) => Promise<InsertResult>;
  findByQuery: (query: string) => Promise<QueryResult<FindError, QueryData>>;
  getDatabaseInfo: () => Promise<DatabaseInfo<Error, DatabaseSignature>>;
}