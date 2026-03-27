import React from 'react';
import { Button } from './Button';

export function EmptyState({ icon: Icon, title, description, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-[#334155]" />
        </div>
      )}
      <p className="text-sm font-medium text-[#94A3B8] mb-1">{title || 'No data'}</p>
      {description && (
        <p className="text-sm text-[#94A3B8] max-w-xs">{description}</p>
      )}
      {action && actionLabel && (
        <div className="mt-4">
          <Button size="sm" onClick={action}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}
