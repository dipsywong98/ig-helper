import winston, { format } from 'winston';
import 'winston-daily-rotate-file';
import config from '../common/config';

const { combine, timestamp, colorize } = format;

declare module 'logform' {
  interface TransformableInfo {
    timestamp: string
  }
}

const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '7d',
});

const logFormat = winston.format.printf((info) => `${info.level} [${info.timestamp}]: ${JSON.stringify(info.message, null, 4)}`);

const logger = winston.createLogger({
  level: 'http',
  format: combine(timestamp({
    format: 'YYYY-MM-DDTHH:mm:ssZ',
  }), logFormat),
  transports: [
    ...(config.SERVER_MODE ? [fileRotateTransport] : []),
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
  ],
});

export default logger;
