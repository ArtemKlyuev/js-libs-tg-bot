import { Static, Type } from '@sinclair/typebox';
import { JSONSchema, ToTS } from '@utils';
import { FastifySchema } from 'fastify';

const queryStringSchema = Type.Object({
  name: Type.String(),
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
  querystring: queryStringSchema,
  response: { 200: successResponseSchema, 404: errorResponseSchema },
};

export type SuccessResponse = ToTS<typeof successResponseSchema>;
export type ErrorResponse = ToTS<typeof errorResponseSchema>;

export type Querystring = Static<typeof queryStringSchema>;
export type Reply = ToTS<typeof responseSchema>;
