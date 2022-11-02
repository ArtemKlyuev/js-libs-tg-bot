import { FastifySchema } from 'fastify';

import { ToTS, JSONSchema } from '@utils';

const definedBodySchema = JSONSchema.defineSchema.object({
  name: JSONSchema.defineSchema.string().min(1),
  platform: JSONSchema.defineSchema.string().min(1),
  tags: JSONSchema.defineSchema.string().array().nonempty(),
  status: JSONSchema.defineSchema.string().min(1),
  score: JSONSchema.defineSchema.string().min(1).optional(),
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
