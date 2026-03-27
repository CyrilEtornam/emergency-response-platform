import React from 'react';
import clsx from 'clsx';
import { Spinner } from './Spinner';

const variants = {
  primary: 'bg-[#3B82F6] text-white hover:bg-[#2563EB] border border-[#3B82F6] hover:border-[#2563EB]',
  secondary: 'bg-[#1E293B] text-[#F1F5F9] border border-[#334155] hover:bg-[#263147]',
  danger: 'bg-[#1E293B] text-[#DC2626] border border-[#DC2626] hover:bg-[#FEE2E2]/10',
  ghost: 'bg-transparent text-[#94A3B8] hover:bg-[#263147] border border-transparent',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
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
        'inline-flex items-center justify-center gap-2 font-medium rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1',
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
