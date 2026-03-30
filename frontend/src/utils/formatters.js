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

const GHANA_LOCATIONS = [
  { name: 'Accra',      minLat: 5.45,  maxLat: 5.75,  minLng: -0.35, maxLng:  0.05 },
  { name: 'Tema',       minLat: 5.60,  maxLat: 5.75,  minLng: -0.05, maxLng:  0.10 },
  { name: 'Kumasi',     minLat: 6.55,  maxLat: 6.80,  minLng: -1.70, maxLng: -1.50 },
  { name: 'Tamale',     minLat: 9.35,  maxLat: 9.50,  minLng: -0.90, maxLng: -0.80 },
  { name: 'Cape Coast', minLat: 5.05,  maxLat: 5.20,  minLng: -1.30, maxLng: -1.10 },
  { name: 'Takoradi',   minLat: 4.85,  maxLat: 5.00,  minLng: -1.85, maxLng: -1.70 },
  { name: 'Sunyani',    minLat: 7.30,  maxLat: 7.45,  minLng: -2.40, maxLng: -2.25 },
  { name: 'Ho',         minLat: 6.55,  maxLat: 6.70,  minLng:  0.40, maxLng:  0.55 },
  { name: 'Koforidua',  minLat: 6.05,  maxLat: 6.15,  minLng: -0.30, maxLng: -0.20 },
  { name: 'Wa',         minLat: 9.95,  maxLat: 10.10, minLng: -2.65, maxLng: -2.45 },
  { name: 'Bolgatanga', minLat: 10.75, maxLat: 10.85, minLng: -0.95, maxLng: -0.75 },
];

/**
 * Returns a human-readable location label for Ghana coordinates.
 * Returns "around {City}" if within a known city bounding box,
 * otherwise falls back to "lat, lng" decimals.
 */
export function getLocationLabel(lat, lng) {
  if (lat == null || lng == null) return null;
  const n = Number(lat);
  const e = Number(lng);
  const match = GHANA_LOCATIONS.find(
    (l) => n >= l.minLat && n <= l.maxLat && e >= l.minLng && e <= l.maxLng
  );
  return match ? `around ${match.name}` : `${n.toFixed(4)}, ${e.toFixed(4)}`;
}
