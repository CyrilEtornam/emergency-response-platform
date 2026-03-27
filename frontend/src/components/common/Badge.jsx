import React from 'react';
import clsx from 'clsx';
import { STATUS_COLORS, SEVERITY_COLORS, AGENCY_COLORS, ROLE_LABELS } from '../../utils/constants';

/**
 * Flexible badge component.
 * variant: 'status' | 'severity' | 'agency' | 'role' | 'custom'
 * value: the key to look up (e.g. 'REPORTED', 'CRITICAL', 'MEDICAL')
 * For 'custom': pass bg and text props directly.
 */
export function Badge({ variant = 'status', value, bg, text, className, children }) {
  let bgColor = bg;
  let textColor = text;
  let label = children || value;

  if (variant === 'status' && value) {
    const c = STATUS_COLORS[value] || { bg: '#F3F4F6', text: '#6B7280' };
    bgColor = c.bg;
    textColor = c.text;
    label = value?.replaceAll('_', ' ');
  } else if (variant === 'severity' && value) {
    const c = SEVERITY_COLORS[value] || SEVERITY_COLORS.LOW;
    bgColor = c.bg;
    textColor = c.text;
    label = value;
  } else if (variant === 'agency' && value) {
    const c = AGENCY_COLORS[value] || { bg: '#F3F4F6', color: '#6B7280' };
    bgColor = c.bg;
    textColor = c.color;
    label = value?.replaceAll('_', ' ');
  } else if (variant === 'role' && value) {
    bgColor = '#EFF6FF';
    textColor = '#2563EB';
    label = ROLE_LABELS[value] || value;
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium tracking-wide',
        className
      )}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {label}
    </span>
  );
}
