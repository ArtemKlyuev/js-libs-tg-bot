import { FastifySchema } from 'fastify';

import { ToTS, JSONSchema } from '@utils';

const definedQueryStringSchema = JSONSchema.defineSchema
  .object({
    query: JSONSchema.defineSchema.string(),
    name: JSONSchema.defineSchema.string(),
    platform: JSONSchema.defineSchema.enum(['frontend', 'backend', 'isomorphic']),
    downloads: JSONSchema.defineSchema.number().min(0),
    stars: JSONSchema.defineSchema.number().min(0),
    tags: JSONSchema.defineSchema.string().array().nonempty(),
    status: JSONSchema.defineSchema.enum([
      'Backlog',
      'to do',
      'in progress',
      'waiting',
      'rejected',
      'done',
    ]),
    summary: JSONSchema.defineSchema.string().min(1),
    score: JSONSchema.defineSchema.enum(['1', '2', '3', '4', '5']),
    sort: JSONSchema.defineSchema.string().min(1),
    direction: JSONSchema.defineSchema.enum(['ascending', 'descending']),
  })
  .partial();

const queryStringSchema = JSONSchema.toJSONSchema(definedQueryStringSchema);

const successResponseSchema = {
  error: JSONSchema.defineSchema.null(),
  results: JSONSchema.defineSchema
    .object({
      id: JSONSchema.defineSchema.string().min(1),
      name: JSONSchema.defineSchema.string().min(1),
      value: JSONSchema.defineSchema
        .string()
        .or(JSONSchema.defineSchema.number())
        .or(JSONSchema.defineSchema.null())
        .or(
          JSONSchema.defineSchema.object({
            id: JSONSchema.defineSchema.string().min(1),
            name: JSONSchema.defineSchema.string().min(1),
          }),
        )
        .or(
          JSONSchema.defineSchema
            .object({
              id: JSONSchema.defineSchema.string().min(1),
              name: JSONSchema.defineSchema.string().min(1),
            })
            .array(),
        ),
    })
    .array()
    .array(),
};

const errorResponseSchema = {
  error: JSONSchema.defineSchema.string().min(1),
  results: JSONSchema.defineSchema.void().array().length(0),
};

const definedResponseSchema = JSONSchema.defineSchema.object({
  error: successResponseSchema.error.or(errorResponseSchema.error),
  results: successResponseSchema.results.or(errorResponseSchema.results),
});

const responseSchema = JSONSchema.toJSONSchema(definedResponseSchema);

export const schema: FastifySchema = {
  querystring: queryStringSchema,
  response: { 200: responseSchema, 400: responseSchema, 404: responseSchema, 422: responseSchema },
};

const success = JSONSchema.defineSchema.object(successResponseSchema);
const error = JSONSchema.defineSchema.object(errorResponseSchema);

export type SuccessReply = ToTS<typeof success>;
export type ErrorReply = ToTS<typeof error>;

export type Querystring = ToTS<typeof definedQueryStringSchema>;

export type Reply = ToTS<typeof definedResponseSchema>;
