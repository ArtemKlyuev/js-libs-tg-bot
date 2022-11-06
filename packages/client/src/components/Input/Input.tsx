import { ChangeEvent, forwardRef } from 'react';

interface Props {
  type?: 'text' | 'search';
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(({ type = 'text', ...props }, ref) => {
  return <input ref={ref} type={type} className="input input-bordered w-full" {...props} />;
});
