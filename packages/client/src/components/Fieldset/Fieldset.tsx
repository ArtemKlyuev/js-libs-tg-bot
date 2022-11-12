import { FieldError } from '../FieldError';

interface Props {
  label: string;
  children: React.ReactNode | React.ReactNode[];
  errorMessage?: string | undefined;
}

export const Fieldset = ({ children, label, errorMessage }: Props) => {
  return (
    <fieldset className="max-h-[300px] overflow-y-auto">
      <legend>{label}</legend>
      {errorMessage && <FieldError message={errorMessage} />}
      {children}
    </fieldset>
  );
};
