import { forwardRef } from 'react';

interface Props {
  label: string;
  value?: string;
  placeholder?: string;
  id?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(({ label, ...props }, ref) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <textarea ref={ref} className="textarea textarea-bordered h-24 resize-none" {...props} />
    </div>
  );
});
