import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { auth, firestore } from 'firebase-admin';
import { Request } from 'express';
import { AppError, ECommonErrors } from '@app/utils/errors.util';
import { ELoggerTypes, logger } from '@app/utils/logger.util';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const err = new AppError(ECommonErrors.MISSING_AUTHORIZATION_HEADER);
      logger[ELoggerTypes.ERROR](err.message);

      throw new UnauthorizedException(
        ECommonErrors.MISSING_AUTHORIZATION_HEADER,
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = await auth().verifyIdToken(token);

      // 🔍 Get role from Firestore (users/{uid}.role)
      const userDoc = await firestore()
        .collection('users')
        .doc(decodedToken.uid)
        .get();
      const role = userDoc.exists ? userDoc.data()?.role || 'user' : 'user';

      // ✅ Attach user to request
      request.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        role,
      };

      if (process.env.NODE_ENV !== 'production') {
        logger[ELoggerTypes.INFO](
          `[FirebaseAuthGuard] Authenticated user`,
          request.user,
        );
      }

      return true;
    } catch (error) {
      const err = new AppError(
        ECommonErrors.FIREBASE_TOKEN_VERIFICATION_FAILED,
      );
      logger[ELoggerTypes.ERROR](err.message);

      throw new UnauthorizedException(
        ECommonErrors.FIREBASE_TOKEN_VERIFICATION_FAILED,
      );
    }
  }
}
