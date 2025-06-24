import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { auth, firestore } from 'firebase-admin';
import { Request } from 'express';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = await auth().verifyIdToken(token);

      // 🔍 Get role from Firestore (users/{uid}.role)
      const userDoc = await firestore().collection('users').doc(decodedToken.uid).get();
      const role = userDoc.exists ? userDoc.data()?.role || 'user' : 'user';

      // ✅ Attach user to request
      request.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        role,
      };

      if (process.env.NODE_ENV !== 'production') {
        console.log('[FirebaseAuthGuard] Authenticated user:', request.user);
      }

      return true;
    } catch (error) {
      console.error('[FirebaseAuthGuard] Token verification failed:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
