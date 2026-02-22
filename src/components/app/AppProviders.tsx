import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import { DemoModeProvider } from "@/contexts/DemoModeContext";
import { IntelligentLayout } from "@/components/layout/IntelligentLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { logger } from "@/utils/logger";

// Configuration optimisée du QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (remplace cacheTime)
      retry: (failureCount, error: any) => {
        // Ne pas retry les erreurs 4xx
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        logger.error('Global error boundary triggered', error, {
          component: 'AppProviders',
          componentStack: errorInfo.componentStack,
        });
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem storageKey="nexus-theme">
          <TooltipProvider>
            <Sonner />
            <BrowserRouter>
            <ErrorBoundary
              onError={(error) => {
                logger.error('Auth context error', error, {
                  component: 'AuthProvider',
                });
              }}
            >
              <AuthProvider>
                <ErrorBoundary
                  onError={(error) => {
                    logger.error('User preferences context error', error, {
                      component: 'UserPreferencesProvider',
                    });
                  }}
                >
                  <UserPreferencesProvider>
                    <DemoModeProvider>
                      <IntelligentLayout>
                        {children}
                      </IntelligentLayout>
                    </DemoModeProvider>
                  </UserPreferencesProvider>
                </ErrorBoundary>
              </AuthProvider>
            </ErrorBoundary>
          </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}