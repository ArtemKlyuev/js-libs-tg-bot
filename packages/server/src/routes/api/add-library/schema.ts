import { Static, Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';

const bodySchema = Type.Object({
  name: Type.String(),
  platform: Type.String(),
  tags: Type.Array(Type.String()),
  status: Type.String(),
  score: Type.Optional(Type.String()),
  review: Type.Optional(Type.String()),
});

const responseSchema = Type.Object({
  error: Type.Union([Type.String(), Type.Null()]),
  created: Type.Boolean(),
});

export const schema: FastifySchema = {
  body: bodySchema,
  response: { 200: responseSchema, 400: responseSchema },
};

export type Body = Static<typeof bodySchema>;

export type Reply = Static<typeof responseSchema>;
