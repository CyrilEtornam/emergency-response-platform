import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const decodeJwtPayload = (token: string): Record<string, any> | null => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const payload = decodeJwtPayload(accessToken);
    if (!payload || payload.role !== requiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default PrivateRoute;