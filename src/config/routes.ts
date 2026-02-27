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
  Users,
  Settings,
  Shield,
  PlayCircle,
  Flag,
  Lightbulb,
  Video,
  Handshake,
  Mail,
  Database,
} from 'lucide-react';
import { ADMIN_MENU_FEATURES } from '@/data/adminMenuConfig';

// UX Universe types for organized navigation
export type UniversType = 
  | 'pilotage'      // Impact & Pilotage
  | 'projets'       // Projets & Financements
  | 'territoires'   // Territoires
  | 'communaute'    // Communauté
  | 'capacites'     // Capacités & Intelligence
  | 'admin';        // Administration

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
  univers?: UniversType;
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
const ConceptNote = lazy(() => import('@/pages/ConceptNote'));
const Presentation = lazy(() => import('@/pages/Presentation'));
const PresentationAnalytics = lazy(() => import('@/components/presentation/PresentationAnalytics').then(m => ({ default: m.PresentationAnalytics })));

// Admin components (separate chunk)
const Admin = lazy(() => import('@/pages/Admin'));
const AdminUsers = lazy(() => import('@/pages/AdminUsers'));
const AdminForum = lazy(() => import('@/pages/AdminForum'));
const AdminResources = lazy(() => import('@/pages/admin/AdminResources'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const FocalPointsManagement = lazy(() => import('@/pages/admin/FocalPointsManagement'));
const FocalDashboard = lazy(() => import('@/pages/FocalDashboard'));
const PlatformConfig = lazy(() => import('@/pages/admin/PlatformConfig'));
const TranslationsExport = lazy(() => import('@/pages/admin/TranslationsExport'));
const I18nQAChecklist = lazy(() => import('@/pages/admin/I18nQAChecklist'));
const HomepageEditor = lazy(() => import('@/pages/admin/HomepageEditor'));
const ContentManager = lazy(() => import('@/pages/admin/ContentManager'));
const AdminFeaturePage = lazy(() => import('@/pages/admin/AdminFeaturePage'));
// New SUTEL modules
const ELearning = lazy(() => import('@/pages/ELearning'));
const StrategicWatch = lazy(() => import('@/pages/StrategicWatch'));
const Coauthoring = lazy(() => import('@/pages/Coauthoring'));
const PublicDashboard = lazy(() => import('@/pages/PublicDashboard'));
const SutaAssistant = lazy(() => import('@/pages/SutaAssistant'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const Strategies = lazy(() => import('@/pages/Strategies'));
const Roadmap = lazy(() => import('@/pages/Roadmap'));
const PrivacyPolicy = lazy(() => import('@/pages/legal/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('@/pages/legal/TermsOfUse'));
const MyCountry = lazy(() => import('@/pages/MyCountry'));
const CrossBorderCollaboration = lazy(() => import('@/pages/CrossBorderCollaboration'));
const MigrationStatus = lazy(() => import('@/pages/debug/MigrationStatus'));

// New network pages (3-layer architecture)
const NetworkView = lazy(() => import('@/pages/NetworkView'));
const MembersDirectory = lazy(() => import('@/pages/MembersDirectory'));
const Community = lazy(() => import('@/pages/Community'));
const CountryProfile = lazy(() => import('@/pages/CountryProfile'));
const NetworkActivity = lazy(() => import('@/pages/NetworkActivity'));
const AdvancedMode = lazy(() => import('@/pages/AdvancedMode'));

// Collaboration pages
const Practices = lazy(() => import('@/pages/Practices'));
const Webinars = lazy(() => import('@/pages/Webinars'));
const MyContributions = lazy(() => import('@/pages/MyContributions'));
const AgencyDocuments = lazy(() => import('@/pages/AgencyDocuments'));

// Configuration centralisée des routes
const STATIC_ROUTES: RouteConfig[] = [
  // COUCHE 1 - RÉSEAU (visible par défaut)
  {
    path: '/network',
    component: NetworkView,
    title: 'Vue Réseau',
    description: 'Coordination collective du réseau SUTEL',
    icon: Home,
    isProtected: false,
    showInSidebar: true,
    showInMobileNav: true,
    category: 'main',
    univers: 'pilotage',
  },
  {
    path: '/members',
    component: MembersDirectory,
    title: 'Pays membres',
    description: 'Annuaire des pays du réseau NEXUS',
    icon: Building2,
    isProtected: false,
    showInSidebar: true,
    showInMobileNav: false,
    category: 'main',
    univers: 'pilotage',
  },
  {
    path: '/community',
    component: Community,
    title: 'Communautés linguistiques',
    description: 'Les 4 communautés linguistiques du réseau SUTEL',
    icon: Users,
    isProtected: false,
    showInSidebar: true,
    showInMobileNav: false,
    category: 'main',
    univers: 'communaute',
  },
  {
    path: '/country/:code',
    component: CountryProfile,
    title: 'Fiche Pays',
    description: 'Profil d\'un pays membre',
    icon: Building2,
    isProtected: false,
    showInSidebar: false,
    showInMobileNav: false,
    hideFromNav: true,
    category: 'main',
    univers: 'pilotage',
  },
  // Network Activity (Couche 1)
  {
    path: '/activity',
    component: NetworkActivity,
    title: 'Activité récente',
    description: 'Timeline des activités du réseau SUTEL',
    icon: BarChart3,
    isProtected: false,
    showInSidebar: false,
    showInMobileNav: false,
    category: 'main',
    univers: 'pilotage',
  },
  // Advanced Mode (Couche 3)
  {
    path: '/advanced',
    component: AdvancedMode,
    title: 'Mode avancé',
    description: 'Données techniques et administration',
    icon: Shield,
    isProtected: true,
    requiredRoles: ['super_admin', 'country_admin'],
    showInSidebar: false,
    showInMobileNav: false,
    category: 'admin',
    univers: 'admin',
  },
  // Legacy route redirect
  {
    path: '/dashboard',
    component: Dashboard,
    title: 'Tableau de bord',
    description: 'Vue d\'ensemble de vos activités et indicateurs clés',
    icon: Home,
    isProtected: true,
    showInSidebar: false,
    showInMobileNav: false,
    category: 'main',
    univers: 'pilotage',
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
    univers: 'pilotage',
  },
  {
    path: '/my-country',
    component: MyCountry,
    title: 'Mon Pays',
    description: 'Vue privée de mon Fonds du Service Universel',
    icon: Flag,
    isProtected: true,
    showInSidebar: true,
    showInMobileNav: false,
    category: 'main',
    univers: 'pilotage',
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
    univers: 'territoires',
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
    univers: 'projets',
  },
  {
    path: '/agency-documents',
    component: AgencyDocuments,
    title: 'Documents Agences',
    description: 'Bibliothèque documentaire partagée entre les agences',
    icon: BookOpen,
    isProtected: true,
    showInSidebar: true,
    showInMobileNav: false,
    category: 'management',
    univers: 'projets',
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
    univers: 'projets',
  },
  {
    path: '/collaboration',
    component: CrossBorderCollaboration,
    title: 'Collaboration transfrontalière',
    description: 'Projets inter-agences impliquant plusieurs pays',
    icon: Handshake,
    isProtected: true,
    showInSidebar: true,
    showInMobileNav: false,
    category: 'management',
    univers: 'projets',
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
    univers: 'communaute',
  },
  {
    path: '/practices',
    component: Practices,
    title: 'Bonnes pratiques',
    description: 'Partage d\'expériences du réseau',
    icon: Lightbulb,
    isProtected: true,
    showInSidebar: true,
    showInMobileNav: false,
    category: 'main',
    univers: 'communaute',
  },
  {
    path: '/webinars',
    component: Webinars,
    title: 'Webinaires',
    description: 'Sessions en direct et replays',
    icon: Video,
    isProtected: true,
    showInSidebar: false,
    showInMobileNav: false,
    category: 'main',
    univers: 'capacites',
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
    univers: 'communaute',
  },
  {
    path: '/submit',
    component: Submit,
    title: 'Proposer',
    description: 'Partager une initiative avec le réseau',
    icon: FileText,
    isProtected: true,
    showInSidebar: true,
    showInMobileNav: false,
    category: 'management',
    univers: 'communaute',
  },
  {
    path: '/my-contributions',
    component: MyContributions,
    title: 'Mes contributions',
    description: 'Suivez vos soumissions au réseau',
    icon: FileText,
    isProtected: true,
    showInSidebar: false,
    showInMobileNav: false,
    category: 'personal',
    univers: 'communaute',
  },
  {
    path: '/concept-note',
    component: ConceptNote,
    title: 'Note conceptuelle',
    description: 'Rédigez une note conceptuelle structurée',
    icon: FileText,
    isProtected: true,
    showInSidebar: false,
    showInMobileNav: false,
    category: 'main',
    univers: 'projets',
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
    univers: 'communaute',
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
    univers: 'pilotage',
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
    univers: 'pilotage',
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
    univers: 'pilotage',
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
    univers: 'admin',
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
    univers: 'pilotage',
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
  {
    path: '/presentation',
    component: Presentation,
    title: 'Présentation SUTEL',
    description: 'Présentation stratégique de la plateforme SUTEL',
    icon: PlayCircle,
    isProtected: false,
    showInSidebar: false,
    showInMobileNav: false,
    category: 'main',
  },
  {
    path: '/presentation/analytics',
    component: PresentationAnalytics,
    title: 'Analytics Présentation',
    description: 'Statistiques et analyses des présentations',
    icon: BarChart3,
    isProtected: true,
    requiredRoles: ['super_admin', 'country_admin'],
    showInSidebar: false,
    showInMobileNav: false,
    hideFromNav: true,
    category: 'admin',
    univers: 'admin',
  },

  // New SUTEL modules
  {
    path: '/elearning',
    component: ELearning,
    title: 'E-Learning',
    description: 'Formation et parcours métiers',
    icon: BookOpen,
    isProtected: true,
    showInSidebar: true,
    showInMobileNav: false,
    category: 'main',
    univers: 'capacites',
  },
  {
    path: '/watch',
    component: StrategicWatch,
    title: 'Veille Stratégique',
    description: 'Actualités et opportunités de financement',
    icon: BarChart3,
    isProtected: true,
    showInSidebar: true,
    showInMobileNav: false,
    category: 'management',
    univers: 'capacites',
  },
  {
    path: '/coauthoring',
    component: Coauthoring,
    title: 'Co-rédaction',
    description: 'Édition collaborative de documents',
    icon: FileText,
    isProtected: true,
    showInSidebar: true,
    showInMobileNav: false,
    category: 'management',
    univers: 'capacites',
  },
  {
    path: '/public-dashboard',
    component: PublicDashboard,
    title: 'Tableau de Bord Public',
    description: 'Indicateurs agrégés et progrès régional',
    icon: BarChart3,
    isProtected: false,
    showInSidebar: true,
    showInMobileNav: false,
    category: 'main',
    univers: 'pilotage',
  },
  {
    path: '/assistant',
    component: SutaAssistant,
    title: 'Assistant SUTA',
    description: 'Assistant IA multilingue',
    icon: MessageSquare,
    isProtected: true,
    showInSidebar: true,
    showInMobileNav: true,
    category: 'main',
    univers: 'capacites',
  },
  {
    path: '/about',
    component: About,
    title: 'À Propos',
    description: 'Gouvernance et mission SUTEL',
    icon: Building2,
    isProtected: false,
    showInSidebar: false,
    showInMobileNav: false,
    category: 'main',
  },
  {
    path: '/roadmap',
    component: Roadmap,
    title: 'Feuille de Route',
    description: 'Roadmap 2025-2026',
    icon: Rocket,
    isProtected: false,
    showInSidebar: false,
    showInMobileNav: false,
    category: 'main',
  },
  {
    path: '/legal/privacy',
    component: PrivacyPolicy,
    title: 'Politique de confidentialité',
    description: 'Protection des données personnelles',
    icon: Shield,
    isProtected: false,
    showInSidebar: false,
    showInMobileNav: false,
    hideFromNav: true,
    category: 'main',
  },
  {
    path: '/legal/terms',
    component: TermsOfUse,
    title: 'Conditions d\'utilisation',
    description: 'Règles d\'utilisation de la plateforme',
    icon: FileText,
    isProtected: false,
    showInSidebar: false,
    showInMobileNav: false,
    hideFromNav: true,
    category: 'main',
  },
  {
    path: '/contact',
    component: Contact,
    title: 'Contact',
    description: 'Coordonnées et formulaire de contact',
    icon: Mail,
    isProtected: false,
    showInSidebar: false,
    showInMobileNav: false,
    hideFromNav: true,
    category: 'main',
  },
  {
    path: '/strategies',
    component: Strategies,
    title: 'Stratégies et Politiques',
    description: 'Cadres réglementaires et politiques FSU en Afrique',
    icon: FileText,
    isProtected: false,
    showInSidebar: false,
    showInMobileNav: false,
    hideFromNav: true,
    category: 'main',
  },

  // Debug pages (public)
  {
    path: '/debug/migrations',
    component: MigrationStatus,
    title: 'Migration Status',
    description: 'Tableau de bord de santé des migrations Supabase',
    icon: Database,
    isProtected: false,
    showInSidebar: false,
    showInMobileNav: false,
    hideFromNav: true,
    category: 'admin',
  },

  {
    path: '/admin',
    component: Admin,
    title: 'Administration',
    description: 'Panneau d\'administration général',
    icon: Shield,
    isProtected: true,
    requiredRoles: ['super_admin', 'country_admin', 'editor'],
    showInSidebar: false,
    showInMobileNav: false,
    category: 'admin',
    univers: 'admin',
  },
  {
    path: '/admin/users',
    component: AdminUsers,
    title: 'Gestion des utilisateurs',
    description: 'Administration des comptes utilisateurs',
    icon: User,
    isProtected: true,
    requiredRoles: ['super_admin', 'country_admin', 'editor'],
    showInSidebar: false,
    showInMobileNav: false,
    hideFromNav: true,
    category: 'admin',
    univers: 'admin',
  },
  {
    path: '/admin/forum',
    component: AdminForum,
    title: 'Administration du forum',
    description: 'Modération et administration du forum',
    icon: MessageSquare,
    isProtected: true,
    requiredRoles: ['super_admin', 'country_admin', 'editor'],
    showInSidebar: false,
    showInMobileNav: false,
    hideFromNav: true,
    category: 'admin',
    univers: 'admin',
  },
  {
    path: '/admin/resources',
    component: AdminResources,
    title: 'Administration des ressources',
    description: 'Gestion et analytics des ressources de la bibliothèque',
    icon: BookOpen,
    isProtected: true,
    requiredRoles: ['super_admin', 'country_admin', 'editor'],
    showInSidebar: false,
    showInMobileNav: false,
    hideFromNav: true,
    category: 'admin',
    univers: 'admin',
  },
  {
    path: '/admin/dashboard',
    component: AdminDashboard,
    title: 'Tableau de Pilotage',
    description: 'Indicateurs de performance et outils d\'administration',
    icon: BarChart3,
    isProtected: true,
    requiredRoles: ['super_admin', 'country_admin'],
    showInSidebar: false,
    showInMobileNav: false,
    hideFromNav: true,
    category: 'admin',
    univers: 'admin',
  },
  {
    path: '/admin/focal-points',
    component: FocalPointsManagement,
    title: 'Points Focaux',
    description: 'Gestion des points focaux des États membres',
    icon: Users,
    isProtected: true,
    requiredRoles: ['super_admin', 'country_admin'],
    showInSidebar: false,
    showInMobileNav: false,
    hideFromNav: true,
    category: 'admin',
    univers: 'admin',
  },
  {
    path: '/focal-dashboard',
    component: FocalDashboard,
    title: 'Dashboard Point Focal',
    description: 'Tableau de bord pour les points focaux',
    icon: BarChart3,
    isProtected: true,
    requiredRoles: ['focal_point'],
    showInSidebar: true,
    showInMobileNav: true,
    category: 'main',
    univers: 'pilotage',
  },
  {
    path: '/admin/platform-config',
    component: PlatformConfig,
    title: 'Configuration Plateforme',
    description: 'Fiche de configuration initiale SUTEL Nexus',
    icon: Settings,
    isProtected: true,
    requiredRoles: ['super_admin'],
    showInSidebar: false,
    showInMobileNav: false,
    hideFromNav: true,
    category: 'admin',
    univers: 'admin',
  },
  {
    path: '/admin/translations',
    component: TranslationsExport,
    title: 'Export Traductions',
    description: 'Gérer et exporter toutes les traductions de la plateforme',
    icon: FileText,
    isProtected: true,
    requiredRoles: ['super_admin', 'country_admin'],
    showInSidebar: false,
    showInMobileNav: false,
    hideFromNav: true,
    category: 'admin',
    univers: 'admin',
  },
  {
    path: '/admin/i18n-qa',
    component: I18nQAChecklist,
    title: 'QA Checklist i18n',
    description: 'Vérification interactive des traductions et du support RTL',
    icon: FileText,
    isProtected: true,
    requiredRoles: ['super_admin', 'country_admin'],
    showInSidebar: false,
    showInMobileNav: false,
    hideFromNav: true,
    category: 'admin',
    univers: 'admin',
  },
  {
    path: '/admin/homepage-editor',
    component: HomepageEditor,
    title: 'Éditeur Homepage',
    description: 'Gestion du contenu multilingue de la page d\'accueil',
    icon: FileText,
    isProtected: true,
    requiredRoles: ['super_admin', 'country_admin'],
    showInSidebar: false,
    showInMobileNav: false,
    hideFromNav: true,
    category: 'admin',
    univers: 'admin',
  },
  {
    path: '/admin/content',
    component: ContentManager,
    title: 'Gestion du contenu',
    description: 'Paramètres du site, navigation et blocs CMS',
    icon: Settings,
    isProtected: true,
    requiredRoles: ['super_admin', 'country_admin', 'editor'],
    showInSidebar: false,
    showInMobileNav: false,
    hideFromNav: true,
    category: 'admin',
    univers: 'admin',
  },
];

const adminFeatureRoutes: RouteConfig[] = ADMIN_MENU_FEATURES.map((feature) => ({
  path: feature.path,
  component: AdminFeaturePage,
  title: feature.title,
  description: feature.description,
  icon: feature.icon,
  isProtected: true,
  requiredRoles: feature.roles,
  showInSidebar: false,
  showInMobileNav: false,
  category: "admin",
  univers: "admin",
}));

export const ROUTES: RouteConfig[] = [...STATIC_ROUTES, ...adminFeatureRoutes];

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
