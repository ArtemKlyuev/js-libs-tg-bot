import { ChangeEvent, forwardRef } from 'react';

interface Props {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return (
    <input ref={ref} type="text" className="input input-bordered w-full max-w-xs" {...props} />
  );
});
