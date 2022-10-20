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

export type SearchFilters = Partial<Filters>;

interface Dependencies {
  dbRepository: DatabaseRepository;
}

export const searchLibraryByFilters = (
  filters: SearchFilters,
  { dbRepository }: Dependencies,
) => {};
