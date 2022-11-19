import { Either } from '@sweet-monads/either';

import { Github } from '@services/Github';

interface RepoInfo {
  owner: string;
  name: string;
}

interface GithubInfo {
  repoURL: string;
  stars: number;
  description: string | null;
}

type Result = Either<Error, GithubInfo>;

export const getGithubInfo = async ({ owner, name }: RepoInfo, github: Github): Promise<Result> => {
  const eitherRepoInfo = await github.getRepoInfo(owner, name);

  return eitherRepoInfo.mapRight(({ html_url, stargazers_count, description }) => {
    return { repoURL: html_url, stars: stargazers_count, description };
  });
};
