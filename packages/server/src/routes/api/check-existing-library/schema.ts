import { Static, Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';

const queryStringSchema = Type.Object({
  name: Type.Optional(Type.String()),
});

const responseSchema = Type.Object({
  error: Type.Union([Type.String(), Type.Null()]),
  exist: Type.Boolean(),
});

export const schema: FastifySchema = {
  querystring: queryStringSchema,
  response: { 200: responseSchema, 400: responseSchema },
};

export type Querystring = Static<typeof queryStringSchema>;

export type Reply = Static<typeof responseSchema>;
