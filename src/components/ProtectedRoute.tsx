import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute: React.FC = () => {
  const isAdminAuth = localStorage.getItem('shop_admin_auth') === 'true';

  if (!isAdminAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};