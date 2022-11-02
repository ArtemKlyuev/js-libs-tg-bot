import { DatabaseError } from '../types';

interface Args {
  name: string;
  message: string;
  code: number;
}

export class BaseError extends Error implements DatabaseError {
  readonly code: number;

  constructor({ name, message, code }: Args) {
    super(message);

    this.name = name;
    this.code = code;
  }
}
