import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { logger } from '@/utils/logger';

// Configuration optimisée pour React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Optimized cache times
      staleTime: 10 * 60 * 1000, // 10 minutes for stable data
      gcTime: 30 * 60 * 1000, // 30 minutes in memory
      // Smart retry logic
      retry: (failureCount, error: any) => {
        if (error?.status >= 400 && error?.status < 500) {
          return false; // Don't retry client errors
        }
        return failureCount < 2; // Reduce retries for faster fail
      },
      retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 5000),
      // Optimized refetch behavior
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      refetchOnMount: true,
    },
    mutations: {
      retry: false, // No retry for mutations to avoid side effects
    },
  },
});

// Prefetch des queries importantes
queryClient.prefetchQuery({
  queryKey: ['user-profile'],
  queryFn: () => {
    // Cette fonction sera définie dans le contexte d'auth
    return Promise.resolve(null);
  },
  staleTime: 15 * 60 * 1000, // 15 minutes pour le profil
});

// Performance monitoring
if (typeof window !== 'undefined') {
  // Log des requêtes lentes en développement
  if (import.meta.env.DEV) {
    queryClient.getQueryCache().subscribe((event) => {
      if (event?.query?.state?.dataUpdatedAt) {
        const duration = Date.now() - event.query.state.dataUpdatedAt;
        if (duration > 2000) {
          logger.warn(`Slow query detected: ${JSON.stringify(event.query.queryKey)} took ${duration}ms`);
        }
      }
    });
  }
}

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && (
        <ReactQueryDevtools 
          initialIsOpen={false}
        />
      )}
    </QueryClientProvider>
  );
};

// Export du client pour utilisation directe si nécessaire
export { queryClient };