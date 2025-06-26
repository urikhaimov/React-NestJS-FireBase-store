import { auth } from '../firebase';
import { getIdTokenResult } from 'firebase/auth';
import { useAuthStore } from '../stores/useAuthStore';
import { Role } from '../types/Role';

export async function syncUserFromAuth(): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  await currentUser.reload();
  const token = await getIdTokenResult(currentUser);
  const role: Role = token.claims.role === 'admin' ? 'admin' : 'user';

  useAuthStore.getState().setUser({
    uid: currentUser.uid,
    name: currentUser.displayName || '',
    email: currentUser.email || '',
    photoURL: currentUser.photoURL || '',
    role,
  });
}
