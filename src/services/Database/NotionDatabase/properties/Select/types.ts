import {
  GetPropertySignature,
  GetPropertyAddSignature,
  GetPropertySearchSignature,
} from '../Propety';

type Name = 'select';

/**
 * Для получения инфы о базе
 * =========================================
 */

export type SelectSignature = GetPropertySignature<Name>;

/**
 * Для добавления в базу
 * =========================================
 */
type PropertyAddSignature = GetPropertyAddSignature<Name>;

type NamedPropertyAddSignature = Extract<PropertyAddSignature['select'], { name: string }>;

type PropertyAddSignatureType = Pick<PropertyAddSignature, 'type'>;

export type SelectAddSignature = { select: NamedPropertyAddSignature } & PropertyAddSignatureType;

/**
 * Для поиска
 * =========================================
 */

export type SelectSearchSignature = GetPropertySearchSignature<Name>;
