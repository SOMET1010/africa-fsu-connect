import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
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
import Presentation from "@/pages/Presentation";
import NotFound from "@/pages/NotFound";

// Lazy loaded presentation analytics
const PresentationAnalytics = lazy(() => 
  import('@/components/presentation/PresentationAnalytics').then(m => ({ default: m.PresentationAnalytics }))
);

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
        element={<Index />} 
      />
      <Route 
        path="/auth" 
        element={
          <AppShell hideFooter>
            <Auth />
          </AppShell>
        } 
      />
      
      {/* Presentation route - public, without AppShell for fullscreen */}
      <Route 
        path="/presentation" 
        element={<Presentation />} 
      />
      
      {/* Presentation analytics - admin only */}
      <Route 
        path="/presentation/analytics" 
        element={
          <ProtectedRoute requiredRoles={['super_admin', 'country_admin']}>
            <AppShell>
              <Suspense fallback={<PageLoadingFallback />}>
                <PresentationAnalytics />
              </Suspense>
            </AppShell>
          </ProtectedRoute>
        } 
      />
      
      {/* Routes publiques (non protégées) */}
      {ROUTES
        .filter(route => route.isProtected === false && route.path !== '/presentation')
        .map(({ path, component: Component, title }) => (
          <Route 
            key={path}
            path={path} 
            element={
              <AppShell>
                <Suspense fallback={<PageLoadingFallback />}>
                  <Component />
                </Suspense>
              </AppShell>
            } 
          />
        ))}
      
      {/* Routes protégées normales */}
      {getProtectedRoutes()
        .filter(route => !route.requiredRoles?.length && route.path !== '/presentation')
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
      {getAdminRoutes()
        .filter(route => route.path !== '/presentation/analytics')
        .map(({ path, component: Component, requiredRoles, title }) => (
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
