import { Either } from '@sweet-monads/either';
import {
  Packument,
  FetchError,
  InvalidPackageNameError,
  GitRepository,
  DownloadPeriod,
  PackageDownloads,
} from 'query-registry';

interface SpecificGitRepository extends GitRepository {
  owner: string | null;
  name: string | null;
}

export interface Options {
  point: DownloadPeriod;
}

export type PackageInfoResult = Either<PackageNameError | FetchError, PackageInfo>;
export type PackageDownloadsResult = Either<PackageDownloadsError, PackageDownloads>;

export type PackageInfo = Packument & { gitRepository: SpecificGitRepository };
export type PackageNameError = typeof InvalidPackageNameError;
export type PackageDownloadsError = FetchError;

export type { FetchError };

export interface NPMRegistry {
  getPackageInfo: (name: string) => Promise<PackageInfoResult>;
  getPackageDownloads: (name: string, options: Options) => Promise<PackageDownloadsResult>;
}
