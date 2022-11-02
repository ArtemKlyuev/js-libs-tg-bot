import { ChangeEvent, forwardRef } from 'react';

interface Props {
  checked: boolean;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  name?: string;
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, Props>(({ label, ...props }, ref) => {
  return (
    <div className="form-control">
      <label className="label cursor-pointer justify-start gap-[15px]">
        <input ref={ref} type="checkbox" className="checkbox checkbox-accent" {...props} />
        <span className="label-text">{label}</span>
      </label>
    </div>
  );
});
