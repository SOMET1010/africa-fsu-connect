/**
 * EMERGENCY ATTACK PLAN - PHASE 4
 * Optimisations critiques de performance pour la production
 */

import { logger } from './logger';

// ===== DEBOUNCE & THROTTLE =====
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

// ===== MEMOIZATION =====
const memoCache = new Map<string, { result: any; timestamp: number }>();

export const memoize = <T extends (...args: any[]) => any>(
  func: T,
  cacheTime: number = 5 * 60 * 1000 // 5 minutes default
): T => {
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    const cached = memoCache.get(key);
    
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      return cached.result;
    }
    
    const result = func(...args);
    memoCache.set(key, { result, timestamp: Date.now() });
    
    return result;
  }) as T;
};

// ===== BATCH OPERATIONS =====
export class BatchProcessor<T> {
  private batch: T[] = [];
  private timer: NodeJS.Timeout | null = null;
  
  constructor(
    private processor: (items: T[]) => Promise<void>,
    private batchSize: number = 50,
    private batchDelay: number = 100
  ) {}
  
  add(item: T) {
    this.batch.push(item);
    
    if (this.batch.length >= this.batchSize) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.batchDelay);
    }
  }
  
  async flush() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    
    if (this.batch.length > 0) {
      const items = [...this.batch];
      this.batch = [];
      
      try {
        await this.processor(items);
      } catch (error) {
        logger.error('Batch processing failed', error);
      }
    }
  }
}

// ===== VIRTUAL SCROLLING HELPER =====
export const calculateVirtualItems = (
  totalItems: number,
  containerHeight: number,
  itemHeight: number,
  scrollTop: number,
  overscan: number = 5
) => {
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    totalItems - 1
  );
  
  const start = Math.max(0, visibleStart - overscan);
  const end = Math.min(totalItems - 1, visibleEnd + overscan);
  
  return {
    start,
    end,
    visibleStart,
    visibleEnd,
    offsetY: start * itemHeight,
  };
};

// ===== INTERSECTION OBSERVER MANAGER =====
class IntersectionManager {
  private observers = new Map<string, IntersectionObserver>();
  private callbacks = new Map<Element, Set<() => void>>();
  
  observe(
    element: Element,
    callback: () => void,
    options: IntersectionObserverInit = {}
  ) {
    const key = JSON.stringify(options);
    
    if (!this.observers.has(key)) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const callbacks = this.callbacks.get(entry.target);
            callbacks?.forEach((cb) => cb());
          }
        });
      }, options);
      
      this.observers.set(key, observer);
    }
    
    const observer = this.observers.get(key)!;
    observer.observe(element);
    
    if (!this.callbacks.has(element)) {
      this.callbacks.set(element, new Set());
    }
    this.callbacks.get(element)!.add(callback);
  }
  
  unobserve(element: Element, callback?: () => void) {
    if (callback) {
      const callbacks = this.callbacks.get(element);
      callbacks?.delete(callback);
      
      if (callbacks?.size === 0) {
        this.callbacks.delete(element);
        this.observers.forEach((observer) => observer.unobserve(element));
      }
    } else {
      this.callbacks.delete(element);
      this.observers.forEach((observer) => observer.unobserve(element));
    }
  }
}

export const intersectionManager = new IntersectionManager();

// ===== PERFORMANCE MONITORING =====
export class PerformanceMonitor {
  private metrics = new Map<string, number[]>();
  
  measure<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const measurements = this.metrics.get(name)!;
    measurements.push(duration);
    
    // Keep only last 100 measurements
    if (measurements.length > 100) {
      measurements.shift();
    }
    
    // Log slow operations
    if (duration > 100) {
      logger.performance(`Slow operation: ${name}`, duration);
    }
    
    return result;
  }
  
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const measurements = this.metrics.get(name)!;
    measurements.push(duration);
    
    if (measurements.length > 100) {
      measurements.shift();
    }
    
    if (duration > 200) {
      logger.performance(`Slow async operation: ${name}`, duration);
    }
    
    return result;
  }
  
  getAverage(name: string): number {
    const measurements = this.metrics.get(name) || [];
    if (measurements.length === 0) return 0;
    
    return measurements.reduce((sum, val) => sum + val, 0) / measurements.length;
  }
  
  getMetrics() {
    const result: Record<string, { average: number; count: number; last: number }> = {};
    
    this.metrics.forEach((measurements, name) => {
      result[name] = {
        average: this.getAverage(name),
        count: measurements.length,
        last: measurements[measurements.length - 1] || 0,
      };
    });
    
    return result;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// ===== CLEANUP UTILITIES =====
export const createCleanupManager = () => {
  const cleanupFunctions: (() => void)[] = [];
  
  return {
    add: (cleanup: () => void) => {
      cleanupFunctions.push(cleanup);
    },
    cleanup: () => {
      cleanupFunctions.forEach((fn) => {
        try {
          fn();
        } catch (error) {
          logger.error('Cleanup function failed', error);
        }
      });
      cleanupFunctions.length = 0;
    },
  };
};

// ===== CACHE CLEANER =====
export const startCacheCleaner = () => {
  const cleanInterval = setInterval(() => {
    const now = Date.now();
    
    // Clean memoization cache
    memoCache.forEach((value, key) => {
      if (now - value.timestamp > 10 * 60 * 1000) { // 10 minutes
        memoCache.delete(key);
      }
    });
    
    logger.debug('Cache cleaned', { 
      component: 'CacheCleaner'
    });
  }, 5 * 60 * 1000); // Run every 5 minutes
  
  return () => clearInterval(cleanInterval);
};
