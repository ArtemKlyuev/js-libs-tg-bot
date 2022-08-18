import { left } from '@sweet-monads/either';

import { GithubApi, PackageInfo } from '@services';

import { LibraryUserDefinedMeta } from './types';

export const validateLibraryNPMInfo = (libraryNPMInfo: PackageInfo) => {
  const { owner, name } = libraryNPMInfo.gitRepository;

  if (!owner || !name) {
    return left(new Error(`No owner or name. owner: ${owner}, name: ${name}`));
  }

  return { owner, name };
};

export const getLibraryWithGithubInfo =
  (libraryUserDefinedMeta: LibraryUserDefinedMeta, github: typeof GithubApi) =>
  async (libraryNPMInfo: PackageInfo) => {
    const { owner, name } = libraryNPMInfo.gitRepository;

    if (!owner || !name) {
      return left(new Error(`No owner or name. owner: ${owner}, name: ${name}`));
    }

    const res = await github.getRepoInfo(owner, name);

    return res.mapRight(({ html_url, stargazers_count, description }) => {
      return { ...libraryUserDefinedMeta, repoURL: html_url, stars: stargazers_count, description };
    });
  };
