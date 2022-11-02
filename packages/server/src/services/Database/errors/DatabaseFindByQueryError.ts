import { DatabaseError, ErrorArgs } from '../types';

import { BaseError } from './BaseError';

interface Query {
  query: string;
}

export class DatabaseFindByQueryError extends BaseError implements DatabaseError {
  constructor({ code, message, query }: ErrorArgs & Query) {
    const errorMessage = `Не найдено результатов по запросу ${query}\n${message}`.trim();

    super({ name: 'DatabaseFindByQueryError', message: errorMessage, code });
  }
}
