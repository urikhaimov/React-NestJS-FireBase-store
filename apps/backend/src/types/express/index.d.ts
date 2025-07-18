// src/types/express/index.d.ts
import 'express';

declare module 'express' {
  interface Request {
    user?: {
      uid: string;
      email?: string;
      role?: string;
    };
  }
}
