/**
 * Centralized logging utility to replace console.log statements
 * Provides structured logging with different levels and contexts
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  count?: number;
  componentStack?: string;
  errorBoundary?: boolean;
  data?: any;
  agency?: string;
  country?: string;
  coordinates?: any;
  error?: any;
  updates?: string[];
  changes?: string[];
  metadata?: Record<string, unknown>;
  interval?: string;
  critical?: boolean;
  url?: string;
  deletedCaches?: number;
  connectorId?: string;
  shortcut?: string;
  messageType?: string;
  code?: number;
  reason?: string;
  namespace?: string;
  query?: string;
  filters?: Record<string, any>;
  role?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${Object.entries(context).map(([k, v]) => `${k}:${v}`).join(', ')}]` : '';
    return `[${timestamp}] ${level.toUpperCase()}${contextStr}: ${message}`;
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.info(this.formatMessage(LogLevel.INFO, message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, context));
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const fullContext = { ...context, error: error instanceof Error ? error.message : String(error) };
    console.error(this.formatMessage(LogLevel.ERROR, message, fullContext));
    
    // In production, you could send to error tracking service here
    if (!this.isDevelopment && error) {
      // TODO: Send to monitoring service (Sentry, LogRocket, etc.)
    }
  }

  // Security-specific logging
  security(action: string, context?: LogContext): void {
    const securityContext = { ...context, category: 'security' };
    this.info(`Security action: ${action}`, securityContext);
  }

  // Performance logging
  performance(operation: string, duration: number, context?: LogContext): void {
    const perfContext = { ...context, duration: `${duration}ms`, category: 'performance' };
    this.info(`Performance: ${operation}`, perfContext);
  }

  // Production monitoring
  monitoring(metric: string, value: number, context?: LogContext): void {
    const monitoringContext = { ...context, metric, value, category: 'monitoring' };
    if (!this.isDevelopment) {
      // En production, envoyer vers service de monitoring
      this.sendToMonitoringService(metric, value, monitoringContext);
    }
    this.info(`Monitoring: ${metric}=${value}`, monitoringContext);
  }

  private sendToMonitoringService(metric: string, value: number, context?: LogContext): void {
    // Implémentation future pour service de monitoring (Sentry, DataDog, etc.)
    try {
      // Pour l'instant, stocker en localStorage pour développement
      const monitoringData = {
        timestamp: Date.now(),
        metric,
        value,
        context,
        environment: this.isDevelopment ? 'development' : 'production'
      };
      
      const existing = JSON.parse(localStorage.getItem('production-monitoring') || '[]');
      existing.push(monitoringData);
      
      // Garder seulement les 100 dernières entrées
      const latest = existing.slice(-100);
      localStorage.setItem('production-monitoring', JSON.stringify(latest));
    } catch (error) {
      console.warn('Failed to send monitoring data:', error);
    }
  }
}

export const logger = new Logger();

// Development-only helper for migration
export const devLog = (message: string, data?: unknown): void => {
  if (import.meta.env.DEV) {
    console.log(`[DEV] ${message}`, data);
  }
};