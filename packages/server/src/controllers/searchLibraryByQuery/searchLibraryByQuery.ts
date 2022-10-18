import { DatabaseRepository, SearchResult } from '@repository';

export const searchLibraryByQuery = async (
  // TODO: add filters
  query: string,
  databaseRepository: DatabaseRepository,
): Promise<SearchResult> => {
  const eitherLibrary = await databaseRepository.searchLibraries(query);

  return eitherLibrary;
};
