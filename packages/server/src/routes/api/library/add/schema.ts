import { FastifySchema } from 'fastify';

import { ToTS, JSONSchema } from '@utils';

const definedBodySchema = JSONSchema.defineSchema.object({
  name: JSONSchema.defineSchema.string().min(1),
  platform: JSONSchema.defineSchema.enum(['frontend', 'backend', 'isomorphic']),
  tags: JSONSchema.defineSchema.string().array().nonempty(),
  status: JSONSchema.defineSchema.enum([
    'Backlog',
    'to do',
    'in progress',
    'waiting',
    'rejected',
    'done',
  ]),
  score: JSONSchema.defineSchema.enum(['1', '2', '3', '4', '5']).optional(),
  review: JSONSchema.defineSchema.string().min(1).optional(),
});

const bodySchema = JSONSchema.toJSONSchema(definedBodySchema);

const definedResponseSchema = JSONSchema.defineSchema.object({
  error: JSONSchema.defineSchema.string().or(JSONSchema.defineSchema.null()),
  created: JSONSchema.defineSchema.boolean(),
});

const responseSchema = JSONSchema.toJSONSchema(definedResponseSchema);

export const schema: FastifySchema = {
  body: bodySchema,
  response: { 201: responseSchema, 400: responseSchema },
};

export type Body = ToTS<typeof definedBodySchema>;

export type Reply = ToTS<typeof definedResponseSchema>;
