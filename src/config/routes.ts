import { lazy } from 'react';
import type { UserRole } from '@/contexts/AuthContext';
import {
  BarChart3,
  Building2,
  Calendar,
  FileText,
  Home,
  MapPin,
  MessageSquare,
  Rocket,
  BookOpen,
  User,
  Settings,
  Shield,
  PlayCircle,
} from 'lucide-react';

// Types pour la configuration des routes
export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  title: string;
  description?: string;
  requiredRoles?: UserRole[];
  hideFromNav?: boolean;
  icon?: React.ComponentType<any>;
  isProtected?: boolean;
  showInSidebar?: boolean;
  showInMobileNav?: boolean;
  category?: 'main' | 'management' | 'personal' | 'admin';
}

// Lazy loaded components avec route-based splitting
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Indicators = lazy(() => import('@/pages/Indicators'));
const Organizations = lazy(() => import('@/pages/Organizations'));
const Projects = lazy(() => import('@/pages/Projects'));
const Resources = lazy(() => import('@/pages/Resources'));
const Forum = lazy(() => import('@/pages/Forum'));
const Submit = lazy(() => import('@/pages/Submit'));
const Events = lazy(() => import('@/pages/Events'));
const Profile = lazy(() => import('@/pages/Profile'));
const Preferences = lazy(() => import('@/pages/Preferences'));
const AdvancedPreferences = lazy(() => import('@/pages/AdvancedPreferences'));
const Security = lazy(() => import('@/pages/Security'));
const Map = lazy(() => import('@/pages/Map'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const DemoGuide = lazy(() => import('@/pages/DemoGuide'));

// Admin components (separate chunk)
const Admin = lazy(() => import('@/pages/Admin'));
const AdminUsers = lazy(() => import('@/pages/AdminUsers'));
const AdminForum = lazy(() => import('@/pages/AdminForum'));

// Configuration centralisée des routes
export const ROUTES: RouteConfig[] = [
  // Routes principales
  {
    path: '/dashboard',
    component: Dashboard,
    title: 'Tableau de bord',
    description: 'Vue d\'ensemble de vos activités et indicateurs clés',
    icon: Home,
    isProtected: true,
    showInSidebar: true,
    showInMobileNav: true,
    category: 'main',
  },
  {
    path: '/indicators',
    component: Indicators,
    title: 'Indicateurs',
    description: 'Suivi des métriques et indicateurs de performance',
    icon: BarChart3,
    isProtected: true,
    showInSidebar: true,
    showInMobileNav: true,
    category: 'main',
  },
  {
    path: '/map',
    component: Map,
    title: 'Carte',
    description: 'Visualisation géographique des données',
    icon: MapPin,
    isProtected: true,
    showInSidebar: true,
    showInMobileNav: true,
    category: 'main',
  },
  {
    path: '/organizations',
    component: Organizations,
    title: 'Organisations',
    description: 'Gestion des organismes et agences',
    icon: Building2,
    isProtected: true,
    showInSidebar: true,
    showInMobileNav: false,
    category: 'management',
  },
  {
    path: '/projects',
    component: Projects,
    title: 'Projets',
    description: 'Suivi et gestion des projets',
    icon: Rocket,
    isProtected: true,
    showInSidebar: true,
    showInMobileNav: false,
    category: 'management',
  },
  {
    path: '/resources',
    component: Resources,
    title: 'Ressources',
    description: 'Documents et ressources partagées',
    icon: BookOpen,
    isProtected: true,
    showInSidebar: true,
    showInMobileNav: true,
    category: 'main',
  },
  {
    path: '/forum',
    component: Forum,
    title: 'Forum',
    description: 'Discussions et échanges communautaires',
    icon: MessageSquare,
    isProtected: true,
    showInSidebar: true,
    showInMobileNav: true,
    category: 'main',
  },
  {
    path: '/submit',
    component: Submit,
    title: 'Soumettre',
    description: 'Soumettre des données ou documents',
    icon: FileText,
    isProtected: true,
    showInSidebar: true,
    showInMobileNav: false,
    category: 'management',
  },
  {
    path: '/events',
    component: Events,
    title: 'Événements',
    description: 'Calendrier et gestion des événements',
    icon: Calendar,
    isProtected: true,
    showInSidebar: true,
    showInMobileNav: true,
    category: 'main',
  },

  // Routes personnelles
  {
    path: '/profile',
    component: Profile,
    title: 'Profil',
    description: 'Gestion de votre profil utilisateur',
    icon: User,
    isProtected: true,
    showInSidebar: false,
    showInMobileNav: false,
    category: 'personal',
  },
  {
    path: '/preferences',
    component: Preferences,
    title: 'Préférences',
    description: 'Configuration de vos préférences',
    icon: Settings,
    isProtected: true,
    showInSidebar: false,
    showInMobileNav: false,
    category: 'personal',
  },
  {
    path: '/preferences/advanced',
    component: AdvancedPreferences,
    title: 'Préférences avancées',
    description: 'Configuration avancée de l\'application',
    icon: Settings,
    isProtected: true,
    showInSidebar: false,
    showInMobileNav: false,
    hideFromNav: true,
    category: 'personal',
  },
  {
    path: '/security',
    component: Security,
    title: 'Sécurité',
    description: 'Paramètres de sécurité et authentification',
    icon: Shield,
    isProtected: true,
    showInSidebar: false,
    showInMobileNav: false,
    category: 'personal',
  },
  {
    path: '/analytics',
    component: Analytics,
    title: 'Analytics',
    description: 'Analyses détaillées et statistiques',
    icon: BarChart3,
    isProtected: true,
    showInSidebar: false,
    showInMobileNav: false,
    category: 'management',
  },
  {
    path: '/demo-guide',
    component: DemoGuide,
    title: 'Guide de démonstration',
    description: 'Guide interactif de l\'application',
    icon: PlayCircle,
    isProtected: true,
    showInSidebar: false,
    showInMobileNav: false,
    category: 'personal',
  },

  // Routes admin (chunk séparé)
  {
    path: '/admin',
    component: Admin,
    title: 'Administration',
    description: 'Panneau d\'administration général',
    icon: Shield,
    isProtected: true,
    requiredRoles: ['super_admin', 'admin_pays', 'editeur'],
    showInSidebar: false,
    showInMobileNav: false,
    category: 'admin',
  },
  {
    path: '/admin/users',
    component: AdminUsers,
    title: 'Gestion des utilisateurs',
    description: 'Administration des comptes utilisateurs',
    icon: User,
    isProtected: true,
    requiredRoles: ['super_admin', 'admin_pays', 'editeur'],
    showInSidebar: false,
    showInMobileNav: false,
    hideFromNav: true,
    category: 'admin',
  },
  {
    path: '/admin/forum',
    component: AdminForum,
    title: 'Administration du forum',
    description: 'Modération et administration du forum',
    icon: MessageSquare,
    isProtected: true,
    requiredRoles: ['super_admin', 'admin_pays', 'editeur'],
    showInSidebar: false,
    showInMobileNav: false,
    hideFromNav: true,
    category: 'admin',
  },
];

// Utilitaires pour filtrer les routes
export const getRoutesByCategory = (category: RouteConfig['category']) =>
  ROUTES.filter(route => route.category === category);

export const getSidebarRoutes = () =>
  ROUTES.filter(route => route.showInSidebar && !route.hideFromNav);

export const getMobileNavRoutes = () =>
  ROUTES.filter(route => route.showInMobileNav && !route.hideFromNav);

export const getProtectedRoutes = () =>
  ROUTES.filter(route => route.isProtected);

export const getAdminRoutes = () =>
  ROUTES.filter(route => route.requiredRoles?.length);

export const getRouteByPath = (path: string) =>
  ROUTES.find(route => route.path === path);

// Configuration SEO par route
export const getRouteMetadata = (path: string) => {
  const route = getRouteByPath(path);
  if (!route) return null;

  return {
    title: `${route.title} | SUTEL Platform`,
    description: route.description || `Accédez à ${route.title} sur la plateforme SUTEL`,
    canonical: `${window.location.origin}${path}`,
    og: {
      title: route.title,
      description: route.description,
      type: 'website',
      url: `${window.location.origin}${path}`,
    },
  };
};