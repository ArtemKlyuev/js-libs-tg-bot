import { FieldError } from '../FieldError';

export interface FieldsetProps {
  label: string;
  children: React.ReactNode | React.ReactNode[];
  errorMessage?: string | undefined;
}

export const Fieldset = ({ children, label, errorMessage }: FieldsetProps) => {
  return (
    <fieldset>
      <legend>{label}</legend>
      {errorMessage && <FieldError message={errorMessage} />}
      {children}
    </fieldset>
  );
};
