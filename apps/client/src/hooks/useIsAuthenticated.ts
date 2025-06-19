import { useAuthSafe } from './useAuthSafe';

export const useIsAuthenticated = (): boolean => {
  const { user, loading } = useAuthSafe();
  return !loading && !!user;
};