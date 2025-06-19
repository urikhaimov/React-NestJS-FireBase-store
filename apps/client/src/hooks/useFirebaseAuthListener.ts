// src/hooks/useFirebaseAuthListener.ts
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthStore } from '../stores/useAuthStore';
import { AppUser } from '../types/auth';

const allowedRoles = ['user', 'admin', 'superadmin'] as const;
type Role = typeof allowedRoles[number];

export function useFirebaseAuthListener() {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
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

        setUser(user);
      } catch (error) {
        console.error('Error restoring auth session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);
}
