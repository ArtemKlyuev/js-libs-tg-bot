import { Button } from '../Button';

interface Props {
  message: string;
  messageFromServer?: string;
  onRetry: () => void;
}

export const ErrorMessage = ({ message, onRetry, messageFromServer }: Props) => {
  return (
    <div className="grid gap-[15px] text-center">
      <h2 className="text-2xl">Error</h2>
      <p>{message}</p>
      {Boolean(messageFromServer) && <p>{messageFromServer}</p>}
      <Button type="button" onClick={onRetry}>
        Повторить
      </Button>
    </div>
  );
};
