import { Either, left } from '@sweet-monads/either';
import { PackageInfo } from 'common/services';

import { Github } from '@services';

import { LibraryData } from './types';

interface GithubInfo {
  repoURL: string;
  stars: number;
  description: string | null;
}

type Result = Either<Error, LibraryData & GithubInfo>;

export const getLibraryWithGithubInfo =
  (libraryData: LibraryData, github: Github) =>
  async (libraryNPMInfo: PackageInfo): Promise<Result> => {
    const { owner, name } = libraryNPMInfo.gitRepository;

    if (!owner || !name) {
      return left(new Error(`No owner or name. owner: ${owner}, name: ${name}`));
    }

    const eitherRepoInfo = await github.getRepoInfo(owner, name);

    return eitherRepoInfo.mapRight(({ html_url, stargazers_count, description }) => {
      return { ...libraryData, repoURL: html_url, stars: stargazers_count, description };
    });
  };
