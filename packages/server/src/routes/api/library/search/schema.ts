import { FastifySchema } from 'fastify';

import { ToTS, JSONSchema } from '@utils';

const definedQueryStringSchema = JSONSchema.defineSchema
  .object({
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
  })
  .partial();

const queryStringSchema = JSONSchema.toJSONSchema(definedQueryStringSchema);

const definedResponseSchema = JSONSchema.defineSchema.object({
  error: JSONSchema.defineSchema.string().min(1).or(JSONSchema.defineSchema.null()),
  results: JSONSchema.defineSchema
    .object({
      name: JSONSchema.defineSchema.string(),
      platform: JSONSchema.defineSchema.string(),
      repoURL: JSONSchema.defineSchema.string().or(JSONSchema.defineSchema.null()),
      downloads: JSONSchema.defineSchema.number().min(0).or(JSONSchema.defineSchema.null()),
      stars: JSONSchema.defineSchema.number().min(0).or(JSONSchema.defineSchema.null()),
      tags: JSONSchema.defineSchema.string().array().nonempty(),
      status: JSONSchema.defineSchema.string(),
      summary: JSONSchema.defineSchema.string().or(JSONSchema.defineSchema.null()),
      score: JSONSchema.defineSchema.string().or(JSONSchema.defineSchema.null()),
      review: JSONSchema.defineSchema.string().or(JSONSchema.defineSchema.null()),
    })
    .array()
    .or(JSONSchema.defineSchema.void().array().length(0)),
});

const responseSchema = JSONSchema.toJSONSchema(definedResponseSchema);

export const schema: FastifySchema = {
  querystring: queryStringSchema,
  response: { 200: responseSchema, 400: responseSchema, 422: responseSchema },
};

export type Querystring = ToTS<typeof definedQueryStringSchema>;

export type Reply = ToTS<typeof definedResponseSchema>;
