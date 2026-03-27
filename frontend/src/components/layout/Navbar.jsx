import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AGENCY_COLORS, ROLE_TO_AGENCY, ROLE_LABELS } from '../../utils/constants';
import { Button } from '../common/Button';

export function Navbar() {
  const { user, logout } = useAuth();

  const agencyType = ROLE_TO_AGENCY[user?.role];
  const agencyStyle = AGENCY_COLORS[agencyType] || null;

  return (
    <header className="h-14 bg-[#1E293B] border-b border-[#334155] flex items-center px-5 shrink-0 z-20">
      {/* Wordmark */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-accent font-semibold text-base tracking-tight">GhanaERS</span>
      </div>

      {/* Agency name */}
      <div className="flex-1 flex items-center justify-center">
        {agencyStyle && (
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: agencyStyle.color }}
            />
            <span className="text-sm font-medium text-[#F1F5F9]">{agencyStyle.label}</span>
          </div>
        )}
      </div>

      {/* User info */}
      <div className="flex items-center gap-4 shrink-0">
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-[#F1F5F9] leading-tight">
                {user.fullName || user.email}
              </p>
              <p className="text-xs text-[#94A3B8]">{ROLE_LABELS[user.role] || user.role}</p>
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
