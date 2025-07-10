// src/stores/useAuthStore.ts
import { create } from 'zustand';
import {
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { AppUser } from '../types/auth';
import { UserCredential } from 'firebase/auth';

export type AuthState = {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  setUser: (user: AppUser | null) => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
  refreshUser: () => Promise<void>;
  authInitialized?: boolean;
};

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
          photoURL: firebaseUser.photoURL ?? '',
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
      photoURL: cred.user.photoURL ?? '',
      role,
    };

    set({ user, loading: false, authInitialized: true });
    localStorage.setItem('appUser', JSON.stringify(user));
    return cred;
  },

  signup: async (email, password) => {
    set({ loading: true });

    const cred = await createUserWithEmailAndPassword(auth, email, password);

    const user: AppUser = {
      uid: cred.user.uid,
      email: cred.user.email ?? '',
      name: cred.user.displayName ?? '',
      photoURL: cred.user.photoURL ?? '',
      role: 'user',
    };

    set({ user, loading: false, authInitialized: true });
    localStorage.setItem('appUser', JSON.stringify(user));
    return cred;
  },

  logout: async () => {
    await signOut(auth);
    localStorage.removeItem('appUser');
    set({ user: null });
  },

  refreshUser: async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return;

    await firebaseUser.reload();
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const role =
      userDoc.exists() && userDoc.data().role
        ? (userDoc.data().role as 'user' | 'admin' | 'superadmin')
        : 'user';

    const refreshedUser: AppUser = {
      uid: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      name: firebaseUser.displayName ?? '',
      photoURL: firebaseUser.photoURL ?? '',
      role,
    };

    set({ user: refreshedUser });
    localStorage.setItem('appUser', JSON.stringify(refreshedUser));
  },
}));

export const useIsAdmin = () =>
  useAuthStore((state) => state.user?.role === 'admin' || state.user?.role === 'superadmin');
