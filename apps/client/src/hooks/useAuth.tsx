import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, UserCredential } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuthStore } from '../stores/useAuthStore';
import { AppUser } from '../types/auth';

export interface SafeAuth {
  user: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
}

export function useSafeAuth(): SafeAuth {
  const { user, loading } = useAuthStore();

  const isAdmin = user?.role === 'admin';

  const login = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    return signOut(auth);
  };

  return {
    user,
    loading,
    isAdmin,
    login,
    signup,
    logout,
  };
}
