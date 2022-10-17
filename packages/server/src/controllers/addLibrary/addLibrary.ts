import { Either, mergeInMany } from '@sweet-monads/either';
import { FetchError, PackageNameError } from 'common/services';

import { Dependencies, LibraryData } from './types';
import { getLibraryWithGithubInfo } from './helpers';

type AddLibraryResult = Either<Error | (Error | PackageNameError | FetchError)[], void>;

export const addLibrary = async (
  libraryData: LibraryData,
  { dbRepository, github, npmRegistry }: Dependencies,
): Promise<AddLibraryResult> => {
  const npm = await npmRegistry.getPackageInfo(libraryData.name);

  const eitherDownloads = (
    await npmRegistry.getPackageDownloads(libraryData.name, { point: 'last-week' })
  ).mapRight(({ downloads }) => downloads);

  const eitherNPMInfo = (await npm.asyncMap(getLibraryWithGithubInfo(libraryData, github))).join();

  const eitherFullNPMInfo = mergeInMany([eitherNPMInfo, eitherDownloads]);

  const result = (
    await eitherFullNPMInfo.asyncMap(([lib, npmDownloads]) => {
      return dbRepository.addLibrary({
        ...lib,
        npmDownloads,
        githubStars: lib.stars,
        summary: lib.description ?? '',
      });
    })
  ).join();

  return result;
};
