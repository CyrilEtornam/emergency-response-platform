import React from 'react';
import clsx from 'clsx';
import { Spinner } from './Spinner';

const variants = {
  primary:   'bg-accent hover:bg-accent-hover text-white',
  secondary: 'border border-default hover:border-strong text-secondary hover:text-primary',
  danger:    'border border-danger text-danger hover:bg-danger/10',
  ghost:     'bg-transparent text-secondary hover:bg-elevated border border-transparent',
};

const sizes = {
  sm: 'px-3 py-1.5 text-[13px]',
  md: 'px-4 py-2 text-[13px]',
  lg: 'px-5 py-2.5 text-[14px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  className,
  ...props
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium rounded-[4px] transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-accent',
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" className="text-current" />}
      {children}
    </button>
  );
}
