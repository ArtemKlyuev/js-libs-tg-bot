import { useDocumentTitle } from '@hooks';

interface Props {
  title: string;
  children: React.ReactNode;
}

export const Layout = ({ title, children }: Props) => {
  useDocumentTitle(title);

  return (
    <main className="max-w-[414px] m-auto p-[5px]">
      <h1 className="text-3xl font-bold underline">{title}</h1>
      {children}
    </main>
  );
};
