import { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';

type Filters = QueryDatabaseParameters['filter'];

interface Sort {
  property: string;
  direction: 'ascending' | 'descending';
}

// export interface FiltersError extends Error {}

export interface FiltersConfig {
  filters: Filters;
  sorts?: Sort[];
}
