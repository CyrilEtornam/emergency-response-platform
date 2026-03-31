import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AGENCY_COLORS, ROLE_TO_AGENCY, ROLE_LABELS } from '../../utils/constants';
import { Button } from '../common/Button';

export function Navbar() {
  const { user, logout } = useAuth();

  const agencyType = ROLE_TO_AGENCY[user?.role];
  const agencyStyle = AGENCY_COLORS[agencyType] || null;

  return (
    <header className="h-[52px] bg-surface border-b border-subtle flex items-center px-4 shrink-0 z-20">
      {/* Wordmark */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-[15px] font-semibold text-primary">GhanaERS</span>
      </div>

      {/* Agency name */}
      <div className="flex-1 flex items-center justify-center">
        {agencyStyle && (
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: agencyStyle.color }}
            />
            <span className="text-[14px] text-secondary">{agencyStyle.label}</span>
          </div>
        )}
      </div>

      {/* User info */}
      <div className="flex items-center gap-3 shrink-0">
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[13px] text-secondary leading-tight">
                {user.fullName || user.email}
              </p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-widest bg-elevated border border-subtle text-muted">
                {ROLE_LABELS[user.role] || user.role}
              </span>
            </div>
          </div>
        )}
        <Button variant="secondary" size="sm" onClick={logout}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
