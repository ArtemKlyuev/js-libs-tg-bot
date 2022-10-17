import { left, right } from '@sweet-monads/either';
import { getPackument, getPackageDownloads } from 'query-registry';

import {
  NPMRegistry,
  PackageInfoResult,
  PackageDownloadsResult,
  PackageInfo,
  Options,
} from './types';

export const NPMRegistryAPI: NPMRegistry = class NPMRegistryAPI {
  static #getGithubOwner(repoURL?: string): string | null {
    if (!repoURL) {
      return null;
    }

    return repoURL.split('/').at(-2) ?? null;
  }

  static #getGithubRepoName(repoURL?: string): string | null {
    if (!repoURL) {
      return null;
    }

    return repoURL.split('/').at(-1) ?? null;
  }

  static async getPackageInfo(name: string): Promise<PackageInfoResult> {
    try {
      const response = await getPackument({ name });

      const githubOwner = this.#getGithubOwner(response.gitRepository?.url);
      const githubRepoName = this.#getGithubRepoName(response.gitRepository?.url);

      const result: PackageInfo = {
        ...response,
        gitRepository: { ...response.gitRepository!, owner: githubOwner, name: githubRepoName },
      };

      return right(result);
    } catch (error) {
      return left(error);
    }
  }

  static async getPackageDownloads(
    name: string,
    options: Options,
  ): Promise<PackageDownloadsResult> {
    try {
      const response = await getPackageDownloads({ name, period: options.point });

      return right(response);
    } catch (error) {
      return left(error);
    }
  }
};
