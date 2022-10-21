import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

export class JSONSchema {
  static defineSchema = z;
  static toJSONSchema = zodToJsonSchema;
}
