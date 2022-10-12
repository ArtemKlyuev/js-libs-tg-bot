import { PackageInfo, PackageNameError, FetchError, NPMRegistry } from 'common/services';

export type { PackageInfo, PackageNameError, FetchError };

export const useNPMRegistry = (): typeof NPMRegistry => {
  return NPMRegistry;
};
