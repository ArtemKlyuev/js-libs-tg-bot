import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { PackageInfo, PackageNameError, FetchError, useNPMRegistry } from '../useNPMRegistry';

export const useLibraryStatus = () => {
  const [library, setLibrary] = useState('');
  const NPMRegistry = useNPMRegistry();

  const databaseLibraryInfo = useQuery<PackageInfo, PackageNameError | FetchError>(
    ['databse-library-info', library],
    async () => {
      console.log('databse query', library);
      const result = await NPMRegistry.getPackageInfo(library);
      console.log('result', result);
      return result.unwrap();
    },
    { enabled: Boolean(library) },
  );

  console.log({ databaseLibraryInfo });

  const packageID = databaseLibraryInfo.data?.id;

  const npmLibraryInfo = useQuery<PackageInfo, PackageNameError | FetchError>(
    ['npm-library', packageID],
    async () => {
      const result = await NPMRegistry.getPackageInfo(library);
      return result.unwrap();
    },
    { enabled: databaseLibraryInfo.isError },
  );

  console.log({ npmLibraryInfo });

  return { setLibrary };
};
