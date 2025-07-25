import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface AutoSaveOptions {
  delay?: number;
  onSave: (data: any) => Promise<void>;
  onSaveSuccess?: () => void;
  onSaveError?: (error: Error) => void;
}

export interface AutoSaveStatus {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: Date;
  error?: string;
}

export const useAutoSave = (data: any, options: AutoSaveOptions) => {
  const {
    delay = 30000, // 30 seconds default
    onSave,
    onSaveSuccess,
    onSaveError,
  } = options;

  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>({
    status: 'idle',
  });

  const lastSavedData = useRef<any>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const debouncedData = useDebounce(data, delay);

  const performSave = useCallback(async () => {
    // Don't save if data hasn't changed
    if (JSON.stringify(debouncedData) === JSON.stringify(lastSavedData.current)) {
      return;
    }

    setAutoSaveStatus({ status: 'saving' });

    try {
      await onSave(debouncedData);
      lastSavedData.current = debouncedData;
      setAutoSaveStatus({
        status: 'saved',
        lastSaved: new Date(),
      });
      onSaveSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de sauvegarde';
      setAutoSaveStatus({
        status: 'error',
        error: errorMessage,
      });
      onSaveError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [debouncedData, onSave, onSaveSuccess, onSaveError]);

  const manualSave = useCallback(async () => {
    await performSave();
  }, [performSave]);

  const resetAutoSaveStatus = useCallback(() => {
    setAutoSaveStatus({ status: 'idle' });
  }, []);

  // Auto-save when debounced data changes
  useEffect(() => {
    if (debouncedData && Object.keys(debouncedData).length > 0) {
      performSave();
    }
  }, [debouncedData, performSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    autoSaveStatus,
    manualSave,
    resetAutoSaveStatus,
  };
};

// Custom hook for debouncing values
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};