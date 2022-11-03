import { DatabaseRepository } from '@repository';

export const getLibraryProperties = (dbRepository: DatabaseRepository) => {
  return dbRepository.getProperties();
};
