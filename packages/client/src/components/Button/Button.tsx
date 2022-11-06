import { forwardRef, ReactNode } from 'react';
import cn from 'classnames';

interface Props {
  children: ReactNode;
  type?: 'button' | 'submit';
  loading?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ children, onClick, disabled, loading, type = 'button' }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn('btn', 'btn-accent', loading && 'loading')}
      >
        {loading ? 'loading' : children}
      </button>
    );
  },
);
