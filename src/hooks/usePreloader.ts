import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Mapping des routes vers leurs composants lazy
const routeComponentMap = {
  '/dashboard': () => import('@/pages/Dashboard'),
  '/indicators': () => import('@/pages/Indicators'),
  '/organizations': () => import('@/pages/Organizations'),
  '/projects': () => import('@/pages/Projects'),
  '/docs': () => import('@/pages/Resources'),
  '/forum': () => import('@/pages/Forum'),
  '/submit': () => import('@/pages/Submit'),
  '/events': () => import('@/pages/Events'),
  '/profile': () => import('@/pages/Profile'),
  '/preferences': () => import('@/pages/Preferences'),
  '/security': () => import('@/pages/Security'),
  '/map': () => import('@/pages/Map'),
  '/admin': () => import('@/pages/Admin'),
  '/admin/users': () => import('@/pages/AdminUsers'),
  '/admin/forum': () => import('@/pages/AdminForum'),
} as const;

// Prédiction des routes suivantes basée sur la navigation courante
const routePredictions: Record<string, string[]> = {
  '/dashboard': ['/projects', '/organizations', '/indicators'],
  '/organizations': ['/projects', '/map'],
  '/projects': ['/organizations', '/submit'],
  '/indicators': ['/dashboard', '/projects'],
  '/forum': ['/profile', '/submit'],
  '/submit': ['/projects', '/forum'],
  '/events': ['/forum', '/organizations'],
  '/': ['/auth', '/dashboard'],
  '/auth': ['/dashboard']
};

/**
 * Hook pour précharger intelligemment les composants
 */
export const usePreloader = () => {
  const location = useLocation();
  const preloadedRef = useRef<Set<string>>(new Set());

  const preloadComponent = (route: string) => {
    if (preloadedRef.current.has(route)) return;
    
    const importFn = routeComponentMap[route as keyof typeof routeComponentMap];
    if (importFn) {
      importFn().catch(() => {
        // Silently handle errors
      });
      preloadedRef.current.add(route);
    }
  };

  const preloadRoute = (route: string) => {
    // Délai pour éviter de bloquer le thread principal
    setTimeout(() => preloadComponent(route), 100);
  };

  const preloadPredictedRoutes = (currentRoute: string) => {
    const predictions = routePredictions[currentRoute] || [];
    predictions.forEach(route => {
      setTimeout(() => preloadComponent(route), 200 + Math.random() * 300);
    });
  };

  // Précharge basée sur la route actuelle
  useEffect(() => {
    const currentRoute = location.pathname;
    preloadPredictedRoutes(currentRoute);
  }, [location.pathname]);

  // Précharge sur hover (pour les liens de navigation)
  const handleLinkHover = (route: string) => {
    preloadComponent(route);
  };

  return {
    preloadRoute,
    handleLinkHover,
    preloadComponent
  };
};

/**
 * Hook pour précharger des composants critiques au démarrage
 */
export const useCriticalPreloader = () => {
  useEffect(() => {
    // Précharge les composants les plus utilisés après un délai
    const timer = setTimeout(() => {
      import('@/pages/Dashboard').catch(() => {});
      import('@/pages/Projects').catch(() => {});
      import('@/pages/Organizations').catch(() => {});
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
};