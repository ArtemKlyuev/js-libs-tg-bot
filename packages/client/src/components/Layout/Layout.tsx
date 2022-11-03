import { useDocumentTitle } from '@hooks';

interface Props {
  title: string;
  children: React.ReactNode;
}

export const Layout = ({ title, children }: Props) => {
  useDocumentTitle(title);

  return (
    <main className="w-[375px] m-auto">
      <h1 className="text-3xl font-bold underline">{title}</h1>
      {children}
    </main>
  );
};
