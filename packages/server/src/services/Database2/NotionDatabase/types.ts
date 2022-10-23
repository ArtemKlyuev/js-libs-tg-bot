import { SearchResponse } from '@notionhq/client/build/src/api-endpoints';

export interface Config {
  authToken: string;
  databaseID: string;
}

type SearchResponsePageResult = SearchResponse['results'][0];

export type SearchResponsePageResultProperties = Extract<
  SearchResponsePageResult,
  {
    object: 'page';
    url: string;
  }
>;

// ---

interface DbPropertyBase {
  id: string;
  name: string;
  type: 'number' | 'select' | 'multi_select' | 'title' | 'rich_text' | 'url' | 'date' | 'checkbox';
}

///--- Retrieve

export interface NotionDB {
  object: string;
  id: string;
  cover: null;
  icon: Icon;
  created_time: Date;
  created_by: UpdatedBy;
  last_edited_by: UpdatedBy;
  last_edited_time: Date;
  title: Title[];
  description: any[];
  is_inline: boolean;
  properties: { [key: string]: DbPropertyInfo };
  parent: Parent;
  url: string;
  archived: boolean;
}

export interface UpdatedBy {
  object: string;
  id: string;
}

export interface Icon {
  type: string;
  emoji: string;
}

export interface Parent {
  type: string;
  page_id: string;
}

export interface DbPropertyInfo extends DbPropertyBase {
  number?: Number;
  title?: RichText;
  select?: Select;
  url?: RichText;
  rich_text?: RichText;
  multi_select?: Select;
}

export interface Select {
  options: Option[];
}

export interface Option {
  id: string;
  name: string;
  color: string;
}

export interface Number {
  format: string;
}

export interface RichText {}

export interface Title {
  type: 'text';
  text: Text;
  annotations: Annotations;
  plain_text: string;
  href: null;
}

export interface Annotations {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string;
}

export interface Text {
  content: string;
  link: null;
}

///------ DbPropertyInsert

interface TextDbPropertyValue {
  type: 'text';
  text: { content: string };
}

interface TitleDbValue {
  title: [TextDbPropertyValue];
}

interface RichTextDbValue {
  rich_text: [TextDbPropertyValue] | [];
}

interface NumberDbValue {
  number: number | null;
}

interface SelectDbValue {
  select: { name: string } | { id: string } | null;
}

interface MultiSelectDbValue {
  multi_select: ({ name: string } | { id: string })[] | [];
}

interface URLDbValue {
  url: string | null;
}

export type DbPropertiesInsert = Record<
  string,
  TitleDbValue | RichTextDbValue | NumberDbValue | SelectDbValue | MultiSelectDbValue | URLDbValue
>;

/// ---- Search

export type SearchResultProperty = DbPropertyBase & {
  number?: number | null;
  title?: [TextDbPropertyValue];
  select?: Option;
  url?: string | null;
  rich_text?: [TextDbPropertyValue];
  multi_select?: Option[];
};
