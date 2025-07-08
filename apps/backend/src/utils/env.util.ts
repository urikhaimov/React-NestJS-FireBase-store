import { logger } from './logger.util';

enum EEnvKeys {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}

export const getEnv = (key: string, defaultValue?: string | number): string | number => {
  const value = process.env[key] as string;
  if (!value) {
    const err = new Error(`Environment variable ${key} is not set`);
    logger.warn(err);

    if (defaultValue) {
      logger.info(`Using default value for ${key}: ${defaultValue}`);
      return defaultValue;
    }

    throw err;
  }
  return value;
};

export const isProd = (): boolean => getEnv('NODE_ENV') === EEnvKeys.PRODUCTION;
export const isDev = (): boolean => getEnv('NODE_ENV') === EEnvKeys.DEVELOPMENT;
