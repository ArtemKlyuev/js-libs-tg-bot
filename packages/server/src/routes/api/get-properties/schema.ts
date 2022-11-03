import { FastifySchema } from 'fastify';

import { ToTS, JSONSchema } from '@utils';

const nonEmptyString = JSONSchema.defineSchema.string().min(1);

const definedResponseSchema = JSONSchema.defineSchema.object({
  error: JSONSchema.defineSchema.string().or(JSONSchema.defineSchema.null()),
  properties: JSONSchema.defineSchema
    .object({
      id: nonEmptyString,
      name: nonEmptyString,
      type: nonEmptyString,
      value: JSONSchema.defineSchema
        .string()
        .min(1)
        .or(nonEmptyString.array().nonempty())
        .or(JSONSchema.defineSchema.number())
        .or(
          JSONSchema.defineSchema
            .object({
              id: nonEmptyString,
              name: nonEmptyString,
            })
            .array()
            .nonempty(),
        )
        .or(JSONSchema.defineSchema.null()),
    })
    .array()
    .or(JSONSchema.defineSchema.void().array().length(0)),
});

const responseSchema = JSONSchema.toJSONSchema(definedResponseSchema);

export const schema: FastifySchema = {
  response: { 200: responseSchema, 400: responseSchema },
};

export type Reply = ToTS<typeof definedResponseSchema>;
