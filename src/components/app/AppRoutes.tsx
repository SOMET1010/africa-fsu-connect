import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { ROUTES, getProtectedRoutes, getAdminRoutes } from "@/config/routes";
import AppShell from "@/components/layout/AppShell";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { PageLoadingFallback } from "@/components/app/PageLoadingFallback";
import { useCriticalPreloader } from "@/hooks/usePreloader";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

// Eager loaded components (critical pour le rendu initial)
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";

export function AppRoutes() {
  useCriticalPreloader();
  const location = useLocation();
  
  // Gestion SEO automatique
  usePageMetadata(location.pathname);

  return (
    <Routes>
      {/* Routes publiques */}
      <Route 
        path="/" 
        element={
          <AppShell>
            <Index />
          </AppShell>
        } 
      />
      <Route 
        path="/auth" 
        element={
          <AppShell hideFooter>
            <Auth />
          </AppShell>
        } 
      />
      
      {/* Routes protégées normales */}
      {getProtectedRoutes()
        .filter(route => !route.requiredRoles?.length)
        .map(({ path, component: Component, title }) => (
          <Route 
            key={path}
            path={path} 
            element={
              <ProtectedRoute>
                <AppShell>
                  <Suspense fallback={<PageLoadingFallback />}>
                    <Component />
                  </Suspense>
                </AppShell>
              </ProtectedRoute>
            } 
          />
        ))}
      
      {/* Routes admin (chunk séparé) */}
      {getAdminRoutes().map(({ path, component: Component, requiredRoles, title }) => (
        <Route 
          key={path}
          path={path} 
          element={
            <ProtectedRoute requiredRoles={requiredRoles}>
              <AppShell>
                <Suspense fallback={<PageLoadingFallback />}>
                  <Component />
                </Suspense>
              </AppShell>
            </ProtectedRoute>
          } 
        />
      ))}
      
      {/* Route catch-all */}
      <Route 
        path="*" 
        element={
          <AppShell>
            <NotFound />
          </AppShell>
        } 
      />
    </Routes>
  );
}