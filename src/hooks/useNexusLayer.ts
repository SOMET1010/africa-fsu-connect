// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  NEXUS LAYER HOOK - Utilise les règles centralisées de blueprintGuards   ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import { useLocation } from 'react-router-dom';
import {
  isNetworkLayer,
  isCollaborationLayer,
  isAdvancedLayer,
  getCurrentLayer,
  shouldShowAdminUI,
  shouldShowSuggestions,
  shouldShowKPIs,
  shouldShowAdminLinks,
} from '@/config/blueprintGuards';

export type NexusLayer = 'network' | 'collaboration' | 'operational';

/**
 * Hook pour déterminer la couche NEXUS actuelle selon la route.
 * 
 * Couche 1 (Réseau) : Vitrine politique - AUCUN élément admin
 * Couche 2 (Collaboration) : Contribution - Éléments techniques limités
 * Couche 3 (Opérationnel) : Experts/Admin - Tous éléments techniques
 * 
 * ⚠️ Ce hook utilise les règles centralisées de blueprintGuards.ts
 */
export const useNexusLayer = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const currentLayer = getCurrentLayer(pathname);

  return {
    currentLayer,
    isNetworkLayer: isNetworkLayer(pathname),
    isCollaborationLayer: isCollaborationLayer(pathname),
    isOperationalLayer: isAdvancedLayer(pathname),
    
    // Helpers pour les décisions UI (délégués aux blueprintGuards)
    shouldShowAdminUI: shouldShowAdminUI(pathname),
    shouldShowSuggestions: shouldShowSuggestions(pathname),
    shouldShowKPIs: shouldShowKPIs(pathname),
    shouldShowAdminLinks: shouldShowAdminLinks(pathname),
  };
};
