import { create } from 'zustand';
import { AppUser } from '../types/auth';

import { auth } from '../firebase';
import { signOut, signInWithEmailAndPassword } from 'firebase/auth';

interface AuthState {
  user: AppUser | null;
  loading: boolean;
  setUser: (user: AppUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>; // ✅ add this
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  login: async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const token = await cred.user.getIdTokenResult();
    const user: AppUser = {
      uid: cred.user.uid,
      email: cred.user.email ?? '',
      name: cred.user.displayName ?? '',
      role: (token.claims.role as 'user' | 'admin' | 'superadmin') ?? 'user',
    };
    set({ user });
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },
}));
export const useIsAdmin = () =>
  useAuthStore((state) => state.user?.role === 'admin' || state.user?.role === 'superadmin');