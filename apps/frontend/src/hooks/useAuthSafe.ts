import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../context/AuthContext';

export const useAuthSafe = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    console.warn('⚠ useAuthSafe called outside AuthProvider, returning fallback');
    return {
      user: null,
      loading: true,
      login: async () => {},
      signup: async () => {},
      logout: async () => {},
    };
  }

  return context;
};
