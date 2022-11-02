import { Either, mergeInMany } from '@sweet-monads/either';
import { FetchError, PackageNameError } from 'common/services';

import { propertyToModel } from '@utils';

import { Dependencies, LibraryData } from './types';
import { getGithubInfo } from './helpers';

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

  const eitherGithubInfo = (
    await npm.asyncMap(({ gitRepository }) => getGithubInfo(gitRepository, github))
  ).join();

  const eitherFullPackageInfo = mergeInMany([eitherGithubInfo, eitherDownloads]);

  const result = (
    await eitherFullPackageInfo.asyncMap(async ([githubInfo, npmDownloads]) => {
      const propertiesModels = await propertyToModel(
        {
          name: libraryData.name,
          platform: libraryData.platform,
          repoURL: githubInfo.repoURL,
          status: libraryData.status,
          tags: libraryData.tags,
          score: libraryData.score ?? '',
          review: libraryData.review ?? '',
          npmDownloads,
          stars: githubInfo.stars,
          summary: githubInfo.description ?? '',
        },
        dbRepository,
      );

      return dbRepository.addLibrary(propertiesModels);
    })
  ).join();

  return result;
};
