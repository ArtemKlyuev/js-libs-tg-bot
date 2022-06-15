import { Either, left, mergeInMany } from '@sweet-monads/either';

import { DatabaseRepository } from '@repository';
import { GithubApi, NPMRegistry } from '@services';

interface Dependencies {
  github: typeof GithubApi;
  NPMRegistry: typeof NPMRegistry;
  dbRepo: DatabaseRepository;
}

interface Library {
  name: string;
  platform: string;
  tags: string[];
  status: string;
  score?: string;
  review?: string;
}

export const addController = async (
  { NPMRegistry, github, dbRepo }: Dependencies,
  library: Library,
): Promise<Either<Error | unknown[], void>> => {
  const npm = await NPMRegistry.getPackageInfo(library.name);
  const downloads = (
    await NPMRegistry.getPackageDownloads(library.name, { point: 'last-week' })
  ).mapRight(({ downloads }) => downloads);

  const eitherNPMInfo = (
    await npm.asyncMap(async (lib) => {
      const { owner, name } = lib.gitRepository;

      if (!owner || !name) {
        return left(new Error('No owner or name'));
      }

      const res = await github.getRepoInfo(owner, name);

      return res.mapRight(({ html_url, stargazers_count, description }) => {
        return { ...library, repoURL: html_url, stars: stargazers_count, description };
      });
    })
  ).join();

  const fullLibraryInfo = mergeInMany([eitherNPMInfo, downloads]);

  const result = (
    await fullLibraryInfo.asyncMap(([lib, npmDownloads]) => {
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
