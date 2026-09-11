import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { useAuth } from './context/AuthContext';

import { UserPortal } from './pages/UserPortal';
import { AdminPortal } from './pages/AdminPortal';
import { UserLoginPage } from './pages/UserLoginPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { UserManagement } from './components/admin/UserManagement';
import { ClientManagement } from './components/admin/ClientManagement';
import { AuditLogs } from './components/admin/AuditLogs';
import { AppFeedback } from './components/common/AppFeedback';

const EntryRoute = () => {
  const { user } = useAuth();
  return user
    ? <Navigate to="/dashboard" replace />
    : <Navigate to="/login" replace />;
};

const FallbackRoute = () => {
  const { user } = useAuth();
  return <Navigate to={user ? '/dashboard' : '/login'} replace />;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <AppFeedback />
          <BrowserRouter>
            <Routes>
              {/* User View Routes (View-Only Table Viewer) */}
              <Route path="/" element={<EntryRoute />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserPortal />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<UserLoginPage />} />

              {/* Dedicated Admin Portal Routes (Editable Table Viewer) */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminPortal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute requireAdmin>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clients"
                element={
                  <ProtectedRoute requireAdmin>
                    <ClientManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/audit-logs"
                element={
                  <ProtectedRoute requireSuperAdmin>
                    <AuditLogs />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all fallback */}
              <Route path="*" element={<FallbackRoute />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
