import { useMemo, useRef } from 'react';

/**
 * Hook pour mémorisation optimisée avec deep comparison et cache personnalisé
 */
export function useOptimizedMemo<T>(
  factory: () => T,
  dependencies: any[],
  options?: {
    maxCacheSize?: number;
    keyExtractor?: (deps: any[]) => string;
  }
): T {
  const { maxCacheSize = 5, keyExtractor } = options || {};
  const cacheRef = useRef<Map<string, { value: T; timestamp: number }>>(new Map());
  const prevDepsRef = useRef<any[]>([]);

  const key = keyExtractor 
    ? keyExtractor(dependencies)
    : JSON.stringify(dependencies);

  return useMemo(() => {
    // Check if dependencies actually changed
    const depsChanged = dependencies.some((dep, index) => 
      !Object.is(dep, prevDepsRef.current[index])
    );

    if (!depsChanged && cacheRef.current.has(key)) {
      return cacheRef.current.get(key)!.value;
    }

    // Compute new value
    const value = factory();
    
    // Cache management
    if (cacheRef.current.size >= maxCacheSize) {
      // Remove oldest entry
      const oldestKey = Array.from(cacheRef.current.keys())[0];
      cacheRef.current.delete(oldestKey);
    }

    cacheRef.current.set(key, { value, timestamp: Date.now() });
    prevDepsRef.current = [...dependencies];

    return value;
  }, [key]);
}

/**
 * Hook pour callback optimisé avec debouncing automatique
 */
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  dependencies: any[],
  debounceMs = 0
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  return useMemo(() => {
    const debouncedCallback = (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (debounceMs > 0) {
        timeoutRef.current = setTimeout(() => {
          callback(...args);
        }, debounceMs);
      } else {
        callback(...args);
      }
    };

    return debouncedCallback as T;
  }, [...dependencies, debounceMs]);
}