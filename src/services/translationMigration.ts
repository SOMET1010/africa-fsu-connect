import { supabase } from '@/integrations/supabase/client';

// Original translations to migrate
const originalTranslations = {
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de Bord',
    'nav.projects': 'Projets FSU',
    'nav.resources': 'Bibliothèque de Ressources',
    'nav.forum': 'Forum de Discussion',
    'nav.submit': 'Formulaires de Soumission',
    'nav.events': 'Agenda des Événements',
    'nav.profile': 'Profil Utilisateur',
    'nav.admin': 'Administration',
    'nav.organizations': 'Organisations',
    'nav.indicators': 'Indicateurs USF',
    'nav.map': 'Carte Interactive',
    'nav.security': 'Sécurité',
    'nav.preferences': 'Préférences',
    
    // Dashboard
    'dashboard.title': 'Tableau de Bord',
    'dashboard.subtitle': 'Bienvenue sur votre tableau de bord FSU',
    'dashboard.welcome': 'Bienvenue',
    'dashboard.stats.projects': 'Projets Actifs',
    'dashboard.stats.documents': 'Documents',
    'dashboard.stats.events': 'Événements',
    'dashboard.stats.users': 'Utilisateurs',
    'dashboard.quickActions': 'Actions Rapides',
    'dashboard.recentActivity': 'Activité Récente',
    'dashboard.notifications': 'Notifications',
    
    // Common
    'common.loading': 'Chargement...',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.view': 'Voir',
    'common.add': 'Ajouter',
    'common.create': 'Créer',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.close': 'Fermer',
    'common.open': 'Ouvrir',
    'common.download': 'Télécharger',
    'common.upload': 'Téléverser',
    'common.submit': 'Soumettre',
    
    // Submit page
    'submit.title': 'Formulaires de Soumission',
    'submit.subtitle': 'Soumettez vos contributions et projets FSU',
    'submit.mySubmissions': 'Mes Soumissions',
    'submit.newSubmission': 'Nouvelle Soumission',
    'submit.types.project': 'Fiche Projet FSU',
    'submit.types.position': 'Position Commune',
    'submit.types.report': 'Rapport d\'Activité',
    'submit.types.proposal': 'Proposition Technique',
    'submit.form.title': 'Titre de la soumission',
    'submit.form.description': 'Description détaillée',
    'submit.form.category': 'Catégorie',
    'submit.form.attachments': 'Pièces jointes',
    'submit.status.draft': 'Brouillon',
    'submit.status.submitted': 'Soumis',
    'submit.status.inReview': 'En révision',
    'submit.status.approved': 'Approuvé',
    'submit.status.rejected': 'Rejeté',
    
    // Forum
    'forum.title': 'Forum de Discussion',
    'forum.subtitle': 'Échangez avec la communauté FSU',
    'forum.allDiscussions': 'Toutes les discussions',
    'forum.myPosts': 'Mes publications',
    'forum.newDiscussion': 'Nouvelle discussion',
    'forum.categories': 'Catégories',
    'forum.trending': 'Tendances',
    'forum.recent': 'Récent',
    'forum.replies': 'Réponses',
    'forum.views': 'Vues',
    'forum.lastActivity': 'Dernière activité',
    
    // Resources
    'resources.title': 'Centre de Ressources FSU',
    'resources.subtitle': 'Accédez à tous les documents et ressources FSU',
    'resources.documentsAvailable': 'Documents Disponibles',
    'resources.downloadAll': 'Télécharger tout',
    'resources.addDocument': 'Ajouter un document',
    'resources.categories.all': 'Tous',
    'resources.categories.reports': 'Rapports',
    'resources.categories.guides': 'Guides',
    'resources.categories.forms': 'Formulaires',
    'resources.categories.policies': 'Politiques',
    
    // Profile
    'profile.title': 'Profil Utilisateur',
    'profile.personalInfo': 'Informations personnelles',
    'profile.preferences': 'Préférences',
    'profile.security': 'Sécurité',
    'profile.activity': 'Activité',
    
    // Auth
    'auth.login': 'Connexion',
    'auth.logout': 'Déconnexion',
    'auth.register': 'Inscription',
    'auth.email': 'Adresse e-mail',
    'auth.password': 'Mot de passe',
    'auth.forgotPassword': 'Mot de passe oublié ?',
    
    // Forms
    'forms.required': 'Champ obligatoire',
    'forms.invalid': 'Format invalide',
    'forms.placeholder.search': 'Rechercher...',
    'forms.placeholder.email': 'votre@email.com',
    'forms.placeholder.title': 'Saisissez un titre',
    'forms.placeholder.description': 'Décrivez votre soumission',
    
    // Errors
    'error.generic': 'Une erreur est survenue',
    'error.network': 'Erreur de connexion',
    'error.notFound': 'Page non trouvée',
    'error.unauthorized': 'Accès non autorisé',
    'error.forbidden': 'Accès interdit',
    
    // Success
    'success.saved': 'Enregistré avec succès',
    'success.deleted': 'Supprimé avec succès',
    'success.submitted': 'Soumis avec succès',
    'success.updated': 'Mis à jour avec succès'
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.projects': 'USF Projects',
    'nav.resources': 'Resource Library',
    'nav.forum': 'Discussion Forum',
    'nav.submit': 'Submission Forms',
    'nav.events': 'Events Calendar',
    'nav.profile': 'User Profile',
    'nav.admin': 'Administration',
    'nav.organizations': 'Organizations',
    'nav.indicators': 'USF Indicators',
    'nav.map': 'Interactive Map',
    'nav.security': 'Security',
    'nav.preferences': 'Preferences',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Welcome to your USF dashboard',
    'dashboard.welcome': 'Welcome',
    'dashboard.stats.projects': 'Active Projects',
    'dashboard.stats.documents': 'Documents',
    'dashboard.stats.events': 'Events',
    'dashboard.stats.users': 'Users',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.notifications': 'Notifications',
    
    // Common
    'common.loading': 'Loading...',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.add': 'Add',
    'common.create': 'Create',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
    'common.open': 'Open',
    'common.download': 'Download',
    'common.upload': 'Upload',
    'common.submit': 'Submit',
    
    // Submit page
    'submit.title': 'Submission Forms',
    'submit.subtitle': 'Submit your USF contributions and projects',
    'submit.mySubmissions': 'My Submissions',
    'submit.newSubmission': 'New Submission',
    'submit.types.project': 'USF Project Form',
    'submit.types.position': 'Common Position',
    'submit.types.report': 'Activity Report',
    'submit.types.proposal': 'Technical Proposal',
    'submit.form.title': 'Submission title',
    'submit.form.description': 'Detailed description',
    'submit.form.category': 'Category',
    'submit.form.attachments': 'Attachments',
    'submit.status.draft': 'Draft',
    'submit.status.submitted': 'Submitted',
    'submit.status.inReview': 'In Review',
    'submit.status.approved': 'Approved',
    'submit.status.rejected': 'Rejected',
    
    // Forum
    'forum.title': 'Discussion Forum',
    'forum.subtitle': 'Connect with the USF community',
    'forum.allDiscussions': 'All discussions',
    'forum.myPosts': 'My posts',
    'forum.newDiscussion': 'New discussion',
    'forum.categories': 'Categories',
    'forum.trending': 'Trending',
    'forum.recent': 'Recent',
    'forum.replies': 'Replies',
    'forum.views': 'Views',
    'forum.lastActivity': 'Last activity',
    
    // Resources
    'resources.title': 'USF Resource Center',
    'resources.subtitle': 'Access all USF documents and resources',
    'resources.documentsAvailable': 'Available Documents',
    'resources.downloadAll': 'Download all',
    'resources.addDocument': 'Add document',
    'resources.categories.all': 'All',
    'resources.categories.reports': 'Reports',
    'resources.categories.guides': 'Guides',
    'resources.categories.forms': 'Forms',
    'resources.categories.policies': 'Policies',
    
    // Profile
    'profile.title': 'User Profile',
    'profile.personalInfo': 'Personal information',
    'profile.preferences': 'Preferences',
    'profile.security': 'Security',
    'profile.activity': 'Activity',
    
    // Auth
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.register': 'Register',
    'auth.email': 'Email address',
    'auth.password': 'Password',
    'auth.forgotPassword': 'Forgot password?',
    
    // Forms
    'forms.required': 'Required field',
    'forms.invalid': 'Invalid format',
    'forms.placeholder.search': 'Search...',
    'forms.placeholder.email': 'your@email.com',
    'forms.placeholder.title': 'Enter a title',
    'forms.placeholder.description': 'Describe your submission',
    
    // Errors
    'error.generic': 'An error occurred',
    'error.network': 'Connection error',
    'error.notFound': 'Page not found',
    'error.unauthorized': 'Unauthorized access',
    'error.forbidden': 'Access forbidden',
    
    // Success
    'success.saved': 'Successfully saved',
    'success.deleted': 'Successfully deleted',
    'success.submitted': 'Successfully submitted',
    'success.updated': 'Successfully updated'
  }
};

export const migrateTranslations = async () => {
  try {
    console.log('Starting translation migration...');
    
    // Get language and namespace IDs
    const { data: languages } = await supabase
      .from('languages')
      .select('*');
    
    const { data: namespaces } = await supabase
      .from('translation_namespaces')
      .select('*');
    
    if (!languages || !namespaces) {
      throw new Error('Failed to fetch languages or namespaces');
    }
    
    const frLanguage = languages.find(l => l.code === 'fr');
    const enLanguage = languages.find(l => l.code === 'en');
    
    if (!frLanguage || !enLanguage) {
      throw new Error('French or English language not found');
    }
    
    // Map namespace names to IDs
    const namespaceMap = Object.fromEntries(
      namespaces.map(ns => [ns.name, ns.id])
    );
    
    // Function to get namespace from translation key
    const getNamespace = (key: string): string => {
      if (key.startsWith('nav.')) return 'navigation';
      if (key.startsWith('dashboard.')) return 'dashboard';
      if (key.startsWith('submit.')) return 'submit';
      if (key.startsWith('forum.')) return 'forum';
      if (key.startsWith('resources.')) return 'resources';
      if (key.startsWith('profile.')) return 'profile';
      if (key.startsWith('auth.')) return 'auth';
      if (key.startsWith('forms.')) return 'forms';
      if (key.startsWith('error.')) return 'errors';
      if (key.startsWith('success.')) return 'success';
      if (key.startsWith('common.')) return 'common';
      return 'common';
    };
    
    // Prepare translations for insertion
    const translationsToInsert = [];
    
    // Process French translations
    for (const [key, value] of Object.entries(originalTranslations.fr)) {
      const namespace = getNamespace(key);
      translationsToInsert.push({
        language_id: frLanguage.id,
        namespace_id: namespaceMap[namespace],
        key,
        value,
        is_approved: true
      });
    }
    
    // Process English translations
    for (const [key, value] of Object.entries(originalTranslations.en)) {
      const namespace = getNamespace(key);
      translationsToInsert.push({
        language_id: enLanguage.id,
        namespace_id: namespaceMap[namespace],
        key,
        value,
        is_approved: true
      });
    }
    
    // Insert translations in batches
    const batchSize = 50;
    for (let i = 0; i < translationsToInsert.length; i += batchSize) {
      const batch = translationsToInsert.slice(i, i + batchSize);
      const { error } = await supabase
        .from('translations')
        .insert(batch);
      
      if (error) {
        console.error('Error inserting batch:', error);
        throw error;
      }
    }
    
    console.log(`Migration completed! Inserted ${translationsToInsert.length} translations.`);
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};