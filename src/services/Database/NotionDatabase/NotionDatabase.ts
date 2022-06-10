import { left, right } from '@sweet-monads/either';
import { Client } from '@notionhq/client';

import { DatabaseInfo, Database, InsertResult, QueryResult } from '../Database';

import {
  Config,
  InsertData,
  RequestError,
  SearchResponsePageResultProperties,
  SearchResultProperties,
  NotionDatabaseSignature,
} from './types';
import { FindByQueryError } from './errors';

export interface NotionDb
  extends Database<InsertData, SearchResultProperties, NotionDatabaseSignature> {}

export class NotionDatabase implements NotionDb {
  readonly #notion: Client;
  readonly #databaseID: string;

  constructor({ authToken, databaseID }: Config) {
    this.#notion = new Client({ auth: authToken });
    this.#databaseID = databaseID;
  }

  async getDatabaseInfo(): Promise<DatabaseInfo<Error, NotionDatabaseSignature>> {
    try {
      const response = await this.#notion.databases.retrieve({ database_id: this.#databaseID });
      return right(response as unknown as NotionDatabaseSignature);
    } catch (error) {
      return left(error);
    }
  }

  async insert(data: InsertData): Promise<InsertResult<InsertData>> {
    try {
      const response = await this.#notion.pages.create({
        parent: { database_id: this.#databaseID },
        properties: data,
      });

      return right({ id: response.id, data });
    } catch (error) {
      return left(error);
    }
  }

  async findByQuery(
    query: string,
  ): Promise<QueryResult<RequestError | FindByQueryError, SearchResultProperties>> {
    try {
      const response = await this.#notion.search({ query });

      if (!response.results.length) {
        throw new FindByQueryError(query);
      }

      const result = (response.results as SearchResponsePageResultProperties[]).map(
        ({ id, properties: data }) => ({ id, data }),
      );

      // @ts-expect-error Всё нормально
      return right(result);
    } catch (error) {
      return left(error);
    }
  }
}

// export class NotionDatabase implements Database {
//   readonly #notion: Client;
//   readonly #databaseID: string;

//   constructor(authToken: string, databaseID: string) {
//     this.#notion = new Client({ auth: authToken });
//     this.#databaseID = databaseID;
//   }

//   async insert<Data extends Value>(data: Data): Promise<Either<InsertError, InsertedData<Data>>> {
//     try {
//       const response = await this.#notion.pages.create({
//         parent: { database_id: this.#databaseID },
//         properties: data,
//       });

//       return right({ id: response.id, data });
//     } catch (error) {
//       return left(error);
//     }
//   }

//   async findByQuery<Data extends abcdef>(
//     query: string,
//   ): Promise<Either<FindError, FindedData<Data>[]>> {
//     try {
//       const response = await this.#notion.search({ query });

//       if (!response.results.length) {
//         throw new Error(`No results found by query "${query}"`);
//       }

//       const result = (response.results as abcd[]).map(({ id, properties: data }) => ({ id, data }));

//       // @ts-expect-error ебучий тс
//       return right(result);
//     } catch (error) {
//       return left(error);
//     }
//   }
// }
