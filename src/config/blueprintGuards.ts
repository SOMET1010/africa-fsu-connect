// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  NEXUS BLUEPRINT GUARDS - RÈGLES CENTRALISÉES                            ║
// ║                                                                          ║
// ║  Ce fichier est la SOURCE UNIQUE DE VÉRITÉ pour la séparation des       ║
// ║  couches NEXUS. TOUTE modification doit être validée par l'équipe.       ║
// ║                                                                          ║
// ║  Couche 1 (RÉSEAU) : Vitrine politique - AUCUN élément admin            ║
// ║  Couche 2 (COLLABORATION) : Contribution - Éléments techniques limités  ║
// ║  Couche 3 (OPÉRATIONNEL) : Experts/Admin - Tous éléments techniques     ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ============================================================================
// DÉFINITIONS DES ROUTES PAR COUCHE
// ============================================================================

/**
 * Layer 1 - RÉSEAU (Vitrine politique)
 * Pages accessibles au grand public, aucun élément admin visible
 */
export const LAYER_1_ROUTES = [
  '/',
  '/network',
  '/members',
  '/map',
  '/about',
  '/countries',
  '/activity'
];

/**
 * Layer 2 - COLLABORATION (Contribution)
 * Pages pour contributeurs, pas de gestion, éléments techniques limités
 */
export const LAYER_2_ROUTES = [
  '/projects',
  '/practices',
  '/resources',
  '/forum',
  '/submit',
  '/events',
  '/webinars',
  '/elearning',
  '/library',
  '/discussions',
  '/my-contributions'
];

/**
 * Layer 3 - OPÉRATIONNEL (Experts/Admin)
 * Toutes fonctionnalités admin, analytics, gestion
 */
export const LAYER_3_ROUTES = [
  '/advanced',
  '/admin',
  '/analytics',
  '/indicators',
  '/organizations',
  '/security',
  '/dashboard',
  '/settings'
];

// ============================================================================
// FONCTIONS DE DÉTECTION DE COUCHE
// ============================================================================

/**
 * Vérifie si une route appartient à une liste de routes
 */
const matchesRoute = (pathname: string, routes: string[]): boolean => {
  return routes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
};

/**
 * Couche 1 - RÉSEAU : Vitrine politique, aucun admin
 */
export const isNetworkLayer = (pathname: string): boolean => {
  return matchesRoute(pathname, LAYER_1_ROUTES);
};

/**
 * Couche 2 - COLLABORATION : Contribution, pas de gestion
 */
export const isCollaborationLayer = (pathname: string): boolean => {
  return matchesRoute(pathname, LAYER_2_ROUTES);
};

/**
 * Couche 3 - OPÉRATIONNEL : Experts/Admin uniquement
 */
export const isAdvancedLayer = (pathname: string): boolean => {
  return matchesRoute(pathname, LAYER_3_ROUTES);
};

/**
 * Détermine la couche actuelle à partir du pathname
 */
export const getCurrentLayer = (pathname: string): 'network' | 'collaboration' | 'operational' => {
  if (isAdvancedLayer(pathname)) return 'operational';
  if (isCollaborationLayer(pathname)) return 'collaboration';
  // Par défaut : couche réseau (sécurité)
  return 'network';
};

// ============================================================================
// FONCTIONS DE DÉCISION UI - GARDE-FOUS
// ============================================================================

/**
 * ⚠️ GARDE-FOU : Les éléments admin UI ne s'affichent QUE sur Layer 3
 */
export const shouldShowAdminUI = (pathname: string): boolean => {
  return isAdvancedLayer(pathname);
};

/**
 * ⚠️ GARDE-FOU : Les suggestions intelligentes ne s'affichent PAS sur Layer 1
 */
export const shouldShowSuggestions = (pathname: string): boolean => {
  return !isNetworkLayer(pathname);
};

/**
 * ⚠️ GARDE-FOU : Les KPIs/Analytics ne s'affichent QUE sur Layer 3
 */
export const shouldShowKPIs = (pathname: string): boolean => {
  return isAdvancedLayer(pathname);
};

/**
 * ⚠️ GARDE-FOU : Les liens admin (menu, sidebar) ne s'affichent QUE sur Layer 3
 * Même si l'utilisateur EST admin, on ne montre pas ces liens sur Layer 1/2
 */
export const shouldShowAdminLinks = (pathname: string): boolean => {
  return isAdvancedLayer(pathname);
};

// ============================================================================
// EXPORTS POUR TESTS ET DOCUMENTATION
// ============================================================================

export const NEXUS_LAYERS = {
  LAYER_1_ROUTES,
  LAYER_2_ROUTES,
  LAYER_3_ROUTES,
} as const;
