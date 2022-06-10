import { Either, left, right } from '@sweet-monads/either';
import {
  Packument,
  FetchError,
  PackageDownloads,
  DownloadPeriod,
  getPackument,
  getPackageDownloads,
  InvalidPackageNameError,
  GitRepository,
} from 'query-registry';

interface Kek extends GitRepository {
  owner: string | null;
  name: string | null;
}

export type PackageInfo = Packument & { gitRepository: Kek };
export type PackageNameError = typeof InvalidPackageNameError;
export type PackageDownloadsError = FetchError;

interface Options {
  point: DownloadPeriod;
}

export class NPMRegistry {
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

  static async getPackageInfo(
    name: string,
  ): Promise<Either<PackageNameError | FetchError, PackageInfo>> {
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
  ): Promise<Either<PackageDownloadsError, PackageDownloads>> {
    try {
      const response = await getPackageDownloads({ name, period: options.point });

      return right(response);
    } catch (error) {
      return left(error);
    }
  }
}
