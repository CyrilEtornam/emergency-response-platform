import React from 'react';
import clsx from 'clsx';
import { Spinner } from './Spinner';
import { EmptyState } from './EmptyState';

/**
 * Generic table component.
 *
 * columns: Array<{ key: string, label: string, render?: (value, row) => ReactNode, width?: string }>
 * data: object[]
 * onRowClick?: (row) => void
 * selectedId?: string — highlights matching row (matches row.id)
 */
export function Table({ columns, data, loading, emptyTitle, emptyDescription, onRowClick, selectedId }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || 'No records found'}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-elevated border-b border-default">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-widest text-secondary"
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={() => onRowClick?.(row)}
              className={clsx(
                'border-b border-subtle last:border-0 transition-colors',
                onRowClick && 'cursor-pointer hover:bg-elevated',
                selectedId && row.id === selectedId && 'bg-accent/10'
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-[14px] text-primary">
                  {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-subtle">
      <p className="text-[13px] text-secondary">
        Page {page + 1} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="px-3 py-1.5 text-[13px] border border-subtle rounded-[4px] disabled:opacity-40 hover:bg-elevated text-primary transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="px-3 py-1.5 text-[13px] border border-subtle rounded-[4px] disabled:opacity-40 hover:bg-elevated text-primary transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
