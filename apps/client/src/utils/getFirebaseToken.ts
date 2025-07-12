// src/utils/getFirebaseToken.ts
import { getAuth } from 'firebase/auth';

/**
 * Safely retrieves the current Firebase ID token for the authenticated user.
 * Returns null if user is not logged in.
 */
export async function getFirebaseToken(): Promise<string | null> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  try {
    const token = await user.getIdToken(/* forceRefresh */ true);
    return token;
  } catch (error) {
    console.error('[getFirebaseToken] Failed to retrieve token:', error);
    return null;
  }
}
