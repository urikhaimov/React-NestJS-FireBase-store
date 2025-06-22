import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { auth } from 'firebase-admin'; // Firebase Admin SDK
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

      // Optionally fetch custom claims or roles here
      request.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: decodedToken.role || 'user', // 👈 custom claim or fallback
      };

      console.log('[FirebaseAuthGuard] Authenticated user:', request.user);

      return true;
    } catch (error) {
      console.error('[FirebaseAuthGuard] Token verification failed:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
