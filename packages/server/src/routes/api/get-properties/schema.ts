import { FastifySchema } from 'fastify';

import { ToTS, JSONSchema } from '@utils';

const definedResponseSchema = JSONSchema.defineSchema.object({
  error: JSONSchema.defineSchema.string().or(JSONSchema.defineSchema.null()),
  properties: JSONSchema.defineSchema
    .object({
      id: JSONSchema.defineSchema.string().min(1),
      name: JSONSchema.defineSchema.string().min(1),
      type: JSONSchema.defineSchema.string().min(1),
      value: JSONSchema.defineSchema
        .string()
        .min(1)
        .or(JSONSchema.defineSchema.string().min(1).array().nonempty())
        .or(JSONSchema.defineSchema.number()),
    })
    .array()
    .or(JSONSchema.defineSchema.void().array().length(0)),
});

const responseSchema = JSONSchema.toJSONSchema(definedResponseSchema);

export const schema: FastifySchema = {
  response: { 200: responseSchema, 400: responseSchema },
};

export type Reply = ToTS<typeof definedResponseSchema>;
