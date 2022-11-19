import { FastifySchema } from 'fastify';

import { JSONSchema, ToTS } from '@utils';

const queryStringSchema = JSONSchema.defineSchema.object({
  name: JSONSchema.defineSchema.string().min(1),
});

const successSchema = {
  error: JSONSchema.defineSchema.null(),
  exist: JSONSchema.defineSchema.literal(true),
};

const successResponseSchema = JSONSchema.defineSchema.object(successSchema);

const errorSchema = {
  error: JSONSchema.defineSchema.string().min(1),
  exist: JSONSchema.defineSchema.literal(false),
};

const errorResponseSchema = JSONSchema.defineSchema.object(errorSchema);

const responseSchema = JSONSchema.defineSchema.object({
  error: successSchema.error.or(errorSchema.error),
  exist: successSchema.exist.or(errorSchema.exist),
});

export const schema: FastifySchema = {
  querystring: JSONSchema.toJSONSchema(queryStringSchema),
  response: {
    200: JSONSchema.toJSONSchema(successResponseSchema),
    404: JSONSchema.toJSONSchema(errorResponseSchema),
  },
};

export type SuccessResponse = ToTS<typeof successResponseSchema>;
export type ErrorResponse = ToTS<typeof errorResponseSchema>;

export type Querystring = ToTS<typeof queryStringSchema>;
export type Reply = ToTS<typeof responseSchema>;
