
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

// Dictionnaire de traductions
const translations = {
  fr: {
    // Navigation et interface générale
    'nav.dashboard': 'Tableau de bord',
    'nav.organizations': 'Organisations',
    'nav.projects': 'Projets',
    'nav.resources': 'Ressources',
    'nav.events': 'Événements',
    'nav.forum': 'Forum',
    'nav.map': 'Carte',
    'nav.security': 'Sécurité',
    'nav.admin': 'Administration',
    'nav.profile': 'Profil',
    'nav.settings': 'Paramètres',
    'nav.logout': 'Se déconnecter',
    'nav.start': 'Commencer',

    // Textes communs
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.view': 'Voir',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.all': 'Tous',
    'common.close': 'Fermer',
    'common.discover': 'Découvrir',
    'common.learn.more': 'En Savoir Plus',
    'common.get.started': 'Commencer maintenant',
    'common.create.account': 'Créer un Compte',
    'common.explore.projects': 'Explorer les projets',
    'common.countries': 'pays',
    'common.projects': 'projets',

    // Auth
    'auth.login': 'Se connecter',
    'auth.logout.success': 'Déconnexion réussie',
    'auth.logout.goodbye': 'À bientôt !',
    'auth.logout.error': 'Impossible de se déconnecter',

    // SUTEL
    'sutel.title': 'Réseau SUTEL Africain',
    'sutel.subtitle': 'Agences spécialisées dans le Service Universel des Télécommunications en Afrique',
    'sutel.interactive.map': 'Carte Interactive SUTEL - Aperçu rapide',
    'sutel.fullscreen': 'Voir en plein écran',

    // Resources/Docs
    'resources.title': 'Bibliothèque de Ressources',
    'resources.subtitle': 'Guides, rapports et meilleures pratiques',
    'resources.upload': 'Télécharger un document',
    'resources.categories': 'Catégories',
    'resources.recent': 'Documents récents',
    'resources.no.docs': 'Aucun document trouvé',
    'resources.upload.success': 'Document téléchargé avec succès',

    // Landing page - Hero Section
    'hero.badge': 'Plateforme Collaborative Africaine',
    'hero.title.line1': 'Fonds du Service',
    'hero.title.line2': 'Universel Afrique',
    'hero.subtitle': 'Unissons nos forces pour une connectivité universelle et inclusive à travers le continent africain',
    'hero.stats.countries': 'Pays',
    'hero.stats.projects': 'Projets',
    'hero.stats.organizations': 'Organisations',
    'hero.stats.beneficiaries': 'Bénéficiaires',

    // Landing page - Features
    'features.badge': 'Écosystème Intégré',
    'features.title': 'Une Plateforme Complète pour la Collaboration',
    'features.subtitle': 'Tous les outils nécessaires pour coordonner, partager et accélérer les initiatives FSU',
    'features.fsu.projects': 'Projets FSU',
    'features.fsu.projects.desc': 'Suivi et gestion collaborative des initiatives de service universel',
    'features.fsu.projects.highlight1': 'Gestion de projet',
    'features.fsu.projects.highlight2': 'Suivi en temps réel',
    'features.fsu.projects.highlight3': 'Rapports automatisés',
    'features.shared.resources': 'Ressources Partagées',
    'features.shared.resources.desc': 'Bibliothèque de guides, rapports et meilleures pratiques',
    'features.shared.resources.highlight1': 'Guides pratiques',
    'features.shared.resources.highlight2': 'Études de cas',
    'features.shared.resources.highlight3': 'Documentation technique',
    'features.organizations.directory': 'Répertoire d\'Organisations',
    'features.organizations.directory.desc': 'Cartographie interactive des agences FSU et partenaires',
    'features.organizations.directory.highlight1': 'Carte interactive',
    'features.organizations.directory.highlight2': 'Profils détaillés',
    'features.organizations.directory.highlight3': 'Coordination facilitée',
    'features.collaborative.forum': 'Forum Collaboratif',
    'features.collaborative.forum.desc': 'Espace d\'échange d\'expériences et de coordination',
    'features.collaborative.forum.highlight1': 'Discussions thématiques',
    'features.collaborative.forum.highlight2': 'Expertise partagée',
    'features.collaborative.forum.highlight3': 'Réseau professionnel',
    'features.events.training': 'Événements & Formation',
    'features.events.training.desc': 'Agenda collaboratif et modules d\'apprentissage',
    'features.events.training.highlight1': 'Formations en ligne',
    'features.events.training.highlight2': 'Webinaires',
    'features.events.training.highlight3': 'Rencontres régionales',
    'features.analytics.reporting': 'Analytics & Reporting',
    'features.analytics.reporting.desc': 'Tableaux de bord et analyses de performance',
    'features.analytics.reporting.highlight1': 'Métriques clés',
    'features.analytics.reporting.highlight2': 'Analyses régionales',
    'features.analytics.reporting.highlight3': 'Rapports personnalisés',

    // Landing page - Regions
    'regions.badge': 'Collaboration Régionale',
    'regions.title': 'Communautés Économiques Africaines',
    'regions.subtitle': 'Coordination active à travers les cinq principales régions du continent',

    // Landing page - CTA
    'cta.title': 'Rejoignez la Transformation Numérique de l\'Afrique',
    'cta.subtitle': 'Ensemble, construisons un écosystème numérique inclusif et durable',

    // Landing page
    'landing.title': 'Plateforme FSU Afrique',
    'landing.subtitle': 'Réseau collaboratif des Fonds de Service Universel africains',
  },
  en: {
    // Navigation and general interface
    'nav.dashboard': 'Dashboard',
    'nav.organizations': 'Organizations',
    'nav.projects': 'Projects',
    'nav.resources': 'Resources',
    'nav.events': 'Events',
    'nav.forum': 'Forum',
    'nav.map': 'Map',
    'nav.security': 'Security',
    'nav.admin': 'Administration',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    'nav.start': 'Get Started',

    // Common texts
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.all': 'All',
    'common.close': 'Close',
    'common.discover': 'Discover',
    'common.learn.more': 'Learn More',
    'common.get.started': 'Get Started',
    'common.create.account': 'Create Account',
    'common.explore.projects': 'Explore Projects',
    'common.countries': 'countries',
    'common.projects': 'projects',

    // Auth
    'auth.login': 'Login',
    'auth.logout.success': 'Successfully logged out',
    'auth.logout.goodbye': 'See you soon!',
    'auth.logout.error': 'Unable to logout',

    // SUTEL
    'sutel.title': 'African SUTEL Network',
    'sutel.subtitle': 'Agencies specialized in Universal Telecommunications Services in Africa',
    'sutel.interactive.map': 'SUTEL Interactive Map - Quick Preview',
    'sutel.fullscreen': 'View fullscreen',

    // Resources/Docs
    'resources.title': 'Resource Library',
    'resources.subtitle': 'Guides, reports and best practices',
    'resources.upload': 'Upload document',
    'resources.categories': 'Categories',
    'resources.recent': 'Recent documents',
    'resources.no.docs': 'No documents found',
    'resources.upload.success': 'Document uploaded successfully',

    // Landing page - Hero Section
    'hero.badge': 'African Collaborative Platform',
    'hero.title.line1': 'Universal Service',
    'hero.title.line2': 'Fund Africa',
    'hero.subtitle': 'Unite our forces for universal and inclusive connectivity across the African continent',
    'hero.stats.countries': 'Countries',
    'hero.stats.projects': 'Projects',
    'hero.stats.organizations': 'Organizations',
    'hero.stats.beneficiaries': 'Beneficiaries',

    // Landing page - Features
    'features.badge': 'Integrated Ecosystem',
    'features.title': 'A Complete Platform for Collaboration',
    'features.subtitle': 'All the necessary tools to coordinate, share and accelerate USF initiatives',
    'features.fsu.projects': 'USF Projects',
    'features.fsu.projects.desc': 'Collaborative tracking and management of universal service initiatives',
    'features.fsu.projects.highlight1': 'Project management',
    'features.fsu.projects.highlight2': 'Real-time tracking',
    'features.fsu.projects.highlight3': 'Automated reports',
    'features.shared.resources': 'Shared Resources',
    'features.shared.resources.desc': 'Library of guides, reports and best practices',
    'features.shared.resources.highlight1': 'Practical guides',
    'features.shared.resources.highlight2': 'Case studies',
    'features.shared.resources.highlight3': 'Technical documentation',
    'features.organizations.directory': 'Organizations Directory',
    'features.organizations.directory.desc': 'Interactive mapping of USF agencies and partners',
    'features.organizations.directory.highlight1': 'Interactive map',
    'features.organizations.directory.highlight2': 'Detailed profiles',
    'features.organizations.directory.highlight3': 'Facilitated coordination',
    'features.collaborative.forum': 'Collaborative Forum',
    'features.collaborative.forum.desc': 'Space for sharing experiences and coordination',
    'features.collaborative.forum.highlight1': 'Thematic discussions',
    'features.collaborative.forum.highlight2': 'Shared expertise',
    'features.collaborative.forum.highlight3': 'Professional network',
    'features.events.training': 'Events & Training',
    'features.events.training.desc': 'Collaborative agenda and learning modules',
    'features.events.training.highlight1': 'Online training',
    'features.events.training.highlight2': 'Webinars',
    'features.events.training.highlight3': 'Regional meetings',
    'features.analytics.reporting': 'Analytics & Reporting',
    'features.analytics.reporting.desc': 'Dashboards and performance analytics',
    'features.analytics.reporting.highlight1': 'Key metrics',
    'features.analytics.reporting.highlight2': 'Regional analysis',
    'features.analytics.reporting.highlight3': 'Custom reports',

    // Landing page - Regions
    'regions.badge': 'Regional Collaboration',
    'regions.title': 'African Economic Communities',
    'regions.subtitle': 'Active coordination across the five main regions of the continent',

    // Landing page - CTA
    'cta.title': 'Join Africa\'s Digital Transformation',
    'cta.subtitle': 'Together, let\'s build an inclusive and sustainable digital ecosystem',

    // Landing page
    'landing.title': 'USF Africa Platform',
    'landing.subtitle': 'Collaborative network of African Universal Service Funds',
  }
};

export type TranslationKey = keyof typeof translations.fr;

export const useTranslation = () => {
  const { preferences } = useUserPreferences();
  const currentLanguage = preferences.language;

  const t = (key: TranslationKey): string => {
    const translation = translations[currentLanguage]?.[key] || translations.fr[key] || key;
    console.log(`Translation: ${key} -> ${translation} (lang: ${currentLanguage})`);
    return translation;
  };

  return { t, currentLanguage };
};
