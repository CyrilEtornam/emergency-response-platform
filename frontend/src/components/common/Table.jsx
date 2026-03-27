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
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#0F172A] border-b border-[#334155]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[#94A3B8]"
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
                'border-b border-[#334155] last:border-0 transition-colors',
                onRowClick && 'cursor-pointer hover:bg-[#263147]',
                selectedId && row.id === selectedId && 'bg-[#1E3A5F]'
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-[#F1F5F9]">
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
    <div className="flex items-center justify-between px-4 py-3 border-t border-[#334155]">
      <p className="text-sm text-[#94A3B8]">
        Page {page + 1} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="px-3 py-1.5 text-sm border border-[#334155] rounded disabled:opacity-40 hover:bg-[#263147] text-[#F1F5F9]"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="px-3 py-1.5 text-sm border border-[#334155] rounded disabled:opacity-40 hover:bg-[#263147] text-[#F1F5F9]"
        >
          Next
        </button>
      </div>
    </div>
  );
}
