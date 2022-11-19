import { z, ZodType } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export class JSONSchema {
  static defineSchema = z;
  static toJSONSchema = zodToJsonSchema;
}

export type ToTS<T extends ZodType> = z.infer<T>;
