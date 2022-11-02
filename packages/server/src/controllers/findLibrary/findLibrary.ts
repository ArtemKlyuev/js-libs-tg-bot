import { DatabaseRepository, SearchLibraryResult } from '@repository';

export const findLibrary = async (
  name: string,
  dbRepository: DatabaseRepository,
): Promise<SearchLibraryResult> => {
  const result = await dbRepository.searchLibraryByName(name);

  return result;
};
