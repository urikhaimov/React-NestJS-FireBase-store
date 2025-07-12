// src/logger.ts or src/utils/logger.ts

export const cLogger = {
  log: (...args: any[]) => console.log('[LOG]', ...args),
  info: (...args: any[]) => console.info('[INFO]', ...args),
  warn: (...args: any[]) => console.warn('[WARN]', ...args),
  error: (...args: any[]) => console.error('[ERROR]', ...args),
};
export const cLoggerError = (message: string, error: any) => {
  console.error(`[ERROR] ${message}`, error);
};