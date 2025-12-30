/**
 * Centralized Navigation Utilities
 * Single source of truth for all navigation components
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
} from 'lucide-react';

// UX Universe types for organized navigation
export type UniversType = 
  | 'pilotage'      // Impact & Pilotage
  | 'projets'       // Projets & Financements
  | 'territoires'   // Territoires
  | 'communaute'    // Communauté
  | 'capacites'     // Capacités & Intelligence
  | 'admin';        // Administration

export interface NavigationItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  badge?: string;
  univers?: UniversType;
}

export interface NavigationSection {
  label: string;
  labelKey?: string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
  items: NavigationItem[];
}

// Universe configuration with colors and icons
export const UNIVERS_CONFIG: Record<UniversType, { 
  label: string; 
  labelFr: string;
  icon: React.ComponentType<{ className?: string }>; 
  color: string;
  bgColor: string;
}> = {
  pilotage: {
    label: 'Impact & Pilotage',
    labelFr: 'Impact & Pilotage',
    icon: Target,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
  },
  projets: {
    label: 'Projects & Funding',
    labelFr: 'Projets & Financements',
    icon: Rocket,
    color: 'text-green-600',
    bgColor: 'bg-green-500/10',
  },
  territoires: {
    label: 'Territories',
    labelFr: 'Territoires',
    icon: MapPin,
    color: 'text-orange-600',
    bgColor: 'bg-orange-500/10',
  },
  communaute: {
    label: 'Community',
    labelFr: 'Communauté',
    icon: Users,
    color: 'text-violet-600',
    bgColor: 'bg-violet-500/10',
  },
  capacites: {
    label: 'Capabilities & Intelligence',
    labelFr: 'Capacités & Intelligence',
    icon: Brain,
    color: 'text-amber-600',
    bgColor: 'bg-amber-500/10',
  },
  admin: {
    label: 'Administration',
    labelFr: 'Administration',
    icon: Shield,
    color: 'text-gray-600',
    bgColor: 'bg-gray-500/10',
  },
};

// Map routes to universes
const ROUTE_UNIVERS_MAP: Record<string, UniversType> = {
  '/dashboard': 'pilotage',
  '/indicators': 'pilotage',
  '/analytics': 'pilotage',
  '/public-dashboard': 'pilotage',
  '/projects': 'projets',
  '/submit': 'projets',
  '/organizations': 'projets',
  '/concept-note': 'projets',
  '/map': 'territoires',
  '/forum': 'communaute',
  '/events': 'communaute',
  '/resources': 'communaute',
  '/elearning': 'capacites',
  '/watch': 'capacites',
  '/assistant': 'capacites',
  '/coauthoring': 'capacites',
  '/admin': 'admin',
  '/admin/users': 'admin',
  '/admin/forum': 'admin',
  '/security': 'admin',
  '/profile': 'pilotage',
  '/preferences': 'pilotage',
};

/**
 * Get navigation items for the header
 */
export const getHeaderNavItems = (t?: (key: string) => string): NavigationItem[] => {
  const translate = t || ((key: string) => key);
  
  return [
    { title: translate('nav.home'), url: '/', icon: Home },
    { title: translate('nav.dashboard'), url: '/dashboard', icon: Home },
    { title: 'Analytics', url: '/analytics', icon: BarChart3 },
    { title: translate('nav.projects'), url: '/projects', icon: Rocket },
    { title: translate('nav.resources'), url: '/resources', icon: BookOpen },
    { title: translate('nav.forum'), url: '/forum', icon: MessageSquare },
    { title: translate('nav.submit'), url: '/submit', icon: FileText },
    { title: translate('nav.events'), url: '/events', icon: Calendar },
  ];
};

/**
 * Get navigation items for the sidebar organized by univers
 */
export const getSidebarNavByUnivers = (
  userRole?: UserRole, 
  t?: (key: string) => string
): NavigationSection[] => {
  const translate = t || ((key: string) => key);
  
  const sections: NavigationSection[] = [
    {
      label: UNIVERS_CONFIG.pilotage.labelFr,
      icon: UNIVERS_CONFIG.pilotage.icon,
      color: UNIVERS_CONFIG.pilotage.color,
      items: [
        { title: translate('nav.dashboard'), url: '/dashboard', icon: Home, description: 'Vue d\'ensemble' },
        { title: 'Indicateurs', url: '/indicators', icon: TrendingUp, description: 'Données FSU' },
        { title: 'Analytics', url: '/analytics', icon: BarChart3, description: 'Analyses détaillées' },
      ],
    },
    {
      label: UNIVERS_CONFIG.projets.labelFr,
      icon: UNIVERS_CONFIG.projets.icon,
      color: UNIVERS_CONFIG.projets.color,
      items: [
        { title: translate('nav.projects'), url: '/projects', icon: Rocket, description: 'Initiatives FSU' },
        { title: 'Soumettre', url: '/submit', icon: FileText, description: 'Envoi de données' },
        { title: translate('nav.organizations'), url: '/organizations', icon: Building2, description: 'Répertoire FSU' },
      ],
    },
    {
      label: UNIVERS_CONFIG.territoires.labelFr,
      icon: UNIVERS_CONFIG.territoires.icon,
      color: UNIVERS_CONFIG.territoires.color,
      items: [
        { title: 'Carte Interactive', url: '/map', icon: MapPin, description: 'Projets par zone' },
      ],
    },
    {
      label: UNIVERS_CONFIG.communaute.labelFr,
      icon: UNIVERS_CONFIG.communaute.icon,
      color: UNIVERS_CONFIG.communaute.color,
      items: [
        { title: translate('nav.forum'), url: '/forum', icon: MessageSquare, description: 'Discussions' },
        { title: translate('nav.events'), url: '/events', icon: Calendar, description: 'Agenda collaboratif' },
        { title: 'Ressources', url: '/resources', icon: BookOpen, description: 'Guides & documents' },
      ],
    },
    {
      label: UNIVERS_CONFIG.capacites.labelFr,
      icon: UNIVERS_CONFIG.capacites.icon,
      color: UNIVERS_CONFIG.capacites.color,
      items: [
        { title: 'E-Learning', url: '/elearning', icon: GraduationCap, description: 'Formations' },
        { title: 'Veille Stratégique', url: '/watch', icon: Eye, description: 'Actualités & opportunités' },
        { title: 'Assistant SUTA', url: '/assistant', icon: Bot, description: 'IA multilingue' },
        { title: 'Co-rédaction', url: '/coauthoring', icon: PenTool, description: 'Édition collaborative' },
      ],
    },
  ];

  // Add admin section for admin users
  if (userRole && ['super_admin', 'admin_pays', 'editeur'].includes(userRole)) {
    sections.push({
      label: UNIVERS_CONFIG.admin.labelFr,
      icon: UNIVERS_CONFIG.admin.icon,
      color: UNIVERS_CONFIG.admin.color,
      items: [
        { title: 'Administration', url: '/admin', icon: BarChart3, description: 'Gestion système' },
        { title: 'Utilisateurs', url: '/admin/users', icon: Users, description: 'Gestion comptes' },
        { title: 'Sécurité', url: '/security', icon: Shield, description: 'Paramètres sécurité' },
      ],
    });
  }

  return sections;
};

/**
 * Get navigation items for mobile bottom nav
 */
export const getMobileNavItems = (userRole?: UserRole): NavigationItem[] => {
  return [
    { title: 'Accueil', url: '/dashboard', icon: Home },
    { title: 'Analytics', url: '/analytics', icon: BarChart3 },
    { title: 'Orgs', url: '/organizations', icon: Building2 },
    { title: 'Données', url: '/indicators', icon: TrendingUp },
    { title: 'Ressources', url: '/resources', icon: BookOpen },
    { title: 'Profil', url: '/profile', icon: User },
  ];
};

/**
 * Get the univers for a given path
 */
export const getUniversForPath = (path: string): UniversType | undefined => {
  return ROUTE_UNIVERS_MAP[path];
};

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
      univers: ROUTE_UNIVERS_MAP[route.path],
    }));
};
