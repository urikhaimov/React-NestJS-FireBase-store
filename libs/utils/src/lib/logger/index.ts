import type { ILogger } from './logger.interface';

let logger: ILogger;

if (typeof window === 'undefined') {
  // Node.js/server environment
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  logger = require('./logger.server').logger;
}

export { logger };
