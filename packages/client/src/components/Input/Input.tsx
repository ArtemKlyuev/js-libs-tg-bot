import { forwardRef } from 'react';

interface Props {
  placeholder?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(({ placeholder }, ref) => {
  return (
    <input
      ref={ref}
      type="text"
      placeholder={placeholder}
      className="input input-bordered w-full max-w-xs"
    />
  );
});
