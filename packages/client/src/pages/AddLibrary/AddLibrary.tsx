import { lazy, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HttpRequestError } from 'common/services';
import { GetPropertiesSuccessReply, GetPropertiesErrorReply } from 'server/types';

import { AbsoluteCenter, ErrorMessage, Spinner } from '@components';
import { useAppCache, useServices } from '@hooks';

const LibraryForm = lazy(() =>
  import('./LibraryForm').then((module) => ({ default: module.LibraryForm })),
);

const centeredSpinner = (
  <AbsoluteCenter>
    <Spinner />
  </AbsoluteCenter>
);

export const AddLibrary = () => {
  const { libraryService } = useServices();
  const cache = useAppCache();

  const { isLoading, isError, error, data, refetch } = useQuery<
    GetPropertiesSuccessReply,
    HttpRequestError<GetPropertiesErrorReply>
  >(
    ['library-properties'],
    async () => {
      const { data } = await libraryService.getProperties().response;
      return data as GetPropertiesSuccessReply;
    },
    {
      enabled: cache.isEmpty(),
      onSuccess: (data) => cache.set('properties', data.properties),
    },
  );

  if (cache.isEmpty() && !data?.properties && isLoading) {
    return centeredSpinner;
  }

  if (isError) {
    const { message, responseData } = error;

    return (
      <AbsoluteCenter>
        <ErrorMessage message={message} messageFromServer={responseData?.error} onRetry={refetch} />
      </AbsoluteCenter>
    );
  }

  return (
    <Suspense fallback={centeredSpinner}>
      <LibraryForm properties={cache.get('properties') ?? data!.properties} />
    </Suspense>
  );
};
