import { Either, mergeInMany } from '@sweet-monads/either';
import { FetchError, PackageNameError } from 'common/services';

import { Dependencies, LibraryData } from './types';
import { getLibraryWithGithubInfo } from './helpers';

type Errors = Error | PackageNameError | FetchError;

type AddLibraryResult = Either<Errors | Errors[], void>;

export const addLibrary = async (
  libraryData: LibraryData,
  { dbRepository, github, npmRegistry }: Dependencies,
): Promise<AddLibraryResult> => {
  const npm = await npmRegistry.getPackageInfo(libraryData.name);

  if (npm.isLeft()) {
    // @ts-expect-error Ругается, что `PackageInfo` не соответствует типу `void`, но
    // состояние `Either` - `left`, поэтому в `mapRight` ничего не попадёт
    return npm;
  }

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
