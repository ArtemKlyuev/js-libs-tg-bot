import { DatabaseError, ErrorArgs } from '../types';
import { BaseError } from './BaseError';

export class DatabaseGetInfoError extends BaseError implements DatabaseError {
  constructor({ code, message }: ErrorArgs) {
    const errorMessage = `Не удалось получить информацию о базе данных!\n${message}`;

    super({ name: 'DatabaseGetInfoError', message: errorMessage, code });
  }
}
