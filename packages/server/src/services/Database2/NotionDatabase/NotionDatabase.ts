import { left, right } from '@sweet-monads/either';
import { Client } from '@notionhq/client';

import {
  DatabaseInfo,
  Database,
  InsertResult,
  QueryResult,
  SearchByFiltersResult,
  FiltersConfig,
  DatabaseError,
} from '../types';
import {
  DatabaseFindByFiltersError,
  DatabaseFindByQueryError,
  DatabaseGetInfoError,
  DatabaseInsertError,
} from '../errors';

import {
  Config,
  SearchResponsePageResultProperties,
  DbPropertiesInsert,
  NotionDB,
  SearchResultProperty,
} from './types';

export interface NotionDb extends Database<DbPropertiesInsert, SearchResultProperty, NotionDB> {}

export class NotionDatabase implements NotionDb {
  readonly #notion: Client;
  readonly #databaseID: string;

  constructor({ authToken, databaseID }: Config) {
    this.#notion = new Client({ auth: authToken });
    this.#databaseID = databaseID;
  }

  async getDatabaseInfo(): Promise<DatabaseInfo<DatabaseError, NotionDB>> {
    try {
      const response = await this.#notion.databases.retrieve({ database_id: this.#databaseID });
      return right(response as NotionDB);
    } catch ({ code = 400, message }) {
      return left(new DatabaseGetInfoError({ code, message }));
    }
  }

  async insert(properties: DbPropertiesInsert): Promise<InsertResult> {
    try {
      await this.#notion.pages.create({
        parent: { database_id: this.#databaseID },
        properties,
      });

      return right(undefined);
    } catch ({ code = 400, message }) {
      return left(new DatabaseInsertError({ code, message }));
    }
  }

  async findByQuery(query: string): Promise<QueryResult<DatabaseError, SearchResultProperty>> {
    try {
      const response = await this.#notion.search({ query });

      if (!response.results.length) {
        throw new DatabaseFindByQueryError({ code: 404, query, message: '' });
      }

      const result = (response.results as SearchResponsePageResultProperties[]).map(
        ({ id, properties }) => {
          const data = Object.entries(properties).map(([name, value]) => ({ ...value, name }));

          return { id, data };
        },
      );

      // @ts-expect-error Бд выдаёт нужные свойства
      return right(result);
    } catch (error) {
      if (error instanceof DatabaseFindByQueryError) {
        return left(error);
      }

      const { code = 400, message } = error;

      return left(new DatabaseFindByQueryError({ code, message, query }));
    }
  }

  async findByFilters({
    filters,
    sorts,
  }: FiltersConfig): Promise<SearchByFiltersResult<DatabaseError, SearchResultProperty>> {
    try {
      const response = await this.#notion.databases.query({
        database_id: this.#databaseID,
        filter: filters,
        sorts,
      });

      if (!response.results.length) {
        throw new DatabaseFindByFiltersError({ code: 404, message: '' });
      }

      const result = (response.results as SearchResponsePageResultProperties[]).map(
        ({ id, properties }) => {
          const data = Object.entries(properties).map(([name, value]) => ({ ...value, name }));

          return { id, data };
        },
      );

      // @ts-expect-error Бд выдаёт нужные свойства
      return right(result);
    } catch (error) {
      if (error instanceof DatabaseFindByFiltersError) {
        return left(error);
      }

      const { code = 400, message } = error;

      return left(new DatabaseFindByFiltersError({ code, message }));
    }
  }
}
