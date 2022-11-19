import {
  PackageInfo,
  PackageNameError,
  FetchError,
  NPMRegistry,
  NPMRegistryAPI,
} from 'common/services';

export type { PackageInfo, PackageNameError, FetchError };

export const useNPMRegistry = (): NPMRegistry => {
  return NPMRegistryAPI;
};
