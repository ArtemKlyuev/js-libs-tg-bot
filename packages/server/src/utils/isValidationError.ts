import { ValidationResult } from 'fastify';

interface ValidationError {
  statusCode: number;
  validation: ValidationResult[];
}

export const isValidationError = (error: any): error is ValidationError => {
  return 'validation' in error;
};
