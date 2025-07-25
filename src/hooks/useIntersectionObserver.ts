import { useEffect, useRef, useState, useCallback } from 'react';

export const useIntersectionObserver = (options?: IntersectionObserverInit) => {
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
          ...options,
        }
      );
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [options]);

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