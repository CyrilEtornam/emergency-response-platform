import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

const NAV_ITEMS = [
  {
    to: '/admin/overview',
    label: 'Overview',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
      </svg>
    ),
  },
  {
    to: '/admin/users',
    label: 'User Management',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-6 8a6 6 0 0112 0H3zm13-6a3 3 0 11-6 0 3 3 0 016 0zm-3 8a6 6 0 00-3-5.197A5.002 5.002 0 0120 17h-7z" />
      </svg>
    ),
  },
  {
    to: '/admin/agencies',
    label: 'Agency Overview',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    to: '/admin/map',
    label: 'System Map',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    to: '/admin/analytics',
    label: 'Analytics',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-4a1 1 0 011-1h2a1 1 0 011 1v13a1 1 0 01-1 1h-2a1 1 0 01-1-1V3z" />
      </svg>
    ),
  },
  {
    to: '/admin/audit-logs',
    label: 'Audit Logs',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
];

export function SuperAdminNav() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-[220px] bg-surface border-r border-subtle flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-subtle">
        <span className="text-[15px] font-semibold text-primary">GhanaERS</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-2.5 text-[14px] transition-colors',
                isActive
                  ? 'text-accent bg-accent/10 border-l-[3px] border-accent font-medium'
                  : 'text-secondary hover:bg-elevated hover:text-primary'
              )
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-subtle p-4">
        <div className="mb-3">
          <p className="text-[13px] font-medium text-primary truncate">
            {user?.fullName || user?.email}
          </p>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-widest bg-accent/15 text-accent mt-1">
            Super Admin
          </span>
        </div>
        <Button variant="secondary" size="sm" className="w-full" onClick={logout}>
          Sign out
        </Button>
      </div>
    </aside>
  );
}
