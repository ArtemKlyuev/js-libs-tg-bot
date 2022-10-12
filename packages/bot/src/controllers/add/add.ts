import { Either, mergeInMany } from '@sweet-monads/either';

import { Dependencies, LibraryUserDefinedMeta } from './types';
import { getLibraryWithGithubInfo } from './helpers';

export const addController = async (
  { NPMRegistry, github, dbRepo }: Dependencies,
  libraryUserDefinedMeta: LibraryUserDefinedMeta,
): Promise<Either<Error | unknown[], void>> => {
  const npm = await NPMRegistry.getPackageInfo(libraryUserDefinedMeta.name);
  const eitherDownloads = (
    await NPMRegistry.getPackageDownloads(libraryUserDefinedMeta.name, { point: 'last-week' })
  ).mapRight(({ downloads }) => downloads);

  const eitherNPMInfo = (
    await npm.asyncMap(getLibraryWithGithubInfo(libraryUserDefinedMeta, github))
  ).join();

  const eitherFullLibraryInfo = mergeInMany([eitherNPMInfo, eitherDownloads]);

  const result = (
    await eitherFullLibraryInfo.asyncMap(([lib, npmDownloads]) => {
      return dbRepo.addLibrary({
        ...lib,
        npmDownloads,
        githubStars: lib.stars,
        summary: lib.description ?? '',
      });
    })
  ).join();

  return result;
};
