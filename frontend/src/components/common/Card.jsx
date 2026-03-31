import React from 'react';
import clsx from 'clsx';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={clsx(
        'bg-surface border border-subtle rounded-[6px]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return (
    <div className={clsx('px-5 py-4 border-b border-subtle', className)}>
      {children}
    </div>
  );
}

export function CardBody({ className, children }) {
  return (
    <div className={clsx('px-5 py-4', className)}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, sub, icon: Icon, accentColor }) {
  return (
    <Card className="p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-secondary mb-1">
            {label}
          </p>
          <p className="text-[32px] font-semibold text-primary leading-none">{value ?? '—'}</p>
          {sub && <p className="text-[13px] text-secondary mt-1">{sub}</p>}
        </div>
        {Icon && (
          <div
            className="w-10 h-10 rounded-[4px] flex items-center justify-center bg-accent/10"
          >
            <Icon
              className="w-5 h-5"
              style={{ color: accentColor || '#e8622a' }}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
