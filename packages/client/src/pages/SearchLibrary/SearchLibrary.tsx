import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DevTool } from '@hookform/devtools';
import { z } from 'zod';
import { HttpRequestError } from 'common/services';
import { SearchLibrarySucessReply, SearchLibraryErrorReply } from 'server/types';

import { Form, InputLabel, Input, Button } from '@components';
import { useServices } from '@hooks';

interface Fields {
  query: string;
}

const schema = z.object({ query: z.string().trim().min(1, { message: 'Required' }) });

export const SearchLibrary = () => {
  const { libraryService } = useServices();

  const { handleSubmit, register, reset, control } = useForm<Fields>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
  });

  const [query, setQuery] = useState('');

  const { isLoading, isError, error, data } = useQuery<
    SearchLibrarySucessReply,
    HttpRequestError<SearchLibraryErrorReply>
  >(
    ['search-library', query],
    async () => {
      const { data } = await libraryService.search(query).response;
      return data as SearchLibrarySucessReply;
    },
    { enabled: Boolean(query), onSuccess: () => reset() },
  );

  const onSubmit = handleSubmit((data) => setQuery(data.query));

  console.log('dataaaaa --->', data);

  return (
    <>
      <Form onSubmit={onSubmit}>
        <div className="form-control w-full">
          <InputLabel label="Ключевое слово" />
          <Input type="search" {...register('query')} />
        </div>
        {/* <button type="submit">aaaaa</button> */}
        <Button type="submit">Искать</Button>
        <div className="card w-96 bg-neutral text-neutral-content">
          <div className="card-body">
            <h2 className="card-title">Shoes!</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
          </div>
        </div>
      </Form>
      {import.meta.env.DEV && <DevTool control={control} />}
    </>
  );
};
