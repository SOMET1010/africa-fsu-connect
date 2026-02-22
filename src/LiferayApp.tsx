import { createContext, useContext, useEffect, useState, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { IntelligentLayout } from "./components/layout/IntelligentLayout";
import AppShell from "./components/layout/AppShell";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { LiferayAuthProvider } from "./contexts/LiferayAuthContext";
import { LiferayWrapper } from "./components/layout/LiferayWrapper";
import { ROUTES } from "./config/routes";
import { Loader2 } from "lucide-react";

// Liferay Context
interface LiferayContextType {
  namespace: string;
  currentUrl: string;
  userId: string;
}

const LiferayContext = createContext<LiferayContextType | null>(null);

export const useLiferay = () => {
  const context = useContext(LiferayContext);
  if (!context) {
    throw new Error('useLiferay must be used within a LiferayProvider');
  }
  return context;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

interface LiferayAppProps {
  namespace: string;
  currentUrl: string;
  userId: string;
}

const SuspenseFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const LiferayApp = ({ namespace, currentUrl, userId }: LiferayAppProps) => {
  const [isLiferayReady, setIsLiferayReady] = useState(false);

  useEffect(() => {
    if (window.Liferay && window.Liferay.ready) {
      window.Liferay.ready(() => {
        setIsLiferayReady(true);
      });
    } else {
      setIsLiferayReady(true);
    }
  }, []);

  if (!isLiferayReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <LiferayContext.Provider value={{ namespace, currentUrl, userId }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LiferayWrapper>
            <div className={`liferay-portlet-${namespace}`}>
              <Toaster />
              <Sonner />
              <HashRouter basename={`/web/guest/-/${namespace}`}>
                <LiferayAuthProvider>
                  <IntelligentLayout>
                    <Suspense fallback={<SuspenseFallback />}>
                      <Routes>
                        {/* Routes publiques */}
                        <Route path="/" element={<AppShell><Index /></AppShell>} />
                        <Route path="/auth" element={<AppShell hideFooter><Auth /></AppShell>} />

                        {/* Rétrocompatibilité /docs → /resources */}
                        <Route path="/docs" element={<Navigate to="/resources" replace />} />

                        {/* Routes dynamiques depuis ROUTES config */}
                        {ROUTES.map((route) => {
                          const Component = route.component;
                          const element = (
                            <AppShell>
                              <Component />
                            </AppShell>
                          );

                          if (route.isProtected) {
                            return (
                              <Route
                                key={route.path}
                                path={route.path}
                                element={
                                  <ProtectedRoute requiredRoles={route.requiredRoles}>
                                    {element}
                                  </ProtectedRoute>
                                }
                              />
                            );
                          }

                          return (
                            <Route
                              key={route.path}
                              path={route.path}
                              element={element}
                            />
                          );
                        })}

                        {/* Route par défaut */}
                        <Route path="*" element={<AppShell><NotFound /></AppShell>} />
                      </Routes>
                    </Suspense>
                  </IntelligentLayout>
                </LiferayAuthProvider>
              </HashRouter>
            </div>
          </LiferayWrapper>
        </TooltipProvider>
      </QueryClientProvider>
    </LiferayContext.Provider>
  );
};

export default LiferayApp;
