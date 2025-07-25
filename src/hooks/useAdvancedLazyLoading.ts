import { useEffect, useRef, useState, useCallback } from 'react';
import { logger } from '@/utils/logger';

interface LazyLoadConfig {
  threshold: number;
  rootMargin: string;
  preloadDistance: number;
  maxConcurrentLoads: number;
}

interface LazyLoadItem {
  id: string;
  priority: number;
  loader: () => Promise<any>;
  onLoad?: (result: any) => void;
  onError?: (error: Error) => void;
}

const DEFAULT_CONFIG: LazyLoadConfig = {
  threshold: 0.1,
  rootMargin: '50px',
  preloadDistance: 200,
  maxConcurrentLoads: 3,
};

export const useAdvancedLazyLoading = (config: Partial<LazyLoadConfig> = {}) => {
  const fullConfig = { ...DEFAULT_CONFIG, ...config };
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const [loadedItems, setLoadedItems] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Map<string, Error>>(new Map());
  const queueRef = useRef<LazyLoadItem[]>([]);
  const activeLoadsRef = useRef<Set<string>>(new Set());

  const processQueue = useCallback(async () => {
    if (activeLoadsRef.current.size >= fullConfig.maxConcurrentLoads) {
      return;
    }

    // Sort queue by priority (higher priority first)
    queueRef.current.sort((a, b) => b.priority - a.priority);

    const availableSlots = fullConfig.maxConcurrentLoads - activeLoadsRef.current.size;
    const itemsToProcess = queueRef.current.splice(0, availableSlots);

    for (const item of itemsToProcess) {
      if (loadedItems.has(item.id) || activeLoadsRef.current.has(item.id)) {
        continue;
      }

      activeLoadsRef.current.add(item.id);
      setLoadingItems(prev => new Set(prev).add(item.id));

      try {
        logger.debug(`Starting lazy load: ${item.id}`, { 
          metadata: { priority: item.priority }
        });
        const result = await item.loader();
        
        setLoadedItems(prev => new Set(prev).add(item.id));
        setErrors(prev => {
          const newErrors = new Map(prev);
          newErrors.delete(item.id);
          return newErrors;
        });
        
        if (item.onLoad) {
          item.onLoad(result);
        }
        
        logger.debug(`Completed lazy load: ${item.id}`);
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setErrors(prev => new Map(prev).set(item.id, err));
        
        if (item.onError) {
          item.onError(err);
        }
        
        logger.error(`Failed lazy load: ${item.id}`, err);
      } finally {
        activeLoadsRef.current.delete(item.id);
        setLoadingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(item.id);
          return newSet;
        });
      }
    }

    // Process remaining queue if there are more items
    if (queueRef.current.length > 0) {
      setTimeout(processQueue, 100);
    }
  }, [fullConfig.maxConcurrentLoads, loadedItems]);

  const addToQueue = useCallback((item: LazyLoadItem) => {
    if (loadedItems.has(item.id) || queueRef.current.some(q => q.id === item.id)) {
      return;
    }

    queueRef.current.push(item);
    processQueue();
  }, [processQueue, loadedItems]);

  const lazyLoad = useCallback((
    id: string,
    loader: () => Promise<any>,
    priority: number = 1,
    onLoad?: (result: any) => void,
    onError?: (error: Error) => void
  ) => {
    addToQueue({ id, priority, loader, onLoad, onError });
  }, [addToQueue]);

  const preloadComponent = useCallback((
    componentPath: string,
    priority: number = 1
  ) => {
    const id = `component-${componentPath}`;
    lazyLoad(
      id,
      () => import(componentPath),
      priority,
      (module) => {
        logger.debug(`Component preloaded: ${componentPath}`, { 
          metadata: { hasModule: !!module }
        });
      },
      (error) => {
        logger.error(`Component preload failed: ${componentPath}`, error);
      }
    );
  }, [lazyLoad]);

  const preloadImage = useCallback((
    url: string,
    priority: number = 1
  ) => {
    const id = `image-${url}`;
    lazyLoad(
      id,
      () => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      }),
      priority,
      () => {
        logger.debug(`Image preloaded: ${url}`);
      },
      (error) => {
        logger.error(`Image preload failed: ${url}`, error);
      }
    );
  }, [lazyLoad]);

  const preloadData = useCallback((
    key: string,
    fetcher: () => Promise<any>,
    priority: number = 1
  ) => {
    const id = `data-${key}`;
    lazyLoad(
      id,
      fetcher,
      priority,
      (data) => {
        logger.debug(`Data preloaded: ${key}`, { 
          metadata: { dataSize: JSON.stringify(data).length }
        });
      },
      (error) => {
        logger.error(`Data preload failed: ${key}`, error);
      }
    );
  }, [lazyLoad]);

  const clearQueue = useCallback(() => {
    queueRef.current = [];
    logger.info('Lazy loading queue cleared');
  }, []);

  const getStats = useCallback(() => {
    return {
      queueLength: queueRef.current.length,
      activeLoads: activeLoadsRef.current.size,
      loadedCount: loadedItems.size,
      errorCount: errors.size,
      loadingCount: loadingItems.size,
    };
  }, [loadedItems.size, errors.size, loadingItems.size]);

  return {
    lazyLoad,
    preloadComponent,
    preloadImage,
    preloadData,
    clearQueue,
    getStats,
    isLoading: (id: string) => loadingItems.has(id),
    isLoaded: (id: string) => loadedItems.has(id),
    getError: (id: string) => errors.get(id),
    loadingItems,
    loadedItems,
    errors,
  };
};

// Hook for intersection observer based lazy loading
export const useIntersectionObserverLazy = () => {
  const [entries, setEntries] = useState<Map<Element, IntersectionObserverEntry>>(new Map());
  const observerRef = useRef<IntersectionObserver>();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        (observerEntries) => {
          setEntries(prev => {
            const newEntries = new Map(prev);
            observerEntries.forEach(entry => {
              newEntries.set(entry.target, entry);
            });
            return newEntries;
          });
        },
        {
          threshold: 0.1,
          rootMargin: '50px',
        }
      );
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const observe = useCallback((element: Element) => {
    if (observerRef.current && element) {
      observerRef.current.observe(element);
    }
  }, []);

  const unobserve = useCallback((element: Element) => {
    if (observerRef.current && element) {
      observerRef.current.unobserve(element);
      setEntries(prev => {
        const newEntries = new Map(prev);
        newEntries.delete(element);
        return newEntries;
      });
    }
  }, []);

  const isIntersecting = useCallback((element: Element) => {
    const entry = entries.get(element);
    return entry?.isIntersecting ?? false;
  }, [entries]);

  return {
    observe,
    unobserve,
    isIntersecting,
    entries,
  };
};