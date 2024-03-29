/**
 * @see https://github.com/TypeStrong/ts-node/discussions/1450#discussioncomment-1806115
 */

import { pathToFileURL } from 'url';

import { resolve as resolveTs } from 'ts-node/esm';
import * as tsConfigPaths from 'tsconfig-paths';

const { absoluteBaseUrl, paths } = tsConfigPaths.loadConfig();

const matchPath = tsConfigPaths.createMatchPath(absoluteBaseUrl, paths);

export function resolve(specifier, ctx, defaultResolve) {
  const match = matchPath(specifier);

  if (match) {
    return resolveTs(pathToFileURL(`${match}`).href, ctx, defaultResolve);
  }

  return resolveTs(specifier, ctx, defaultResolve);
}

export { load, transformSource } from 'ts-node/esm';
