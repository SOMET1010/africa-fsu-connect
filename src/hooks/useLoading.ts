import { useCallback } from "react";
import { useGlobalLoading } from "@/contexts/LoadingContext";

/**
 * Hook centralisé pour gérer les états de chargement
 * Usage: const { startLoading, stopLoading, isLoading } = useLoading('dashboard-data');
 */
export function useLoading(key: string) {
  const { setLoading, isLoading: checkIsLoading } = useGlobalLoading();

  const startLoading = useCallback(() => {
    setLoading(key, true);
  }, [key, setLoading]);

  const stopLoading = useCallback(() => {
    setLoading(key, false);
  }, [key, setLoading]);

  const isLoading = useCallback(() => {
    return checkIsLoading(key);
  }, [key, checkIsLoading]);

  const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    try {
      startLoading();
      return await fn();
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    startLoading,
    stopLoading,
    isLoading,
    withLoading
  };
}

/**
 * Hook pour gérer plusieurs états de chargement en même temps
 */
export function useMultipleLoading(keys: string[]) {
  const { setLoading, isLoading } = useGlobalLoading();

  const startLoading = useCallback((specificKeys?: string[]) => {
    const keysToSet = specificKeys || keys;
    keysToSet.forEach(key => setLoading(key, true));
  }, [keys, setLoading]);

  const stopLoading = useCallback((specificKeys?: string[]) => {
    const keysToSet = specificKeys || keys;
    keysToSet.forEach(key => setLoading(key, false));
  }, [keys, setLoading]);

  const isAnyLoading = useCallback(() => {
    return keys.some(key => isLoading(key));
  }, [keys, isLoading]);

  const isAllLoading = useCallback(() => {
    return keys.every(key => isLoading(key));
  }, [keys, isLoading]);

  return {
    startLoading,
    stopLoading,
    isAnyLoading,
    isAllLoading,
    isLoading: (key: string) => isLoading(key)
  };
}