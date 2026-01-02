/**
 * Centralized Navigation Utilities - ALIGNED WITH NEXUS BLUEPRINT
 * ============================================================
 * Architecture par couches :
 * - COUCHE 1 : Réseau (visible par défaut)
 * - COUCHE 2 : Collaboration / Apprendre (sur intention)
 * - COUCHE 3 : Opérationnel / Expert (isolée, mode avancé)
 * ============================================================
 */

import { ROUTES, RouteConfig } from '@/config/routes';
import type { UserRole } from '@/contexts/AuthContext';
import {
  Home,
  BarChart3,
  MapPin,
  Building2,
  Rocket,
  BookOpen,
  MessageSquare,
  FileText,
  Calendar,
  User,
  Settings,
  Shield,
  Users,
  TrendingUp,
  Target,
  Brain,
  GraduationCap,
  Eye,
  Bot,
  PenTool,
  Globe,
  Handshake,
  Lightbulb,
  Plus,
  Video,
  Wrench,
} from 'lucide-react';

// Types pour la navigation NEXUS
export type NexusLayer = 'network' | 'collaboration' | 'learning' | 'advanced';

export interface NavigationItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  badge?: string;
  layer?: NexusLayer;
}

export interface NavigationSection {
  label: string;
  labelKey?: string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
  layer: NexusLayer;
  items: NavigationItem[];
}

// Configuration des couches NEXUS
export const NEXUS_LAYERS: Record<NexusLayer, { 
  label: string; 
  labelFr: string;
  icon: React.ComponentType<{ className?: string }>; 
  color: string;
  bgColor: string;
  visible: boolean; // Visible par défaut
}> = {
  network: {
    label: 'Network',
    labelFr: 'Réseau',
    icon: Globe,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
    visible: true,
  },
  collaboration: {
    label: 'Collaborate',
    labelFr: 'Collaborer',
    icon: Handshake,
    color: 'text-green-600',
    bgColor: 'bg-green-500/10',
    visible: true,
  },
  learning: {
    label: 'Learn',
    labelFr: 'Apprendre',
    icon: GraduationCap,
    color: 'text-violet-600',
    bgColor: 'bg-violet-500/10',
    visible: true,
  },
  advanced: {
    label: 'Advanced Mode',
    labelFr: 'Mode avancé',
    icon: Wrench,
    color: 'text-gray-600',
    bgColor: 'bg-gray-500/10',
    visible: false, // Caché par défaut
  },
};

/**
 * Get navigation items for the header - ALIGNED WITH mainNavigation
 */
export const getHeaderNavItems = (t?: (key: string) => string): NavigationItem[] => {
  const translate = t || ((key: string) => key);
  
  // Navigation header simplifiée - pas d'Analytics/Dashboard exposés
  return [
    { title: translate('nav.home'), url: '/', icon: Home, layer: 'network' },
    { title: 'Réseau', url: '/network', icon: Globe, layer: 'network' },
    { title: translate('nav.projects'), url: '/projects', icon: Rocket, layer: 'collaboration' },
    { title: translate('nav.resources'), url: '/resources', icon: BookOpen, layer: 'collaboration' },
    { title: translate('nav.forum'), url: '/forum', icon: MessageSquare, layer: 'collaboration' },
    { title: translate('nav.events'), url: '/events', icon: Calendar, layer: 'learning' },
  ];
};

/**
 * Get navigation items for the sidebar organized by NEXUS layers
 */
export const getSidebarNavByLayers = (
  userRole?: UserRole, 
  t?: (key: string) => string
): NavigationSection[] => {
  const translate = t || ((key: string) => key);
  
  const sections: NavigationSection[] = [
    // COUCHE 1 : RÉSEAU
    {
      label: NEXUS_LAYERS.network.labelFr,
      icon: NEXUS_LAYERS.network.icon,
      color: NEXUS_LAYERS.network.color,
      layer: 'network',
      items: [
        { title: 'Accueil', url: '/', icon: Home, description: 'Vue d\'ensemble' },
        { title: 'Vue Réseau', url: '/network', icon: Globe, description: 'Coordination SUTEL' },
        { title: 'Pays membres', url: '/members', icon: Users, description: 'Annuaire du réseau' },
        { title: 'Carte', url: '/map', icon: MapPin, description: 'Visualisation géographique' },
      ],
    },
    // COUCHE 2 : COLLABORATION
    {
      label: NEXUS_LAYERS.collaboration.labelFr,
      icon: NEXUS_LAYERS.collaboration.icon,
      color: NEXUS_LAYERS.collaboration.color,
      layer: 'collaboration',
      items: [
        { title: translate('nav.projects'), url: '/projects', icon: Rocket, description: 'Initiatives inspirantes' },
        { title: 'Bonnes pratiques', url: '/practices', icon: Lightbulb, description: 'Partage d\'expériences' },
        { title: 'Bibliothèque', url: '/resources', icon: BookOpen, description: 'Documents & ressources' },
        { title: translate('nav.forum'), url: '/forum', icon: MessageSquare, description: 'Discussions' },
        { title: 'Proposer', url: '/submit', icon: Plus, description: 'Partager une initiative' },
      ],
    },
    // COUCHE 2 : APPRENDRE
    {
      label: NEXUS_LAYERS.learning.labelFr,
      icon: NEXUS_LAYERS.learning.icon,
      color: NEXUS_LAYERS.learning.color,
      layer: 'learning',
      items: [
        { title: 'E-Learning', url: '/elearning', icon: GraduationCap, description: 'Formations' },
        { title: translate('nav.events'), url: '/events', icon: Calendar, description: 'Agenda collaboratif' },
        { title: 'Webinaires', url: '/webinars', icon: Video, description: 'Sessions en direct' },
      ],
    },
  ];

  // COUCHE 3 : MODE AVANCÉ (admin uniquement)
  if (userRole && ['super_admin', 'admin_pays'].includes(userRole)) {
    sections.push({
      label: NEXUS_LAYERS.advanced.labelFr,
      icon: NEXUS_LAYERS.advanced.icon,
      color: NEXUS_LAYERS.advanced.color,
      layer: 'advanced',
      items: [
        { title: 'Analytics', url: '/analytics', icon: BarChart3, description: 'Analyses détaillées' },
        { title: 'Indicateurs', url: '/indicators', icon: TrendingUp, description: 'Données FSU' },
        { title: 'Organisations', url: '/organizations', icon: Building2, description: 'Répertoire FSU' },
        { title: 'Administration', url: '/admin', icon: Settings, description: 'Gestion système' },
      ],
    });
  }

  return sections;
};

/**
 * Get navigation items for mobile bottom nav - SIMPLIFIED
 */
export const getMobileNavItems = (userRole?: UserRole): NavigationItem[] => {
  // Navigation mobile : Réseau, Projets, Bibliothèque, Profil
  // PAS d'Analytics/Indicateurs
  return [
    { title: 'Accueil', url: '/', icon: Home, layer: 'network' },
    { title: 'Réseau', url: '/network', icon: Globe, layer: 'network' },
    { title: 'Projets', url: '/projects', icon: Rocket, layer: 'collaboration' },
    { title: 'Bibliothèque', url: '/resources', icon: BookOpen, layer: 'collaboration' },
    { title: 'Profil', url: '/profile', icon: User, layer: 'network' },
  ];
};

/**
 * Get advanced mode items (for admin dropdown/page)
 */
export const getAdvancedModeItems = (): NavigationItem[] => {
  return [
    { title: 'Analytics', url: '/analytics', icon: BarChart3, description: 'Analyses détaillées' },
    { title: 'Indicateurs', url: '/indicators', icon: TrendingUp, description: 'Données FSU' },
    { title: 'Organisations', url: '/organizations', icon: Building2, description: 'Répertoire FSU' },
    { title: 'Administration', url: '/admin', icon: Settings, description: 'Gestion système' },
    { title: 'Sécurité', url: '/security', icon: Shield, description: 'Paramètres sécurité' },
  ];
};

/**
 * Get the layer for a given path
 */
export const getLayerForPath = (path: string): NexusLayer | undefined => {
  const layerMap: Record<string, NexusLayer> = {
    '/': 'network',
    '/network': 'network',
    '/members': 'network',
    '/map': 'network',
    '/projects': 'collaboration',
    '/practices': 'collaboration',
    '/resources': 'collaboration',
    '/forum': 'collaboration',
    '/submit': 'collaboration',
    '/elearning': 'learning',
    '/events': 'learning',
    '/webinars': 'learning',
    '/analytics': 'advanced',
    '/indicators': 'advanced',
    '/organizations': 'advanced',
    '/admin': 'advanced',
    '/security': 'advanced',
  };
  
  return layerMap[path];
};

// ============================================================
// LEGACY EXPORTS (pour compatibilité)
// ============================================================

// Re-export with old names for backward compatibility
export type UniversType = NexusLayer;
export const UNIVERS_CONFIG = NEXUS_LAYERS;
export const getSidebarNavByUnivers = getSidebarNavByLayers;
export const getUniversForPath = getLayerForPath;

/**
 * Get flat list of all sidebar routes
 */
export const getFlatSidebarRoutes = (): NavigationItem[] => {
  return ROUTES
    .filter(route => route.showInSidebar && !route.hideFromNav)
    .map(route => ({
      title: route.title,
      url: route.path,
      icon: route.icon || Home,
      description: route.description,
      layer: getLayerForPath(route.path),
    }));
};
