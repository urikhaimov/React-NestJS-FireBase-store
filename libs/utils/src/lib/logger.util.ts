import { createLogger, format, transports } from 'winston';
import { DATE_TIME_FORMAT } from './date.util';

export enum ELoggerTypes {
  LOG = 'log',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `[${timestamp?.toString()}] ${level}: ${(stack || message)?.toString()}`;
});

export const logger = createLogger({
  level: ELoggerTypes.INFO,
  format: combine(
    timestamp({ format: DATE_TIME_FORMAT }),
    errors({ stack: true }),
    colorize(),
    logFormat,
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: '../../logs/api/error.log', level: 'error' }),
    new transports.File({ filename: '../../logs/api/combined.log' }),
  ],
});
