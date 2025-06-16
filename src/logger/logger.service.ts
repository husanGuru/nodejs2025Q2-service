import path from 'path';
import fs from 'fs';
import { LoggerService, Injectable } from '@nestjs/common';
import { createStream } from 'rotating-file-stream';

type LogLevel = 'debug' | 'verbose' | 'log' | 'warn' | 'error';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  verbose: 1,
  log: 2,
  warn: 3,
  error: 4,
};

@Injectable()
export class MyLogger implements LoggerService {
  private readonly level: LogLevel;
  private readonly fileStream;

  constructor() {
    const envLevel = (process.env.LOG_LEVEL || 'log').toLowerCase();
    this.level = (
      Object.keys(LEVEL_PRIORITY).includes(envLevel) ? envLevel : 'log'
    ) as LogLevel;

    const logDir = process.env.LOG_DIR || 'logs';
    const maxSizeKB = parseInt(process.env.LOG_FILE_SIZE_KB || '1024', 10);

    // Ensure log directory exists
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Setup rotating file stream
    this.fileStream = createStream('app.log', {
      size: `${maxSizeKB}K`,
      interval: '1d', // Optional daily rotation
      path: path.resolve(logDir),
      compress: 'gzip',
    });
  }

  private shouldLog(level: LogLevel): boolean {
    return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[this.level];
  }

  private format(level: string, context: string, message: string): string {
    return `[${new Date().toISOString()}] [${level}] [${context}] ${message}`;
  }

  private logToConsole(level: LogLevel, context: string, message: string) {
    const formatted = this.format(level.toUpperCase(), context, message);
    console.log(formatted);
  }

  private logToFile(level: LogLevel, context: string, message: string) {
    const formatted = this.format(level.toUpperCase(), context, message);
    this.fileStream.write(formatted + '\n');
  }

  private logAll(
    level: LogLevel,
    message: string,
    context = 'App',
    trace?: string,
  ) {
    if (!this.shouldLog(level)) return;

    this.logToConsole(level, context, message);
    this.logToFile(level, context, message);
    if (trace) {
      this.logToConsole(level, context, trace);
      this.logToFile(level, context, trace);
    }
  }

  log(message: string, context?: string) {
    if (!this.shouldLog('log')) return;

    this.logAll('log', message, context);
  }

  error(message: string, trace?: string, context?: string) {
    if (!this.shouldLog('error')) return;

    this.logAll('error', message, context, trace);
  }

  warn(message: string, context?: string) {
    if (!this.shouldLog('warn')) return;

    this.logAll('warn', message, context);
  }

  debug(message: string, context?: string) {
    if (!this.shouldLog('debug')) return;

    this.logAll('debug', message, context);
  }

  verbose(message: string, context?: string) {
    this.logAll('verbose', message, context);
  }
}
