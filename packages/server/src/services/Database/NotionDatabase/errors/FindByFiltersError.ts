import { FiltersError } from '../../types';

export class FindByFiltersError extends Error implements FiltersError {
  constructor(message: string) {
    const errorMessage = `Поиск по фильтрам не удался!\n"${message}"`;

    super(errorMessage);

    this.name = 'FindByFiltersError';
  }
}
