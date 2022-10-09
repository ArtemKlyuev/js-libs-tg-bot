import { Either } from '@sweet-monads/either';

export function unwrapEither<Left, Right>(either: Either<Left, Right>): Left | Right {
  let res: Left | Right;

  const setRes = (value: Left | Right) => (res = value);

  either.mapRight(setRes).mapLeft(setRes);

  // @ts-expect-error назначение сделано в `setRes`
  return res;
}
