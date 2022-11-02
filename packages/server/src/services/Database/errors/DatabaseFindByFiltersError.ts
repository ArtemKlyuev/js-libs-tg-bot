import { DatabaseError, ErrorArgs } from '../types';

import { BaseError } from './BaseError';

export class DatabaseFindByFiltersError extends BaseError implements DatabaseError {
  constructor({ code, message }: ErrorArgs) {
    const errorMessage = `Не найдено результатов по запрошенным фильтрам!\n${message}`;

    super({ name: 'DatabaseFindByFiltersError', message: errorMessage, code });
  }
}
