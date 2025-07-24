import { useEffect, useRef } from 'react';

export interface CleanupManager {
  addTimeout: (timeout: NodeJS.Timeout) => void;
  addInterval: (interval: NodeJS.Timeout) => void;
  addEventListener: (element: Element | Window, event: string, handler: EventListener) => void;
  cleanup: () => void;
}

/**
 * Hook pour gérer automatiquement le nettoyage des timers et event listeners
 */
export const useCleanup = (): CleanupManager => {
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const intervalsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const eventListenersRef = useRef<Array<{
    element: Element | Window;
    event: string;
    handler: EventListener;
  }>>([]);

  const cleanup = () => {
    // Clear timeouts
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current.clear();

    // Clear intervals
    intervalsRef.current.forEach(interval => clearInterval(interval));
    intervalsRef.current.clear();

    // Remove event listeners
    eventListenersRef.current.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    eventListenersRef.current.length = 0;
  };

  const addTimeout = (timeout: NodeJS.Timeout) => {
    timeoutsRef.current.add(timeout);
  };

  const addInterval = (interval: NodeJS.Timeout) => {
    intervalsRef.current.add(interval);
  };

  const addEventListener = (element: Element | Window, event: string, handler: EventListener) => {
    element.addEventListener(event, handler);
    eventListenersRef.current.push({ element, event, handler });
  };

  useEffect(() => {
    return cleanup;
  }, []);

  return {
    addTimeout,
    addInterval,
    addEventListener,
    cleanup
  };
};