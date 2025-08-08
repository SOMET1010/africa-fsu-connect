import { logger } from './logger';

/**
 * Migration utility to replace console.log statements with structured logging
 * Run this script to automatically migrate console statements
 */

// Console.log replacements mapping
export const consoleMigrations = {
  // Error logging
  'console.error': (message: string, error?: any, context?: any) => {
    logger.error(message, error, context);
  },
  
  // Warning logging  
  'console.warn': (message: string, context?: any) => {
    logger.warn(message, context);
  },
  
  // Info logging
  'console.info': (message: string, context?: any) => {
    logger.info(message, context);
  },
  
  // Debug logging (only in development)
  'console.log': (message: string, context?: any) => {
    logger.debug(message, context);
  },
  
  // Debug logging
  'console.debug': (message: string, context?: any) => {
    logger.debug(message, context);
  }
};

// Development-only helper for quick migration
export const devConsole = {
  log: (message: string, data?: any) => logger.debug(message, { data }),
  error: (message: string, error?: any) => logger.error(message, error),
  warn: (message: string, data?: any) => logger.warn(message, { data }),
  info: (message: string, data?: any) => logger.info(message, { data }),
};

// Global console override to route to structured logger
const originalConsole = { ...console };

const serialize = (arg: any) => {
  if (typeof arg === 'string') return arg;
  try { return JSON.stringify(arg); } catch { return String(arg); }
};

console.log = (...args: any[]) => {
  if (import.meta.env.DEV) originalConsole.log(...args);
  const [first, second, ...rest] = args;
  if (typeof first === 'string') {
    logger.debug(first, rest.length ? { data: [second, ...rest] } : undefined);
  } else {
    logger.debug(args.map(serialize).join(' '));
  }
};

console.info = (...args: any[]) => {
  if (import.meta.env.DEV) originalConsole.info(...args);
  const [first, ...rest] = args;
  if (typeof first === 'string') {
    logger.info(first, rest.length ? { data: rest } : undefined);
  } else {
    logger.info(args.map(serialize).join(' '));
  }
};

console.warn = (...args: any[]) => {
  if (import.meta.env.DEV) originalConsole.warn(...args);
  const [first, ...rest] = args;
  if (typeof first === 'string') {
    logger.warn(first, rest.length ? { data: rest } : undefined);
  } else {
    logger.warn(args.map(serialize).join(' '));
  }
};

console.error = (...args: any[]) => {
  if (import.meta.env.DEV) originalConsole.error(...args);
  const [messageLike, errorLike, ...rest] = args;
  if (typeof messageLike === 'string') {
    logger.error(messageLike, errorLike, rest.length ? { data: rest } : undefined);
  } else {
    logger.error(args.map(serialize).join(' '));
  }
};

console.debug = (...args: any[]) => {
  if (import.meta.env.DEV) originalConsole.debug(...args);
  const [first, ...rest] = args;
  if (typeof first === 'string') {
    logger.debug(first, rest.length ? { data: rest } : undefined);
  } else {
    logger.debug(args.map(serialize).join(' '));
  }
};