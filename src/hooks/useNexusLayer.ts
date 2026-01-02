import { useLocation } from 'react-router-dom';

export type NexusLayer = 'network' | 'collaboration' | 'operational';

// Routes de la Couche 1 - RÉSEAU (vitrine politique, aucun admin)
const LAYER_1_ROUTES = ['/', '/network', '/members', '/map', '/about', '/countries'];

// Routes de la Couche 2 - COLLABORATION (contribution, pas de gestion)
const LAYER_2_ROUTES = [
  '/projects', '/practices', '/resources', '/forum', '/submit', 
  '/events', '/webinars', '/elearning', '/library', '/discussions',
  '/my-contributions'
];

// Routes de la Couche 3 - OPÉRATIONNEL (experts/admin uniquement)
const LAYER_3_ROUTES = [
  '/advanced', '/analytics', '/indicators', '/admin', '/organizations',
  '/security', '/dashboard', '/settings'
];

/**
 * Hook pour déterminer la couche NEXUS actuelle selon la route.
 * 
 * Couche 1 (Réseau) : Vitrine politique - AUCUN élément admin
 * Couche 2 (Collaboration) : Contribution - Éléments techniques limités
 * Couche 3 (Opérationnel) : Experts/Admin - Tous éléments techniques
 */
export const useNexusLayer = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getCurrentLayer = (): NexusLayer => {
    // Vérifier couche 1 (réseau)
    if (LAYER_1_ROUTES.some(route => 
      currentPath === route || currentPath.startsWith(route + '/')
    )) {
      return 'network';
    }

    // Vérifier couche 3 (opérationnel) - avant couche 2 car plus spécifique
    if (LAYER_3_ROUTES.some(route => 
      currentPath === route || currentPath.startsWith(route + '/')
    )) {
      return 'operational';
    }

    // Vérifier couche 2 (collaboration)
    if (LAYER_2_ROUTES.some(route => 
      currentPath === route || currentPath.startsWith(route + '/')
    )) {
      return 'collaboration';
    }

    // Par défaut : couche réseau (sécurité)
    return 'network';
  };

  const currentLayer = getCurrentLayer();

  return {
    currentLayer,
    isNetworkLayer: currentLayer === 'network',
    isCollaborationLayer: currentLayer === 'collaboration',
    isOperationalLayer: currentLayer === 'operational',
    
    // Helpers pour les décisions UI
    shouldShowAdminUI: currentLayer === 'operational',
    shouldShowSuggestions: currentLayer !== 'network',
    shouldShowKPIs: currentLayer === 'operational',
  };
};
