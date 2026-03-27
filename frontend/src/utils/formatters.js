import { formatDistanceToNow, format, parseISO } from 'date-fns';

/**
 * Returns a human-readable "time ago" string, e.g. "14 min ago"
 */
export function formatTimeAgo(dateStr) {
  if (!dateStr) return '—';
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return '—';
  }
}

/**
 * Formats a date as "Mar 27, 2026 14:32"
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
    return format(date, 'MMM d, yyyy HH:mm');
  } catch {
    return '—';
  }
}

/**
 * Formats a date as "Mar 27, 2026"
 */
export function formatDateShort(dateStr) {
  if (!dateStr) return '—';
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
    return format(date, 'MMM d, yyyy');
  } catch {
    return '—';
  }
}

/**
 * Formats duration in seconds to "X min Y sec" or "X min"
 */
export function formatDuration(seconds) {
  if (seconds == null || isNaN(seconds)) return '—';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins} min`;
  return `${mins} min ${secs}s`;
}

/**
 * Truncates text to maxLength and adds ellipsis.
 */
export function truncate(str, maxLength = 60) {
  if (!str) return '';
  return str.length > maxLength ? str.slice(0, maxLength) + '…' : str;
}

/**
 * Generates and downloads a CSV file from an array of objects.
 * @param {string} filename
 * @param {object[]} rows
 * @param {string[]} columns - keys to include in the CSV
 */
export function downloadCsv(filename, rows, columns) {
  if (!rows || rows.length === 0) return;
  const cols = columns || Object.keys(rows[0]);
  const header = cols.join(',');
  const body = rows
    .map((row) =>
      cols
        .map((col) => {
          const val = row[col] == null ? '' : String(row[col]);
          // Escape quotes and wrap in quotes if contains comma/newline
          const escaped = val.replace(/"/g, '""');
          return /[,"\n\r]/.test(escaped) ? `"${escaped}"` : escaped;
        })
        .join(',')
    )
    .join('\n');
  const csv = `${header}\n${body}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Capitalises the first letter of a string and lowercases the rest.
 */
export function capitalise(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
