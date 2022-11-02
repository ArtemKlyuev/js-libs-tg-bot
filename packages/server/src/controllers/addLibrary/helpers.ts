import { Either, left } from '@sweet-monads/either';

import { Github } from '@services/Github';

interface RepoInfo {
  owner: string | null;
  name: string | null;
}

interface GithubInfo {
  repoURL: string;
  stars: number;
  description: string | null;
}

type Result = Either<Error, GithubInfo>;

export const getGithubInfo = async ({ owner, name }: RepoInfo, github: Github): Promise<Result> => {
  if (!owner || !name) {
    return left(new Error(`No owner or name. owner: ${owner}, name: ${name}`));
  }

  const eitherRepoInfo = await github.getRepoInfo(owner, name);

  return eitherRepoInfo.mapRight(({ html_url, stargazers_count, description }) => {
    return { repoURL: html_url, stars: stargazers_count, description };
  });
};
