import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { CheckExistingResponse } from '@services';

import { PackageInfo, PackageNameError, FetchError, useNPMRegistry } from '../useNPMRegistry';
import { useServices } from '../useServices';

export const useLibraryStatus = () => {
  const { libraryService } = useServices();
  const [library, setLibrary] = useState('');
  const NPMRegistry = useNPMRegistry();

  const checkExistingLibraryInDb = useQuery<CheckExistingResponse, PackageNameError | FetchError>(
    ['database-library-info', library],
    async () => {
      const { data } = await libraryService.checkExisting(library).response;
      return data;
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
