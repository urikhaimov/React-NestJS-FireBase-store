import { create } from 'zustand';
import { AppUser } from '../types/auth';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export interface AuthState {
  user: AppUser | null;
  loading: boolean;
  setUser: (user: AppUser | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const allowedRoles = ['user', 'admin', 'superadmin'] as const;
type Role = typeof allowedRoles[number];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  login: async (email, password) => {
    set({ loading: true });

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Fetch user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userProfile = userDoc.exists() ? userDoc.data() : {};

      const roleClaim = (userProfile as any).role as string;
      const role: Role = allowedRoles.includes(roleClaim as Role) ? (roleClaim as Role) : 'user';

      const user: AppUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || '',
        role,
      };

      set({ user });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },
}));

// Optional derived hook
export const useIsAdmin = () => {
  return useAuthStore((state) => state.user?.role === 'admin' || state.user?.role === 'superadmin');
};
