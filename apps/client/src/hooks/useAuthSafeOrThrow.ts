import { useContext } from 'react';
import { useAuthStore } from '../stores/useAuthStore';

export const useAuthSafeOrThrow = () => {
  const context = useAuthStore();

  if (!context) {
    throw new Error('❌ useAuthSafeOrThrow was called outside of an <AuthProvider>. Make sure your component tree is wrapped properly.');
  }

  return context;
};
