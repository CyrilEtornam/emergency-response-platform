import React from 'react';
import { Button } from './Button';

export function EmptyState({ icon: Icon, title, description, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-surface border border-subtle flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-subtle" />
        </div>
      )}
      <p className="text-[13px] font-medium text-secondary mb-1">{title || 'No data'}</p>
      {description && (
        <p className="text-[13px] text-secondary max-w-xs">{description}</p>
      )}
      {action && actionLabel && (
        <div className="mt-4">
          <Button size="sm" onClick={action}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}
