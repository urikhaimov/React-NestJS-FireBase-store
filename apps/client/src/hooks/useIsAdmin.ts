// src/hooks/useIsAdmin.ts
import { useSafeAuth } from './getSafeAuth';

/**
 * Hook that returns whether the current user is an admin.
 * @returns {boolean} True if the user has admin role, otherwise false.
 */
export const useIsAdmin = (): boolean => {
  const { isAdmin } = useSafeAuth();
  return isAdmin;
};
