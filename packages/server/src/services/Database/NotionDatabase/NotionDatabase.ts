import { left, right } from '@sweet-monads/either';
import { Client } from '@notionhq/client';

import {
  DatabaseInfo,
  Database,
  InsertResult,
  QueryResult,
  FiltersResult,
  FindError,
  FiltersConfig,
} from '../types';

import {
  Config,
  InsertData,
  RequestError,
  SearchResponsePageResultProperties,
  SearchResultProperties,
  NotionDatabaseSignature,
} from './types';
import { FindByQueryError } from './errors';
import { MultiSelect, Number, RichText, Select, Title, URL } from './properties2';

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

  async insert(data: InsertData): Promise<InsertResult> {
    try {
      const {
        name,
        platform,
        repoURL,
        tags,
        summary,
        status,
        score,
        npmDownloads: downloads,
        stars,
        review,
      } = data;

      const Score = score
        ? new Select({
            name: 'Score /5',
            selectedOption: { name: score },
          }).toColumn()
        : {};

      const Review = review ? new RichText({ name: 'Review', text: review }).toColumn() : {};

      await this.#notion.pages.create({
        parent: { database_id: this.#databaseID },
        properties: {
          ...new Title({ name: 'Name', title: name }).toColumn(),
          ...new Select({ name: 'Platform', selectedOption: { name: platform } }).toColumn(),
          ...new URL({ name: 'Repo link', url: repoURL }).toColumn(),
          ...new Number({ name: 'NPM weekly downloads', number: downloads }).toColumn(),
          ...new Number({ name: 'github stars', number: stars }).toColumn(),
          ...new MultiSelect({
            name: 'Tags',
            selectedOptions: tags.map((tag) => ({ name: tag })),
          }).toColumn(),
          ...new RichText({ name: 'Summary', text: summary }).toColumn(),
          ...new Select({ name: 'Status', selectedOption: { name: status } }).toColumn(),
          ...Score,
          ...Review,
        },
      });

      return right(undefined);
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

  async findByFilters({
    filters,
    sort,
  }: FiltersConfig): Promise<FiltersResult<FindError, SearchResultProperties>> {
    try {
      const response = await this.#notion.databases.query({ database_id: this.#databaseID });
    } catch (error) {
      return left(error);
    }
  }
}
