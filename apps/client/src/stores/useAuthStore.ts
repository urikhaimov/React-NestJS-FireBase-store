import { create } from 'zustand';
import { AppUser } from '../types/auth';
import { auth, db } from '../firebase';
import {
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AuthState {
  user: AppUser | null;
  loading: boolean;
  authInitialized: boolean;

  setUser: (user: AppUser | null) => void;
  setLoading: (loading: boolean) => void;
  setAuthInitialized: (val: boolean) => void;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => () => void;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  authInitialized: false,

  setUser: (user) => {
    if (user) {
      localStorage.setItem('appUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('appUser');
    }
    set({ user });
  },

  setLoading: (loading) => set({ loading }),
  setAuthInitialized: (val) => set({ authInitialized: val }),

  login: async (email, password) => {
    set({ loading: true });

    const cred = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
    const role =
      userDoc.exists() && userDoc.data().role
        ? (userDoc.data().role as 'user' | 'admin' | 'superadmin')
        : 'user';

    const user: AppUser = {
      uid: cred.user.uid,
      email: cred.user.email ?? '',
      name: cred.user.displayName ?? '',
      role,
    };

    set({ user, loading: false, authInitialized: true });
    localStorage.setItem('appUser', JSON.stringify(user));
  },

  logout: async () => {
    await signOut(auth);
    localStorage.removeItem('appUser');
    set({ user: null });
  },

  initializeAuth: () => {
    const cached = localStorage.getItem('appUser');
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as AppUser;
        set({ user: parsed });
      } catch {
        localStorage.removeItem('appUser');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const role =
          userDoc.exists() && userDoc.data().role
            ? (userDoc.data().role as 'user' | 'admin' | 'superadmin')
            : 'user';

        const user: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email ?? '',
          name: firebaseUser.displayName ?? '',
          role,
        };

        set({ user });
        localStorage.setItem('appUser', JSON.stringify(user));
      } else {
        set({ user: null });
        localStorage.removeItem('appUser');
      }

      set({ loading: false, authInitialized: true });
    });

    return unsubscribe;
  },

  refreshUser: async () => {
    const { user } = get();
    if (!user) return;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const role =
      userDoc.exists() && userDoc.data().role
        ? (userDoc.data().role as 'user' | 'admin' | 'superadmin')
        : 'user';

    const refreshedUser: AppUser = {
      ...user,
      role,
    };

    set({ user: refreshedUser });
    localStorage.setItem('appUser', JSON.stringify(refreshedUser));
  },
}));

export const useIsAdmin = () =>
  useAuthStore((state) => state.user?.role === 'admin' || state.user?.role === 'superadmin');
