import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import { Spinner } from './components/common/Spinner';

// Layouts
import { AgencyShell } from './components/layout/AgencyShell';
import { SuperAdminShell } from './components/layout/SuperAdminShell';

// Pages
import { LoginPage } from './pages/LoginPage';
import { OverviewPage } from './pages/admin/OverviewPage';
import { UsersPage } from './pages/admin/UsersPage';
import { AgenciesPage } from './pages/admin/AgenciesPage';
import { MapPage } from './pages/admin/MapPage';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';

// ─── Google Maps config ───────────────────────────────────────────────────────
// LIBRARIES must be defined OUTSIDE the component to prevent re-renders
const LIBRARIES = ['places'];

// ─── Route guards ─────────────────────────────────────────────────────────────
function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function RequireSuperAdmin({ children }) {
  const { user } = useAuth();
  if (user?.role !== 'SUPER_ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function RequireAgencyAdmin({ children }) {
  const { user } = useAuth();
  if (user?.role === 'SUPER_ADMIN') {
    return <Navigate to="/admin/overview" replace />;
  }
  return children;
}

function RootRedirect() {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'SUPER_ADMIN') return <Navigate to="/admin/overview" replace />;
  return <Navigate to="/dashboard" replace />;
}

// ─── App ──────────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Agency admin shell (map-first) */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <RequireAgencyAdmin>
              <AgencyShell />
            </RequireAgencyAdmin>
          </RequireAuth>
        }
      />

      {/* Super admin portal */}
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <RequireSuperAdmin>
              <SuperAdminShell />
            </RequireSuperAdmin>
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/admin/overview" replace />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="agencies" element={<AgenciesPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const mapsKey = process.env.REACT_APP_GOOGLE_MAPS_KEY || '';

  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <LoadScript
            googleMapsApiKey={mapsKey}
            libraries={LIBRARIES}
            loadingElement={
              <div className="h-screen flex items-center justify-center">
                <Spinner size="xl" />
              </div>
            }
          >
            <AppRoutes />
          </LoadScript>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
