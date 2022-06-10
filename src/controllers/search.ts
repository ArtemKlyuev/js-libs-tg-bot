import { DatabaseRepository, SearchResult } from '@repository';

export const searchController = async (
  databaseRepository: DatabaseRepository,
  searchQuery: string,
): Promise<SearchResult> => {
  const eitherLibrary = await databaseRepository.searchLibrary(searchQuery);

  return eitherLibrary;
};
