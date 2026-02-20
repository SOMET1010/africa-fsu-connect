/**
 * Types pour la configuration initiale de la plateforme SUTEL Nexus
 */

export interface PlatformIdentity {
  platformName: string;
  acronym: string;
  slogan: string;
  url: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface InstitutionalPartner {
  name: string;
  acronym: string;
  role: 'main' | 'pilot' | 'partner';
  website: string;
  logoUrl: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface PlatformAdmin {
  role: 'super_admin' | 'technical_admin' | 'content_admin';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
}

export interface CountryConfig {
  code: string;
  name: string;
  region: string;
  status: 'active' | 'member' | 'onboarding' | 'observer';
  focalPointName?: string;
  focalPointEmail?: string;
}

export interface LanguageConfig {
  code: 'fr' | 'en' | 'ar' | 'pt';
  name: string;
  enabled: boolean;
  isDefault: boolean;
}

export interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
}

export interface EmailConfig {
  senderEmail: string;
  senderName: string;
  supportEmail: string;
  replyToEmail: string;
}

export interface ExternalIntegration {
  id: string;
  name: string;
  enabled: boolean;
  apiKey?: string;
  config?: Record<string, string>;
}

export interface DataImport {
  type: 'agencies' | 'indicators' | 'documents' | 'focal_points' | 'projects';
  format: 'csv' | 'excel' | 'json';
  fileUrl?: string;
  status: 'pending' | 'imported' | 'error';
}

export interface DeploymentMilestone {
  id: string;
  name: string;
  targetDate: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface ValidationSignature {
  role: string;
  name: string;
  organization: string;
  signedAt?: string;
  signature?: string;
}

export interface PlatformConfiguration {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  status: 'draft' | 'pending_validation' | 'validated' | 'deployed';
  
  // Sections
  identity: PlatformIdentity;
  partners: InstitutionalPartner[];
  admins: PlatformAdmin[];
  countries: CountryConfig[];
  languages: LanguageConfig[];
  modules: ModuleConfig[];
  email: EmailConfig;
  integrations: ExternalIntegration[];
  dataImports: DataImport[];
  milestones: DeploymentMilestone[];
  signatures: ValidationSignature[];
  
  // Notes additionnelles
  notes?: string;
}

// Configuration par défaut
export const DEFAULT_PLATFORM_CONFIG: PlatformConfiguration = {
  status: 'draft',
  identity: {
    platformName: 'USF Digital Connect Africa',
    acronym: 'UDC',
    slogan: 'Connecter les régulateurs africains du service universel',
    url: '',
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '#1E3A5F',
    secondaryColor: '#10B981',
  },
  partners: [
    {
      name: "Union Africaine des Télécommunications",
      acronym: "UAT",
      role: 'main',
      website: 'https://www.atuuat.africa',
      logoUrl: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
    },
    {
      name: "Agence Nationale du Service Universel des Télécommunications",
      acronym: "ANSUT",
      role: 'pilot',
      website: 'https://ansut.ci',
      logoUrl: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
    },
  ],
  admins: [
    {
      role: 'super_admin',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      organization: 'UAT',
    },
    {
      role: 'technical_admin',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      organization: '',
    },
  ],
  countries: [],
  languages: [
    { code: 'fr', name: 'Français', enabled: true, isDefault: true },
    { code: 'en', name: 'English', enabled: true, isDefault: false },
    { code: 'ar', name: 'العربية', enabled: true, isDefault: false },
    { code: 'pt', name: 'Português', enabled: true, isDefault: false },
  ],
  modules: [
    { id: 'members', name: 'Annuaire des membres', description: 'Liste des pays membres et profils', enabled: true, priority: 1 },
    { id: 'map', name: 'Carte interactive', description: 'Visualisation géographique des activités', enabled: true, priority: 2 },
    { id: 'documents', name: 'Bibliothèque documentaire', description: 'Partage de ressources et documents', enabled: true, priority: 3 },
    { id: 'forum', name: 'Forum de discussion', description: 'Échanges entre membres', enabled: true, priority: 4 },
    { id: 'indicators', name: 'Base d\'indicateurs', description: 'Suivi des indicateurs FSU', enabled: true, priority: 5 },
    { id: 'elearning', name: 'E-Learning', description: 'Formations en ligne', enabled: false, priority: 6 },
    { id: 'events', name: 'Événements', description: 'Calendrier et inscriptions', enabled: true, priority: 7 },
    { id: 'chat', name: 'Messagerie points focaux', description: 'Communication sécurisée', enabled: true, priority: 8 },
    { id: 'analytics', name: 'Tableaux de bord', description: 'Statistiques et analyses', enabled: true, priority: 9 },
  ],
  email: {
    senderEmail: 'noreply@sutel-nexus.org',
    senderName: 'SUTEL Nexus',
    supportEmail: 'support@sutel-nexus.org',
    replyToEmail: 'contact@sutel-nexus.org',
  },
  integrations: [
    { id: 'google_analytics', name: 'Google Analytics', enabled: false },
    { id: 'mailjet', name: 'Mailjet (Emailing)', enabled: false },
    { id: 'google_oauth', name: 'Google OAuth', enabled: false },
  ],
  dataImports: [
    { type: 'agencies', format: 'excel', status: 'pending' },
    { type: 'indicators', format: 'excel', status: 'pending' },
    { type: 'focal_points', format: 'excel', status: 'pending' },
  ],
  milestones: [
    { id: 'kickoff', name: 'Réunion de lancement', targetDate: '', status: 'pending' },
    { id: 'config_validation', name: 'Validation configuration', targetDate: '', status: 'pending' },
    { id: 'data_import', name: 'Import des données initiales', targetDate: '', status: 'pending' },
    { id: 'pilot_test', name: 'Tests pilotes (5 pays)', targetDate: '', status: 'pending' },
    { id: 'training', name: 'Formation administrateurs', targetDate: '', status: 'pending' },
    { id: 'launch', name: 'Lancement officiel', targetDate: '', status: 'pending' },
  ],
  signatures: [
    { role: 'Représentant UAT', name: '', organization: 'UAT' },
    { role: 'Représentant ANSUT', name: '', organization: 'ANSUT' },
    { role: 'Chef de projet technique', name: '', organization: '' },
  ],
};
