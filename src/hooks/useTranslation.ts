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
  }
};

export type TranslationKey = keyof typeof translations.fr;

export const useTranslation = () => {
  const { preferences } = useUserPreferences();
  const currentLanguage = preferences.language;

  const t = (key: TranslationKey): string => {
    return translations[currentLanguage]?.[key] || translations.fr[key] || key;
  };

  return { t, currentLanguage };
};