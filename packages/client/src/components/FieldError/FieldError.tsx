interface Props {
  message: string;
}

export const FieldError = ({ message }: Props) => {
  return <p className="text-error">{message}</p>;
};
