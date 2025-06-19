import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { auth as adminAuth } from 'firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
      const decodedToken = await adminAuth().verifyIdToken(idToken);
      req.user = decodedToken; // 🔐 Makes `req.user.uid` available in controller
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }
}
