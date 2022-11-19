import { Either, left, mergeInMany } from '@sweet-monads/either';
import { FetchError, PackageNameError } from 'common/services';

import { propertyToModel } from '@utils';

import { Dependencies, LibraryData } from './types';
import { getGithubInfo } from './helpers';

type Errors = Error | PackageNameError | FetchError;

type AddLibraryResult = Either<Errors | Errors[], void>;

export const addLibrary = async (
  libraryData: LibraryData,
  { bestOfJS, dbRepository, github, npmRegistry }: Dependencies,
): Promise<AddLibraryResult> => {
  const libraryName = libraryData.name.trim().toLowerCase();
  const npm = await npmRegistry.getPackageInfo(libraryName);

  if (npm.isLeft()) {
    // @ts-expect-error Ругается, что `PackageInfo` не соответствует типу `void`, но
    // состояние `Either` - `left`, поэтому в `mapRight` ничего не попадёт
    return npm;
  }

  const eitherDownloads = (
    await npmRegistry.getPackageDownloads(libraryName, {
      point: 'last-week',
    })
  ).mapRight(({ downloads }) => downloads);

  const awaitableEitherGithubInfo = npm
    .mapRight(({ gitRepository }) => gitRepository)
    .asyncMap(async (gitRepository) => {
      const { owner, name } = gitRepository;

      if (owner && name) {
        return getGithubInfo({ owner, name }, github);
      }

      const project = await bestOfJS.findByNPMName(libraryName);

      if (!project) {
        return left(new Error(`No owner or name. owner: ${owner}, name: ${name}`));
      }

      const { full_name: githubPath } = project;

      const [repoOwner, repoName] = githubPath.split('/');

      return getGithubInfo({ name: repoName, owner: repoOwner }, github);
    });

  const eitherGithubInfo = (await awaitableEitherGithubInfo).join();

  const eitherFullPackageInfo = mergeInMany([eitherGithubInfo, eitherDownloads]);

  const result = (
    await eitherFullPackageInfo.asyncMap(async ([githubInfo, npmDownloads]) => {
      const propertiesModels = await propertyToModel(
        {
          name: libraryName,
          platform: libraryData.platform,
          repoURL: githubInfo.repoURL,
          status: libraryData.status,
          tags: libraryData.tags,
          rating: libraryData.rating,
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
