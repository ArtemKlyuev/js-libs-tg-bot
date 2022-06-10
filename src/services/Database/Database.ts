import { Either } from '@sweet-monads/either';

export interface InsertError extends Error {
  code: number;
}

export interface FindError extends Error {}

export interface IdentifiedData<Data> {
  id: string;
  data: Data;
}

export type InsertResult<Data> = Either<InsertError, IdentifiedData<Data>>;
export type QueryResult<Error, Data> = Either<Error, IdentifiedData<Data>[]>;
export type DatabaseInfo<Error, Data> = Either<Error, Data>;

export interface Database<InsertData, QueryData, DatabaseSignature> {
  // retrieve: <RetrieveError extends Error, SuccessData>() => Promise<
  //   Either<RetrieveError, SuccessData>
  // >;
  insert: (data: InsertData) => Promise<InsertResult<InsertData>>;
  findByQuery: (query: string) => Promise<QueryResult<FindError, QueryData>>;
  getDatabaseInfo: () => Promise<DatabaseInfo<Error, DatabaseSignature>>;
}

// export interface Database {
//   // retrieve: <RetrieveError extends Error, SuccessData>() => Promise<
//   //   Either<RetrieveError, SuccessData>
//   // >;
//   insert: <Data extends Record<string, any>>(
//     data: Data,
//   ) => Promise<Either<InsertError, InsertedData<Data>>>;
//   findByQuery: <Data extends Record<string, any>>(
//     query: string,
//   ) => Promise<Either<FindError, FindedData<Data>[]>>;
// }

// export interface Database {
//   retrieve: <RetrieveError extends Error, SuccessData>() => Promise<
//     Either<RetrieveError, SuccessData>
//   >;
//   insert: <Data, SaveError extends Error, SuccessData>(
//     data: Data,
//   ) => Promise<Either<SaveError, SuccessData>>;
//   find: <FindError extends Error, SuccessData>() => Promise<Either<FindError, SuccessData>>;
// }
