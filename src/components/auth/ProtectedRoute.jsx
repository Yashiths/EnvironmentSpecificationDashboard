import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, requireAdmin = false, requireSuperAdmin = false }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireSuperAdmin && user?.role?.toLowerCase() !== 'super admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireAdmin && !['admin', 'super admin'].includes(user?.role?.toLowerCase())) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
