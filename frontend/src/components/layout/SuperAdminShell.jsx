import React from 'react';
import { Outlet } from 'react-router-dom';
import { SuperAdminNav } from './SuperAdminNav';

export function SuperAdminShell() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0F172A]">
      <SuperAdminNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-[#0F172A]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
