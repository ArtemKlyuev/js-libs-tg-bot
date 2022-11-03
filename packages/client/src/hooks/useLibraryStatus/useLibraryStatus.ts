import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { PackageInfo, PackageNameError, FetchError, useNPMRegistry } from '../useNPMRegistry';
import { useServices } from '../useServices';

interface ExistPackage {
  error: string | null;
  exist: boolean;
}

export const useLibraryStatus = () => {
  const { httpRequest } = useServices();
  const [library, setLibrary] = useState('');
  const NPMRegistry = useNPMRegistry();

  const checkExistingLibraryInDb = useQuery<ExistPackage, PackageNameError | FetchError>(
    ['database-library-info', library],
    async () => {
      const { response } = httpRequest.get<ExistPackage>('/library/check-existing', {
        params: { name: library },
      });
      const result = await response;
      return result.data;
    },
    { enabled: Boolean(library) },
  );

  const npmLibraryInfo = useQuery<PackageInfo, PackageNameError | FetchError>(
    ['npm-library-info'],
    async () => {
      const result = await NPMRegistry.getPackageInfo(library);
      return result.unwrap();
    },
    { enabled: checkExistingLibraryInDb.isError },
  );

  return {
    setLibrary,
    existOnDb: checkExistingLibraryInDb.isFetched ? !checkExistingLibraryInDb.isError : null,
    existOnNPM: npmLibraryInfo.isFetched ? !npmLibraryInfo.isError : null,
  };
};
