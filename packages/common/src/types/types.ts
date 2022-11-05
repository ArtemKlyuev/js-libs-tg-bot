export interface ErrorWithCode extends Error {
  code: number | null;
}
