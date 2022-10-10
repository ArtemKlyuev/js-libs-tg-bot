interface Props {
  label: string;
  children: React.ReactNode;
}

export const Fieldset = ({ children, label }: Props) => {
  return (
    <fieldset>
      <legend>{label}</legend>
      {children}
    </fieldset>
  );
};
