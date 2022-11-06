import { lazy, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HttpRequestError } from 'common/services';
import { GetPropertiesSuccessReply, GetPropertiesErrorReply } from 'server/types';

import { AbsoluteCenter, ErrorMessage, Spinner } from '@components';
import { useServices } from '@hooks';

const LibraryForm = lazy(() =>
  import('./LibraryForm').then((module) => ({ default: module.LibraryForm })),
);

export const AddLibrary = () => {
  const { libraryService } = useServices();

  const libraryPropertiesQuery = useQuery<
    GetPropertiesSuccessReply,
    HttpRequestError<GetPropertiesErrorReply>
  >(['library-properties'], async () => {
    const { data } = await libraryService.getProperties().response;
    return data as GetPropertiesSuccessReply;
  });

  if (libraryPropertiesQuery.isLoading) {
    return (
      <AbsoluteCenter>
        <Spinner />
      </AbsoluteCenter>
    );
  }

  if (libraryPropertiesQuery.isError) {
    const { message, responseData } = libraryPropertiesQuery.error;
    const onRetry = () => libraryPropertiesQuery.refetch();

    return (
      <AbsoluteCenter>
        <ErrorMessage message={message} messageFromServer={responseData?.error} onRetry={onRetry} />
      </AbsoluteCenter>
    );
  }

  return (
    <Suspense fallback={<Spinner />}>
      <LibraryForm properties={libraryPropertiesQuery.data.properties} />
    </Suspense>
  );
};
