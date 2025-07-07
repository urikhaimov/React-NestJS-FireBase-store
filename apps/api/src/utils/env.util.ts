import { logger } from './logger.util';

export const getEnv = (key: string): string => {
  const value = process.env[key] as string;
  if (!value) {
    const err = new Error(`Environment variable ${key} is not set`);
    logger.error(err);

    throw err;
  }
  return value;
};
