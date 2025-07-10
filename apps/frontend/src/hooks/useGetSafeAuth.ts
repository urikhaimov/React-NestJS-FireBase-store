import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  UserCredential,
} from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
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
  const set = useAuthStore.setState;
  const isAdmin = user?.role === 'admin';

  const login = async (email: string, password: string): Promise<UserCredential> => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const profileSnap = await getDoc(doc(db, 'users', cred.user.uid));

    const profile = profileSnap.exists() ? profileSnap.data() : {};
    const role = profile.role ?? 'user';
    const name = profile.name ?? 'Guest';

    set({
      user: {
        uid: cred.user.uid,
        email: cred.user.email || '',
        role,
        name,
      },
    });

    return cred;
  };

  const signup = async (email: string, password: string): Promise<UserCredential> => {
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
