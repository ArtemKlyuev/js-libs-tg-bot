import { DatabaseError, ErrorArgs } from '../types';

import { BaseError } from './BaseError';

export class DatabaseInsertError extends BaseError implements DatabaseError {
  constructor({ message, code }: ErrorArgs) {
    const errorMessage = `Не удалось добавить новые элементы!\n${message}`;

    super({ name: 'DatabaseInsertError', message: errorMessage, code });
  }
}
