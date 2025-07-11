import { createLogger, format, transports } from 'winston';
import { ILogger } from './logger.interface';

const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `[${timestamp?.toString()}] ${level}: ${(stack || message)?.toString()}`;
});

const winstonLogger = createLogger({
  level: 'info',
  format: combine(timestamp(), errors({ stack: true }), colorize(), logFormat),
  transports: [
    new transports.Console(),
    new transports.File({ filename: './logs/api/error.log', level: 'error' }),
    new transports.File({ filename: './logs/api/combined.log' }),
  ],
});

export const logger: ILogger = {
  info: (message, ...meta) => winstonLogger.info(message, ...meta),
  warn: (message, ...meta) => winstonLogger.warn(message, ...meta),
  error: (message, ...meta) => winstonLogger.error(message, ...meta),
};
