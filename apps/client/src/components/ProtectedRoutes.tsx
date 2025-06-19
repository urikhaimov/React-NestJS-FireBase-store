import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useRedirect } from '../context/RedirectContext';
import { CircularProgress, Box } from '@mui/material';
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const { setRedirectTo, setMessage } = useRedirect();

  if (!user) {
    setRedirectTo(location.pathname);
    setMessage('You must be logged in to continue.');
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  return children;
};
interface Props {
  children: ReactNode;
}

interface Props {
  children: ReactNode;
}

export const AdminProtectedRoute: React.FC<Props> = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
