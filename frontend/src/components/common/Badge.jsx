import React from 'react';
import clsx from 'clsx';
import { ROLE_LABELS } from '../../utils/constants';

// Full class strings written out completely for Tailwind JIT scanning
const STATUS_CLASSES = {
  REPORTED:    'bg-warning/15 text-warning',
  ASSIGNED:    'bg-warning/15 text-warning',
  EN_ROUTE:    'bg-info/15 text-info',
  RESOLVED:    'bg-success/15 text-success',
  AVAILABLE:   'bg-success/15 text-success',
  ON_SCENE:    'bg-danger/15 text-danger',
  RETURNING:   'bg-info/15 text-info',
  ACTIVE:      'bg-info/15 text-info',
  INACTIVE:    'bg-elevated text-muted border border-subtle',
};

const SEVERITY_CLASSES = {
  CRITICAL: 'bg-danger/15 text-danger',
  HIGH:     'bg-accent/15 text-accent',
  MEDIUM:   'bg-warning/15 text-warning',
  LOW:      'bg-success/15 text-success',
};

const AGENCY_CLASSES = {
  MEDICAL:  'bg-medical/15 text-medical',
  HOSPITAL: 'bg-medical/15 text-medical',
  POLICE:   'bg-police/15 text-police',
  FIRE:     'bg-fire/15 text-fire',
};

const ROLE_CLASSES = {
  SUPER_ADMIN:    'bg-accent/15 text-accent',
  HOSPITAL_ADMIN: 'bg-medical/15 text-medical',
  POLICE_ADMIN:   'bg-police/15 text-police',
  FIRE_ADMIN:     'bg-fire/15 text-fire',
};

export function Badge({ variant = 'status', value, className, children }) {
  let colorClass = '';
  let label = children || value;

  if (variant === 'status' && value) {
    colorClass = STATUS_CLASSES[value] || 'bg-elevated text-muted';
    label = value?.replaceAll('_', ' ');
  } else if (variant === 'severity' && value) {
    colorClass = SEVERITY_CLASSES[value] || 'bg-elevated text-muted';
    label = value;
  } else if (variant === 'agency' && value) {
    colorClass = AGENCY_CLASSES[value] || 'bg-elevated text-muted';
    label = value?.replaceAll('_', ' ');
  } else if (variant === 'role' && value) {
    colorClass = ROLE_CLASSES[value] || 'bg-elevated text-muted';
    label = ROLE_LABELS[value] || value;
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wide',
        colorClass,
        className
      )}
    >
      {label}
    </span>
  );
}
