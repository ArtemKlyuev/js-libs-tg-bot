import { NPMRegistry } from 'common/services';

interface Kek {
  getPackageInfo: typeof NPMRegistry.getPackageInfo;
  getPackageDownloads: typeof NPMRegistry.getPackageDownloads;
}

export const useNPMRegistry = (): Kek => {
  const getPackageInfo = NPMRegistry.getPackageInfo;
  const getPackageDownloads = NPMRegistry.getPackageDownloads;

  return { getPackageInfo, getPackageDownloads };
};
