import { ELoggerTypes, logger } from './logger.util';

enum EEnvKeys {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}

export const getEnv = (key: string, defaultValue?: string | number): string | number => {
  const value = process.env[key] as string;
  if (!value) {
    const msg = `Environment variable ${key} is not set.`;
    logger[ELoggerTypes.WARN](msg);

    if (defaultValue) {
      logger[ELoggerTypes.INFO](`Using default value for ${key}: ${defaultValue}`);
      return defaultValue;
    }

    throw new Error(msg);
  }
  return value;
};

export const isProd = (): boolean => getEnv('NODE_ENV') === EEnvKeys.PRODUCTION;
export const isDev = (): boolean => getEnv('NODE_ENV') === EEnvKeys.DEVELOPMENT;
