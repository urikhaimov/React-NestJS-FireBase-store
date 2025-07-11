import { logger } from './logger';

enum EEnvKeys {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}

export interface IGetEnvOptions<T extends Record<string | number, any>> {
  env?: T | NodeJS.ProcessEnv;
  defaultValue?: string | number;
}

/**
 * Retrieves the value of an environment variable by key from the specified process target.
 * Logs a warning if the variable is not set, and uses the provided default value if available.
 * Throws an error if the variable is missing and no default value is specified.
 *
 * @param {string} key - The name of the environment variable to retrieve.
 * @param {IGetEnvOptions} opts - Options including the process target and an optional default value.
 * @returns The value of the environment variable, or the default value if specified.
 * @throws Error if the environment variable is not set and no default value is provided.
 */
export const getEnv = <T extends { env: Record<string, any> }>(
  key: string,
  opts?: IGetEnvOptions<T>,
): string | number => {
  try {
    const target = opts?.env;
    const value = target[key];

    if (!value) {
      const msg = `Environment variable ${key} is not set.`;
      logger.warn(msg);

      if (opts?.defaultValue) {
        logger.info(`Using default value for ${key}: ${opts.defaultValue}`);
        return opts.defaultValue;
      }

      throw new Error(msg);
    }
    return value;
  } catch (error) {
    logger.error(`Error retrieving environment variable ${key}:`, error);
    throw error;
  }
};

export const isProd = (): boolean =>
  getEnv('NODE_ENV', { env: process.env }) === EEnvKeys.PRODUCTION;
export const isDev = (): boolean =>
  getEnv('NODE_ENV', { env: process.env }) === EEnvKeys.DEVELOPMENT;
