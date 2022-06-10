import {
  CreatePageParameters,
  CreatePageResponse,
  GetDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { ValueOf } from 'type-fest';

export interface Property<Name extends string, Type extends string> {
  readonly name: Name;
  readonly type: Type;
  readonly id: string | undefined;
  content: string | string[] | number;
}

// ----------------------------------------------------

type NotionDatabaseLib = Extract<
  GetDatabaseResponse,
  {
    created_time: string;
  }
>;

type Properties = ValueOf<NotionDatabaseLib['properties']>;

type PropertiesNames = 'title' | 'rich_text' | 'select' | 'multi_select' | 'url' | 'number';

export type GetPropertySignature<Name extends PropertiesNames> = Extract<
  Properties,
  { type: Name }
>;

// ----------------------------------------------------

type NotionDatabasePage = Extract<
  CreatePageParameters,
  {
    parent: {
      type?: 'database_id';
    };
  }
>;

type NotionDatabasePageProperties = Pick<NotionDatabasePage, 'properties'>;
type NotionDatabasePagePropertiesValues = ValueOf<NotionDatabasePageProperties['properties']>;

export type GetPropertyAddSignature<Name extends PropertiesNames> = Extract<
  NotionDatabasePagePropertiesValues,
  { [key in Name]: any }
>;

// ----------------------------------------------------

type SearchReponse = Extract<CreatePageResponse, { parent: {} }>;
type ExtractedProperties = SearchReponse['properties'];

type SearchProperties = ValueOf<ExtractedProperties>;

export type GetPropertySearchSignature<Name extends PropertiesNames> = Extract<
  SearchProperties,
  { type: Name }
>;
