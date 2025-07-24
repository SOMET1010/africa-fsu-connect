import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Configuration optimisée pour React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache pendant 5 minutes par défaut
      staleTime: 5 * 60 * 1000,
      // Garde en cache pendant 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry intelligent
      retry: (failureCount, error: any) => {
        // Ne pas retry pour les erreurs 404, 401, 403
        if (error?.status === 404 || error?.status === 401 || error?.status === 403) {
          return false;
        }
        // Retry jusqu'à 3 fois pour les autres erreurs
        return failureCount < 3;
      },
      // Retry delay exponentiel avec jitter
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch automatique
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      // Retry pour les mutations importantes
      retry: 1,
      retryDelay: 1000,
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
          console.warn(`Slow query detected: ${JSON.stringify(event.query.queryKey)} took ${duration}ms`);
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