import { FastifySchema } from 'fastify';

import { ToTS, JSONSchema } from '@utils';

const definedBodySchema = JSONSchema.defineSchema.object({
  name: JSONSchema.defineSchema.string().min(1),
  platform: JSONSchema.defineSchema.string().min(1),
  tags: JSONSchema.defineSchema.string().array().nonempty(),
  status: JSONSchema.defineSchema.string().min(1),
  rating: JSONSchema.defineSchema.string().min(1).optional(),
  review: JSONSchema.defineSchema.string().min(1).optional(),
});

const succesResponse = {
  error: JSONSchema.defineSchema.null(),
  created: JSONSchema.defineSchema.literal(true),
};

const successResponseSchema = JSONSchema.defineSchema.object(succesResponse);

const errorResponse = {
  error: JSONSchema.defineSchema.string().min(1),
  created: JSONSchema.defineSchema.literal(false),
};

const errorResponseSchema = JSONSchema.defineSchema.object(errorResponse);

const definedResponseSchema = JSONSchema.defineSchema.object({
  error: succesResponse.error.or(errorResponse.error),
  created: succesResponse.created.or(errorResponse.created),
});

export const schema: FastifySchema = {
  body: JSONSchema.toJSONSchema(definedBodySchema),
  response: {
    201: JSONSchema.toJSONSchema(successResponseSchema),
    400: JSONSchema.toJSONSchema(errorResponseSchema),
  },
};

export type SuccessResponse = ToTS<typeof successResponseSchema>;
export type ErrorResponse = ToTS<typeof errorResponseSchema>;
export type Body = ToTS<typeof definedBodySchema>;
export type Reply = ToTS<typeof definedResponseSchema>;
