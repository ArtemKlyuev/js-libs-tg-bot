interface Props {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const Form = ({ children, onSubmit }: Props) => {
  return (
    <form onSubmit={onSubmit} autoComplete="off" spellCheck={false} className="grid gap-[20px]">
      {children}
    </form>
  );
};
