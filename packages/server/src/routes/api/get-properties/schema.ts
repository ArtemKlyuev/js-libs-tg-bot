import { FastifySchema } from 'fastify';

import { ToTS, JSONSchema } from '@utils';

const nonEmptyString = JSONSchema.defineSchema.string().min(1);

const successResponseSchema = {
  error: JSONSchema.defineSchema.null(),
  properties: JSONSchema.defineSchema
    .object({
      id: nonEmptyString,
      name: nonEmptyString,
      type: nonEmptyString,
      value: JSONSchema.defineSchema
        .object({
          id: nonEmptyString,
          name: nonEmptyString,
        })
        .array()
        .nonempty()
        .or(JSONSchema.defineSchema.null()),
    })
    .array(),
};

const errorResponseSchema = {
  error: JSONSchema.defineSchema.string(),
  properties: JSONSchema.defineSchema.void().array().length(0),
};

const definedResponseSchema = JSONSchema.defineSchema.object({
  error: successResponseSchema.error.or(errorResponseSchema.error),
  properties: successResponseSchema.properties.or(errorResponseSchema.properties),
});

const responseSchema = JSONSchema.toJSONSchema(definedResponseSchema);

export const schema: FastifySchema = {
  response: { 200: responseSchema, 400: responseSchema },
};

const success = JSONSchema.defineSchema.object(successResponseSchema);
const error = JSONSchema.defineSchema.object(errorResponseSchema);

export type SuccessReply = ToTS<typeof success>;
export type ErrorReply = ToTS<typeof error>;

export type Reply = ToTS<typeof definedResponseSchema>;
