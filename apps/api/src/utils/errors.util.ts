export enum ECommonErrors {
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  BAD_REQUEST = 'BAD_REQUEST',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  CONFLICT = 'CONFLICT',
  STRIPE_SIGNATURE_MISSING = 'STRIPE_SIGNATURE_MISSING',
  STRIPE_SIGNATURE_VERIFICATION_FAILED = 'STRIPE_SIGNATURE_VERIFICATION_FAILED',
}

export class AppError extends Error {
  constructor(
    public code: ECommonErrors,
    message?: string,
  ) {
    super(message ?? code);
    Object.setPrototypeOf(this, new.target.prototype); // required for proper subclassing
  }
}
