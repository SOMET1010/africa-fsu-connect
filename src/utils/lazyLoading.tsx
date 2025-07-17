import { lazy, Suspense, ComponentType } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Wrapper pour lazy loading avec fallback skeleton
 */
export function withLazyLoading<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = lazy(importFn);
  
  return function WrappedComponent(props: React.ComponentProps<T>) {
    const FallbackComponent = fallback || (() => (
      <div className="p-6">
        <div className="animate-pulse bg-muted rounded h-4 mb-2" />
        <div className="animate-pulse bg-muted rounded h-4 mb-2" />
        <div className="animate-pulse bg-muted rounded h-4 w-3/4" />
      </div>
    ));

    return (
      <Suspense fallback={<FallbackComponent />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/**
 * Hook pour preloader des composants
 */
export function usePreloader() {
  const preloadComponent = (importFn: () => Promise<any>) => {
    // Preload immédiatement
    importFn().catch(() => {
      // Ignore les erreurs de preload
    });
  };

  const preloadOnHover = (importFn: () => Promise<any>) => {
    return {
      onMouseEnter: () => preloadComponent(importFn),
      onFocus: () => preloadComponent(importFn),
    };
  };

  return {
    preloadComponent,
    preloadOnHover,
  };
}