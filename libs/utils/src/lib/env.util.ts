import { logger } from './logger';

enum EEnvKeys {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}

export interface IGetEnvOptions<
  T extends { env: Record<string | number, any> },
> {
  target?: T;
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
  const target = opts?.target ?? process;
  const value = target.env[key];

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
};

export const isProd = (): boolean => getEnv('NODE_ENV') === EEnvKeys.PRODUCTION;
export const isDev = (): boolean => getEnv('NODE_ENV') === EEnvKeys.DEVELOPMENT;
