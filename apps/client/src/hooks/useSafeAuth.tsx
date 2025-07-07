// src/hooks/useSafeAuth.tsx
import { useAuthStore } from '../stores/useAuthStore';
import { AppUser } from '../types/auth';

export const useSafeAuth = () => {
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? null;

  return {
    user,
    role,
    isAdmin: role === 'admin' || role === 'superadmin',
    login: useAuthStore.getState().login,
    signup: useAuthStore.getState().signup,
    logout: useAuthStore.getState().logout,
    loading: useAuthStore.getState().loading,
  };
};
