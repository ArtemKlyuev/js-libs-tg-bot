import { DatabaseRepository, SearchResult } from '@repository';

interface Filters {
  name: string;
  platform: string;
  npmDownloads: number;
  stars: number;
  tags: string[];
  status: string;
  summary: string;
  score: string;
}

interface Sort {
  property: string;
  direction: 'ascending' | 'descending';
}

export interface SearchFilters {
  filters: Partial<Filters>;
  sort?: Sort;
}

interface Dependencies {
  dbRepository: DatabaseRepository;
}

export const searchLibraryByFilters = (
  { filters, sort }: SearchFilters,
  { dbRepository }: Dependencies,
) => {};
