import { lazy } from 'react';
import { withLazyLoading } from '@/utils/lazyLoading';
import { Skeleton } from '@/components/ui/skeleton';

// Loading fallbacks
const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="h-32 rounded-lg" />
      <Skeleton className="h-32 rounded-lg" />
      <Skeleton className="h-32 rounded-lg" />
    </div>
    <Skeleton className="h-64 rounded-lg" />
  </div>
);

const TableSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 rounded" />
    <Skeleton className="h-16 rounded" />
    <Skeleton className="h-16 rounded" />
  </div>
);

const FormSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-1/3 rounded" />
    <Skeleton className="h-10 rounded" />
    <Skeleton className="h-10 rounded" />
    <Skeleton className="h-10 w-32 rounded" />
  </div>
);

// Lazy components avec default exports
export const LazyUserFirstDashboard = lazy(() => 
  import('@/components/dashboard/UserFirstDashboard').then(module => ({
    default: module.UserFirstDashboard
  }))
);

export const LazyProjectDialog = lazy(() => 
  import('@/components/projects/ProjectDialog').then(module => ({
    default: module.ProjectDialog
  }))
);

export const LazyEventFilters = lazy(() => 
  import('@/components/events/EventFilters').then(module => ({
    default: module.EventFilters
  }))
);

export const LazyOrganizationsMap = lazy(() => 
  import('@/components/organizations/OrganizationsMap').then(module => ({
    default: module.OrganizationsMap
  }))
);

export const LazySecurityDashboard = lazy(() => 
  import('@/features/security/components/dashboard/SecurityDashboard').then(module => ({
    default: module.default
  }))
);

export const LazyAdminUsers = lazy(() => 
  import('@/pages/AdminUsers').then(module => ({
    default: module.default
  }))
);

// Preloader utilities
export const componentPreloaders = {
  dashboard: () => import('@/components/dashboard/UserFirstDashboard'),
  projects: () => import('@/components/projects/ProjectDialog'),
  events: () => import('@/components/events/EventFilters'),
  organizations: () => import('@/components/organizations/OrganizationsMap'),
  security: () => import('@/features/security/components/dashboard/SecurityDashboard'),
  admin: () => import('@/pages/AdminUsers'),
};

export const useRoutePreloader = () => {
  const preloadByRoute = (route: string) => {
    const preloader = componentPreloaders[route as keyof typeof componentPreloaders];
    if (preloader) {
      preloader().catch(() => {
        // Silent fail pour preloading
      });
    }
  };

  return { preloadByRoute };
};