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

// Production-safe replacements
if (import.meta.env.DEV) {
  // In development, allow console but also log to structured logger
  const originalConsole = { ...console };
  
  console.log = (...args) => {
    originalConsole.log(...args);
    logger.debug(args.join(' '));
  };
  
  console.error = (...args) => {
    originalConsole.error(...args);
    logger.error(args.join(' '));
  };
  
  console.warn = (...args) => {
    originalConsole.warn(...args);
    logger.warn(args.join(' '));
  };
}