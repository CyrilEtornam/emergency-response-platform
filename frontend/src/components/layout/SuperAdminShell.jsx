import React from 'react';
import { Outlet } from 'react-router-dom';
import { SuperAdminNav } from './SuperAdminNav';

export function SuperAdminShell() {
  return (
    <div className="flex h-screen overflow-hidden bg-base">
      <SuperAdminNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-base">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
