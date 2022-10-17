import { ValueOf } from 'type-fest';
import { APIResponseError, UnknownHTTPResponseError, RequestTimeoutError } from '@notionhq/client';
import {
  CreatePageParameters,
  SearchResponse,
  GetDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { MultiSelect, RichText, Select, Title, URL, Number } from './properties';

export interface Config {
  authToken: string;
  databaseID: string;
}

type NotionDatabasePage = Extract<
  CreatePageParameters,
  {
    parent: {
      type?: 'database_id';
    };
  }
>;

type NotionDatabasePageProperties = Pick<NotionDatabasePage, 'properties'>;
type NotionDatabasePagePropertiesValues2 = ValueOf<NotionDatabasePageProperties['properties']>;
type InsertTitle = Extract<NotionDatabasePagePropertiesValues2, { title: any }>;
type InsertRichText = Extract<NotionDatabasePagePropertiesValues2, { rich_text: any }>;
type InsertSelect = Extract<NotionDatabasePagePropertiesValues2, { select: any }>;
type InsertMultiSelect = Extract<NotionDatabasePagePropertiesValues2, { multi_select: any }>;
type InsertNumber = Extract<NotionDatabasePagePropertiesValues2, { number: any }>;
type InsertURL = Extract<NotionDatabasePagePropertiesValues2, { url: any }>;
type NotionDatabasePagePropertiesValues = ValueOf<NotionDatabasePageProperties, 'properties'>;

export interface InsertData {
  name: string;
  platform: string;
  repoURL: string;
  npmDownloads: number;
  stars: number;
  tags: string[];
  summary: string;
  status: string;
  score?: string;
  review?: string;
}

/**
 * =========================================
 */

type SearchResponsePageResult = SearchResponse['results'][0];

export type SearchResponsePageResultProperties = Extract<
  SearchResponsePageResult,
  {
    object: 'page';
    url: string;
  }
>;

export interface SearchResultProperties {
  Name: Title;
  Platform: Select;
  'Repo link': URL;
  'NPM weekly downloads': Number;
  'github stars': Number;
  Tags: MultiSelect;
  Summary: RichText;
  Status: Select;
  'Score /5': Select;
  Review: RichText;
}

export type RequestError = APIResponseError | UnknownHTTPResponseError | RequestTimeoutError;

/**
 * =========================================
 */

type NotionDatabaseLib = Extract<
  GetDatabaseResponse,
  {
    created_time: string;
  }
>;

type NotionDatabaseOmitted = Omit<NotionDatabaseLib, 'properties'>;

/**
 * PROPERTIES
 */

type Properties = ValueOf<NotionDatabaseLib['properties']>;

export type URL2 = Extract<Properties, { type: 'url' }>;
export type Number2 = Extract<Properties, { type: 'number' }>;
export type Select2 = Extract<Properties, { type: 'select' }>;
export type MultiSelect2 = Extract<Properties, { type: 'multi_select' }>;
export type RichText2 = Extract<Properties, { type: 'rich_text' }>;
export type Title2 = Extract<Properties, { type: 'title' }>;

/**
 * /PROPERTIES
 */

export interface NotionDatabaseSignature extends NotionDatabaseOmitted {
  properties: {
    Name: Title2;
    Platform: Select2;
    'Repo link': URL2;
    'NPM weekly downloads': Number2;
    Tags: MultiSelect2;
    Summary: RichText2;
    Status: Select2;
    'Score /5': Select2;
    Review: RichText2;
  };
}
