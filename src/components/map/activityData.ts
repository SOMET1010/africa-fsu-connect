// Simulated activity data - will be replaced by real data from database
import type { CountryStatus } from '@/types/countryStatus';

export type ActivityLevel = 'high' | 'medium' | 'onboarding' | 'observer';
export type MapMode = 'members' | 'projects' | 'trends';

export interface CountryActivity {
  contributions: number;
  projects: number;
  resources: number;
  trendScore: number; // 0-100
  level: ActivityLevel;
  status: CountryStatus;
  lastActivity: string;
  recentActions: string[];
}

// Activity level configuration with semantic colors
export const ACTIVITY_LEVELS: Record<ActivityLevel, { color: string; label: string; threshold: number }> = {
  high: { 
    color: '#10B981', // Green - très actif
    label: 'Très actif', 
    threshold: 15 
  },
  medium: { 
    color: '#3B82F6', // Blue - actif
    label: 'Actif', 
    threshold: 8 
  },
  onboarding: { 
    color: '#F59E0B', // Amber - en intégration
    label: 'En intégration', 
    threshold: 3 
  },
  observer: { 
    color: '#9CA3AF', // Gray - observateur
    label: 'Observateur', 
    threshold: 0 
  },
} as const;

// Simulated activity data per country (to be replaced by real DB data)
const COUNTRY_ACTIVITY_DATA: Record<string, CountryActivity> = {
  // Très actifs
  SN: { 
    contributions: 14, 
    projects: 5,
    resources: 3,
    trendScore: 85,
    level: 'high',
    status: 'active',
    lastActivity: 'il y a 2 jours',
    recentActions: [
      "Projet fibre rurale partagé",
      "Participation atelier régional",
      "Document stratégique publié"
    ]
  },
  CI: { 
    contributions: 22, 
    projects: 8,
    resources: 4,
    trendScore: 92,
    level: 'high',
    status: 'active',
    lastActivity: 'il y a 1 jour',
    recentActions: [
      "Lancement programme écoles connectées",
      "Best practice télémédecine",
      "Webinaire sur la régulation"
    ]
  },
  KE: { 
    contributions: 18, 
    projects: 6,
    resources: 5,
    trendScore: 88,
    level: 'high',
    status: 'active',
    lastActivity: 'il y a 3 jours',
    recentActions: [
      "Initiative mobile money",
      "Partage données couverture",
      "Collaboration transfrontalière"
    ]
  },
  MA: { 
    contributions: 16, 
    projects: 4,
    resources: 6,
    trendScore: 78,
    level: 'high',
    status: 'active',
    lastActivity: 'il y a 4 jours',
    recentActions: [
      "Programme villages connectés",
      "Formation en ligne partagée",
      "Étude de marché publiée"
    ]
  },
  
  // Actifs
  CM: { 
    contributions: 11, 
    projects: 3,
    resources: 2,
    trendScore: 65,
    level: 'medium',
    status: 'member',
    lastActivity: 'il y a 5 jours',
    recentActions: [
      "Projet backbone national",
      "Participation groupe de travail"
    ]
  },
  GH: { 
    contributions: 9, 
    projects: 2,
    resources: 3,
    trendScore: 58,
    level: 'medium',
    status: 'member',
    lastActivity: 'il y a 6 jours',
    recentActions: [
      "Programme inclusion numérique",
      "Documentation partagée"
    ]
  },
  RW: { 
    contributions: 10, 
    projects: 4,
    resources: 1,
    trendScore: 72,
    level: 'medium',
    status: 'member',
    lastActivity: 'il y a 4 jours',
    recentActions: [
      "Initiative smart villages",
      "Partage d'expérience 4G"
    ]
  },
  TZ: { 
    contributions: 12, 
    projects: 3,
    resources: 2,
    trendScore: 62,
    level: 'medium',
    status: 'member',
    lastActivity: 'il y a 7 jours',
    recentActions: [
      "Projet zones rurales",
      "Collaboration régionale"
    ]
  },
  ZA: { 
    contributions: 13, 
    projects: 5,
    resources: 4,
    trendScore: 70,
    level: 'medium',
    status: 'member',
    lastActivity: 'il y a 3 jours',
    recentActions: [
      "Infrastructure partagée",
      "Formation technique"
    ]
  },
  NG: { 
    contributions: 14, 
    projects: 4,
    resources: 3,
    trendScore: 68,
    level: 'medium',
    status: 'member',
    lastActivity: 'il y a 5 jours',
    recentActions: [
      "Expansion réseau rural",
      "Partenariat public-privé"
    ]
  },
  EG: { 
    contributions: 11, 
    projects: 3,
    resources: 2,
    trendScore: 55,
    level: 'medium',
    status: 'member',
    lastActivity: 'il y a 8 jours',
    recentActions: [
      "Projet câble sous-marin",
      "Hub régional data"
    ]
  },
  
  // En intégration (onboarding)
  ML: { 
    contributions: 5, 
    projects: 1,
    resources: 1,
    trendScore: 35,
    level: 'onboarding',
    status: 'onboarding',
    lastActivity: 'il y a 2 semaines',
    recentActions: [
      "Première contribution réseau"
    ]
  },
  BF: {
    contributions: 4, 
    projects: 1,
    resources: 0,
    trendScore: 28,
    level: 'onboarding',
    status: 'onboarding',
    lastActivity: 'il y a 3 semaines',
    recentActions: [
      "Demande d'adhésion active"
    ]
  },
  TN: { 
    contributions: 6, 
    projects: 2,
    resources: 1,
    trendScore: 42,
    level: 'onboarding',
    status: 'onboarding',
    lastActivity: 'il y a 10 jours',
    recentActions: [
      "Participation forum régional"
    ]
  },
  DZ: { 
    contributions: 5, 
    projects: 1,
    resources: 1,
    trendScore: 38,
    level: 'onboarding',
    status: 'onboarding',
    lastActivity: 'il y a 2 semaines',
    recentActions: [
      "Projet pilote en cours"
    ]
  },
  ET: { 
    contributions: 7, 
    projects: 2,
    resources: 1,
    trendScore: 45,
    level: 'onboarding',
    status: 'onboarding',
    lastActivity: 'il y a 1 semaine',
    recentActions: [
      "Initiative télécoms rurales"
    ]
  },
  UG: { 
    contributions: 6, 
    projects: 1,
    resources: 2,
    trendScore: 40,
    level: 'onboarding',
    status: 'onboarding',
    lastActivity: 'il y a 12 jours',
    recentActions: [
      "Programme villages connectés"
    ]
  },
  NE: { 
    contributions: 3, 
    projects: 0,
    resources: 1,
    trendScore: 22,
    level: 'onboarding',
    status: 'onboarding',
    lastActivity: 'il y a 1 mois',
    recentActions: [
      "Évaluation besoins en cours"
    ]
  },
  TD: { 
    contributions: 2, 
    projects: 0,
    resources: 0,
    trendScore: 15,
    level: 'observer',
    status: 'observer',
    lastActivity: 'il y a 6 semaines',
    recentActions: [
      "Contact initial établi"
    ]
  },
  CG: { 
    contributions: 4, 
    projects: 1,
    resources: 0,
    trendScore: 30,
    level: 'onboarding',
    status: 'onboarding',
    lastActivity: 'il y a 3 semaines',
    recentActions: [
      "Projet fibre en discussion"
    ]
  },
  CD: { 
    contributions: 3, 
    projects: 0,
    resources: 1,
    trendScore: 25,
    level: 'onboarding',
    status: 'onboarding',
    lastActivity: 'il y a 1 mois',
    recentActions: [
      "Participation observation"
    ]
  },
  GA: { 
    contributions: 5, 
    projects: 1,
    resources: 1,
    trendScore: 32,
    level: 'onboarding',
    status: 'onboarding',
    lastActivity: 'il y a 2 semaines',
    recentActions: [
      "Intérêt pour best practices"
    ]
  },
  BJ: { 
    contributions: 6, 
    projects: 2,
    resources: 1,
    trendScore: 38,
    level: 'onboarding',
    status: 'onboarding',
    lastActivity: 'il y a 10 jours',
    recentActions: [
      "Projet écoles connectées"
    ]
  },
  TG: { 
    contributions: 4, 
    projects: 1,
    resources: 0,
    trendScore: 28,
    level: 'onboarding',
    status: 'onboarding',
    lastActivity: 'il y a 3 semaines',
    recentActions: [
      "Demande de collaboration"
    ]
  },
  ZM: { 
    contributions: 5, 
    projects: 1,
    resources: 1,
    trendScore: 35,
    level: 'onboarding',
    status: 'onboarding',
    lastActivity: 'il y a 2 semaines',
    recentActions: [
      "Programme backbone rural"
    ]
  },
  ZW: { 
    contributions: 4, 
    projects: 1,
    resources: 0,
    trendScore: 30,
    level: 'onboarding',
    status: 'onboarding',
    lastActivity: 'il y a 3 semaines',
    recentActions: [
      "Initiative numérique"
    ]
  },
  MZ: { 
    contributions: 3, 
    projects: 0,
    resources: 1,
    trendScore: 22,
    level: 'onboarding',
    status: 'onboarding',
    lastActivity: 'il y a 1 mois',
    recentActions: [
      "Évaluation en cours"
    ]
  },
  AO: { 
    contributions: 5, 
    projects: 1,
    resources: 1,
    trendScore: 33,
    level: 'onboarding',
    status: 'onboarding',
    lastActivity: 'il y a 2 semaines',
    recentActions: [
      "Projet infrastructure"
    ]
  },
  NA: { 
    contributions: 4, 
    projects: 1,
    resources: 0,
    trendScore: 28,
    level: 'onboarding',
    status: 'onboarding',
    lastActivity: 'il y a 3 semaines',
    recentActions: [
      "Partenariat régional"
    ]
  },
  BW: { 
    contributions: 6, 
    projects: 2,
    resources: 1,
    trendScore: 40,
    level: 'onboarding',
    status: 'onboarding',
    lastActivity: 'il y a 10 jours',
    recentActions: [
      "Smart villages initiative"
    ]
  },
  MG: { 
    contributions: 3, 
    projects: 0,
    resources: 1,
    trendScore: 20,
    level: 'onboarding',
    status: 'onboarding',
    lastActivity: 'il y a 1 mois',
    recentActions: [
      "Connectivité îles"
    ]
  },
  MU: { 
    contributions: 7, 
    projects: 2,
    resources: 2,
    trendScore: 48,
    level: 'onboarding',
    status: 'onboarding',
    lastActivity: 'il y a 1 semaine',
    recentActions: [
      "Hub numérique régional"
    ]
  },
  // Observateurs (observer)
  SO: { 
    contributions: 1, 
    projects: 0,
    resources: 0,
    trendScore: 10,
    level: 'observer',
    status: 'observer',
    lastActivity: 'il y a 2 mois',
    recentActions: [
      "Demande d'adhésion soumise"
    ]
  },
  ER: { 
    contributions: 1, 
    projects: 0,
    resources: 0,
    trendScore: 8,
    level: 'observer',
    status: 'observer',
    lastActivity: 'il y a 2 mois',
    recentActions: [
      "Premier contact établi"
    ]
  },
};

// Default activity for countries not in the list
const DEFAULT_ACTIVITY: CountryActivity = {
  contributions: 1,
  projects: 0,
  resources: 0,
  trendScore: 5,
  level: 'observer',
  status: 'observer',
  lastActivity: 'En cours d\'intégration',
  recentActions: ["En cours d'intégration au réseau"]
};

export const getCountryActivity = (countryCode: string): CountryActivity => {
  return COUNTRY_ACTIVITY_DATA[countryCode.toUpperCase()] || DEFAULT_ACTIVITY;
};

export const getActivityColor = (level: ActivityLevel): string => {
  return ACTIVITY_LEVELS[level].color;
};

export const getActivityLabel = (level: ActivityLevel): string => {
  return ACTIVITY_LEVELS[level].label;
};

export const getStatusLabel = (status: CountryStatus): string => {
  const labels: Record<CountryStatus, string> = {
    active: 'Membre actif',
    member: 'Membre',
    onboarding: 'En intégration',
    observer: 'Observateur'
  };
  return labels[status];
};

// Get display value based on map mode
export const getValueByMode = (activity: CountryActivity, mode: MapMode): number => {
  switch (mode) {
    case 'projects': return activity.projects;
    case 'trends': return activity.trendScore;
    default: return activity.contributions;
  }
};

export const getLabelByMode = (mode: MapMode): string => {
  switch (mode) {
    case 'projects': return 'projets partagés';
    case 'trends': return '% dynamique';
    default: return 'contributions';
  }
};

// Calculate global stats from activity data
export const getGlobalStats = () => {
  const countries = Object.keys(COUNTRY_ACTIVITY_DATA);
  const totalContributions = Object.values(COUNTRY_ACTIVITY_DATA).reduce(
    (sum, data) => sum + data.contributions, 0
  );
  const totalProjects = Object.values(COUNTRY_ACTIVITY_DATA).reduce(
    (sum, data) => sum + data.projects, 0
  );
  const activeCountries = countries.filter(
    code => COUNTRY_ACTIVITY_DATA[code].level === 'high' || COUNTRY_ACTIVITY_DATA[code].level === 'medium'
  ).length;
  const avgTrendScore = Math.round(
    Object.values(COUNTRY_ACTIVITY_DATA).reduce((sum, data) => sum + data.trendScore, 0) / countries.length
  );
  
  return {
    totalCountries: countries.length,
    totalContributions,
    totalProjects,
    activeCountries,
    onboardingCountries: countries.length - activeCountries,
    avgTrendScore
  };
};

// Get stats by mode
export const getStatsByMode = (mode: MapMode) => {
  const stats = getGlobalStats();
  switch (mode) {
    case 'projects':
      return {
        primary: stats.totalProjects,
        primaryLabel: 'projets partagés',
        secondary: stats.activeCountries,
        secondaryLabel: 'pays contributeurs'
      };
    case 'trends':
      return {
        primary: stats.avgTrendScore,
        primaryLabel: '% dynamique moyenne',
        secondary: 15,
        secondaryLabel: '% vs mois dernier'
      };
    default:
      return {
        primary: stats.totalContributions,
        primaryLabel: 'contributions',
        secondary: stats.totalCountries,
        secondaryLabel: 'pays actifs'
      };
  }
};
