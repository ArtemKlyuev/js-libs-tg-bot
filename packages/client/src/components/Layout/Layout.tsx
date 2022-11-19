import { useDocumentTitle } from '@hooks';
import { Suspense } from 'react';

import { Spinner } from '@components';

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const Layout = ({ title, children }: Props) => {
  useDocumentTitle(title);

  return (
    <main className="max-w-[414px] m-auto p-[5px]">
      <h1 className="text-3xl font-bold underline text-center">{title}</h1>
      <Suspense fallback={<Spinner />}>{children}</Suspense>
    </main>
  );
};
