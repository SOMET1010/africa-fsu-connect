/**
 * PHASE 7 - CODE SPLITTING OPTIMIZATION
 * Lazy loading for all major pages and components
 */
import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// === LAZY LOADED PAGES ===
export const LazyDashboard = lazy(() => import('@/pages/Dashboard'));
export const LazyOrganizations = lazy(() => import('@/pages/Organizations'));
export const LazyProjects = lazy(() => import('@/pages/Projects'));
export const LazyResources = lazy(() => import('@/pages/Resources'));
export const LazyEvents = lazy(() => import('@/pages/Events'));
export const LazyForum = lazy(() => import('@/pages/Forum'));
export const LazyAnalytics = lazy(() => import('@/pages/Analytics'));
export const LazySecurity = lazy(() => import('@/pages/Security'));
export const LazyAdmin = lazy(() => import('@/pages/Admin'));
export const LazyIndicators = lazy(() => import('@/pages/Indicators'));
export const LazySubmit = lazy(() => import('@/pages/Submit'));

// === LAZY LOADED COMPONENTS ===
export const LazyOrganizationsMap = lazy(() => 
  import('@/components/organizations/OrganizationsMap').then(module => ({ default: module.OrganizationsMap }))
);
export const LazyProjectsMap = lazy(() => 
  import('@/components/projects/ProjectsMap').then(module => ({ default: module.ProjectsMap }))
);
export const LazyAnalyticsPage = lazy(() => 
  import('@/components/analytics/AnalyticsPage').then(module => ({ default: module.AnalyticsPage }))
);
export const LazySecurityDashboard = lazy(() => import('@/features/security/components/dashboard/SecurityDashboard'));

// === WRAPPER COMPONENT ===
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyWrapper = ({ children, fallback }: LazyWrapperProps) => (
  <Suspense fallback={fallback || <Skeleton className="h-64 w-full" />}>
    {children}
  </Suspense>
);

// === PRELOADER UTILITY ===
export const preloadComponent = (importFn: () => Promise<any>) => {
  // Preload on hover or intersection
  importFn().catch(() => {
    // Ignore preload errors
  });
};

// === CRITICAL ROUTE PRELOADING ===
export const preloadCriticalRoutes = () => {
  // Preload most used routes
  setTimeout(() => {
    preloadComponent(() => import('@/pages/Dashboard'));
    preloadComponent(() => import('@/pages/Organizations'));
  }, 1000);
};