/**
 * PHASE 8 - PRODUCTION MONITORING
 * Health checks, error tracking, and performance monitoring
 */
import { logger } from './logger';
import { performanceMonitor } from './performanceOptimizer';
import Environment from './environment';

// === WEB VITALS MONITORING ===
export const monitorWebVitals = () => {
  if (!Environment.isProduction) return;

  // Monitor Core Web Vitals
  try {
    // @ts-ignore - web-vitals types
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS((metric: any) => {
        logger.monitoring('web-vital-cls', metric.value, { data: 'cls' });
      });
      
      onFID((metric: any) => {
        logger.monitoring('web-vital-fid', metric.value, { data: 'fid' });
      });
      
      onFCP((metric: any) => {
        logger.monitoring('web-vital-fcp', metric.value, { data: 'fcp' });
      });
      
      onLCP((metric: any) => {
        logger.monitoring('web-vital-lcp', metric.value, { data: 'lcp' });
      });
      
      onTTFB((metric: any) => {
        logger.monitoring('web-vital-ttfb', metric.value, { data: 'ttfb' });
      });
    }).catch(() => {
      // Web vitals not available
    });
  } catch {
    // Web vitals package not available
  }
};

// === HEALTH CHECKS ===
export const runHealthChecks = async (): Promise<{
  status: 'healthy' | 'unhealthy';
  checks: Array<{ name: string; status: 'pass' | 'fail'; message: string }>;
}> => {
  const checks = [];
  
  // Database connectivity
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    await supabase.from('profiles').select('count').limit(1);
    checks.push({ name: 'database', status: 'pass' as const, message: 'Database accessible' });
  } catch (error) {
    checks.push({ name: 'database', status: 'fail' as const, message: 'Database connection failed' });
  }
  
  // Authentication service
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    await supabase.auth.getSession();
    checks.push({ name: 'auth', status: 'pass' as const, message: 'Auth service available' });
  } catch (error) {
    checks.push({ name: 'auth', status: 'fail' as const, message: 'Auth service unavailable' });
  }
  
  // Local storage
  try {
    localStorage.setItem('health-check', 'test');
    localStorage.removeItem('health-check');
    checks.push({ name: 'storage', status: 'pass' as const, message: 'Local storage working' });
  } catch (error) {
    checks.push({ name: 'storage', status: 'fail' as const, message: 'Local storage failed' });
  }
  
  const failedChecks = checks.filter(c => c.status === 'fail');
  
  return {
    status: failedChecks.length > 0 ? 'unhealthy' : 'healthy',
    checks
  };
};

// === ERROR BOUNDARIES ===
export const reportCriticalError = (error: Error, errorInfo: any) => {
  logger.error('Critical application error', error, {
    component: 'ErrorBoundary',
    componentStack: errorInfo.componentStack,
    errorBoundary: true
  });
  
  if (Environment.isProduction) {
    // Send to monitoring service
    sendToMonitoringService('critical-error', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }
};

// === PERFORMANCE ALERTS ===
export const checkPerformanceThresholds = () => {
  const metrics = performanceMonitor.getMetrics();
  
  Object.entries(metrics).forEach(([operation, data]) => {
    // Alert on slow operations
    if (data.average > 1000) {
      logger.monitoring('slow-operation-alert', data.average, {
        data: { operation, threshold: 1000, count: data.count }
      });
    }
  });
};

// === MONITORING SERVICE ===
const sendToMonitoringService = (event: string, data: any) => {
  try {
    // Store in localStorage for now, replace with actual service
    const monitoringData = {
      event,
      data,
      timestamp: Date.now(),
      environment: Environment.mode
    };
    
    const existing = JSON.parse(localStorage.getItem('production-monitoring') || '[]');
    existing.push(monitoringData);
    
    // Keep last 1000 events
    const latest = existing.slice(-1000);
    localStorage.setItem('production-monitoring', JSON.stringify(latest));
    
    // In production, replace this with actual monitoring service call
    // e.g., Sentry, DataDog, LogRocket, etc.
    
  } catch (error) {
    logger.error('Failed to send monitoring data', error);
  }
};

// === STARTUP MONITORING ===
export const initializeProductionMonitoring = () => {
  if (!Environment.isProduction) return;
  
  // Start monitoring
  monitorWebVitals();
  
  // Periodic health checks
  setInterval(async () => {
    const health = await runHealthChecks();
    logger.monitoring('health-check', health.status === 'healthy' ? 1 : 0, {
      data: {
        checks: health.checks.length,
        failed: health.checks.filter(c => c.status === 'fail').length
      }
    });
  }, 5 * 60 * 1000); // Every 5 minutes
  
  // Performance threshold checks
  setInterval(checkPerformanceThresholds, 2 * 60 * 1000); // Every 2 minutes
  
  logger.info('Production monitoring initialized');
};
