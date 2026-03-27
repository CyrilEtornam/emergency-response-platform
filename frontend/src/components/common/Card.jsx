import React from 'react';
import clsx from 'clsx';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={clsx(
        'bg-[#1E293B] border border-[#334155] rounded-[8px]',
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
    <div className={clsx('px-5 py-4 border-b border-[#334155]', className)}>
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
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-[#94A3B8] mb-1">
            {label}
          </p>
          <p className="text-2xl font-semibold text-[#F1F5F9]">{value ?? '—'}</p>
          {sub && <p className="text-xs text-[#94A3B8] mt-1">{sub}</p>}
        </div>
        {Icon && (
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: accentColor ? `${accentColor}1A` : '#EFF6FF' }}
          >
            <Icon
              className="w-5 h-5"
              style={{ color: accentColor || '#1D4ED8' }}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
