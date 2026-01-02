// Simulated activity data - will be replaced by real data from database
export interface CountryActivity {
  contributions: number;
  level: 'high' | 'medium' | 'emerging';
  recentActions: string[];
}

// Activity level configuration with semantic colors
export const ACTIVITY_LEVELS = {
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
  emerging: { 
    color: '#F59E0B', // Amber - émergent
    label: 'Émergent', 
    threshold: 0 
  },
} as const;

// Simulated activity data per country (to be replaced by real DB data)
const COUNTRY_ACTIVITY_DATA: Record<string, CountryActivity> = {
  // Très actifs
  SN: { 
    contributions: 14, 
    level: 'high',
    recentActions: [
      "Projet fibre rurale partagé",
      "Participation atelier régional",
      "Document stratégique publié"
    ]
  },
  CI: { 
    contributions: 22, 
    level: 'high',
    recentActions: [
      "Lancement programme écoles connectées",
      "Best practice télémédecine",
      "Webinaire sur la régulation"
    ]
  },
  KE: { 
    contributions: 18, 
    level: 'high',
    recentActions: [
      "Initiative mobile money",
      "Partage données couverture",
      "Collaboration transfrontalière"
    ]
  },
  MA: { 
    contributions: 16, 
    level: 'high',
    recentActions: [
      "Programme villages connectés",
      "Formation en ligne partagée",
      "Étude de marché publiée"
    ]
  },
  
  // Actifs
  CM: { 
    contributions: 11, 
    level: 'medium',
    recentActions: [
      "Projet backbone national",
      "Participation groupe de travail"
    ]
  },
  GH: { 
    contributions: 9, 
    level: 'medium',
    recentActions: [
      "Programme inclusion numérique",
      "Documentation partagée"
    ]
  },
  RW: { 
    contributions: 10, 
    level: 'medium',
    recentActions: [
      "Initiative smart villages",
      "Partage d'expérience 4G"
    ]
  },
  TZ: { 
    contributions: 12, 
    level: 'medium',
    recentActions: [
      "Projet zones rurales",
      "Collaboration régionale"
    ]
  },
  ZA: { 
    contributions: 13, 
    level: 'medium',
    recentActions: [
      "Infrastructure partagée",
      "Formation technique"
    ]
  },
  NG: { 
    contributions: 14, 
    level: 'medium',
    recentActions: [
      "Expansion réseau rural",
      "Partenariat public-privé"
    ]
  },
  EG: { 
    contributions: 11, 
    level: 'medium',
    recentActions: [
      "Projet câble sous-marin",
      "Hub régional data"
    ]
  },
  
  // Émergents
  ML: { 
    contributions: 5, 
    level: 'emerging',
    recentActions: [
      "Première contribution réseau"
    ]
  },
  BF: { 
    contributions: 4, 
    level: 'emerging',
    recentActions: [
      "Demande d'adhésion active"
    ]
  },
  TN: { 
    contributions: 6, 
    level: 'emerging',
    recentActions: [
      "Participation forum régional"
    ]
  },
  DZ: { 
    contributions: 5, 
    level: 'emerging',
    recentActions: [
      "Projet pilote en cours"
    ]
  },
  ET: { 
    contributions: 7, 
    level: 'emerging',
    recentActions: [
      "Initiative télécoms rurales"
    ]
  },
  UG: { 
    contributions: 6, 
    level: 'emerging',
    recentActions: [
      "Programme villages connectés"
    ]
  },
  NE: { 
    contributions: 3, 
    level: 'emerging',
    recentActions: [
      "Évaluation besoins en cours"
    ]
  },
  TD: { 
    contributions: 2, 
    level: 'emerging',
    recentActions: [
      "Contact initial établi"
    ]
  },
  CG: { 
    contributions: 4, 
    level: 'emerging',
    recentActions: [
      "Projet fibre en discussion"
    ]
  },
  CD: { 
    contributions: 3, 
    level: 'emerging',
    recentActions: [
      "Participation observation"
    ]
  },
  GA: { 
    contributions: 5, 
    level: 'emerging',
    recentActions: [
      "Intérêt pour best practices"
    ]
  },
  BJ: { 
    contributions: 6, 
    level: 'emerging',
    recentActions: [
      "Projet écoles connectées"
    ]
  },
  TG: { 
    contributions: 4, 
    level: 'emerging',
    recentActions: [
      "Demande de collaboration"
    ]
  },
  ZM: { 
    contributions: 5, 
    level: 'emerging',
    recentActions: [
      "Programme backbone rural"
    ]
  },
  ZW: { 
    contributions: 4, 
    level: 'emerging',
    recentActions: [
      "Initiative numérique"
    ]
  },
  MZ: { 
    contributions: 3, 
    level: 'emerging',
    recentActions: [
      "Évaluation en cours"
    ]
  },
  AO: { 
    contributions: 5, 
    level: 'emerging',
    recentActions: [
      "Projet infrastructure"
    ]
  },
  NA: { 
    contributions: 4, 
    level: 'emerging',
    recentActions: [
      "Partenariat régional"
    ]
  },
  BW: { 
    contributions: 6, 
    level: 'emerging',
    recentActions: [
      "Smart villages initiative"
    ]
  },
  MG: { 
    contributions: 3, 
    level: 'emerging',
    recentActions: [
      "Connectivité îles"
    ]
  },
  MU: { 
    contributions: 7, 
    level: 'emerging',
    recentActions: [
      "Hub numérique régional"
    ]
  },
};

// Default activity for countries not in the list
const DEFAULT_ACTIVITY: CountryActivity = {
  contributions: 2,
  level: 'emerging',
  recentActions: ["En cours d'intégration au réseau"]
};

export const getCountryActivity = (countryCode: string): CountryActivity => {
  return COUNTRY_ACTIVITY_DATA[countryCode.toUpperCase()] || DEFAULT_ACTIVITY;
};

export const getActivityColor = (level: 'high' | 'medium' | 'emerging'): string => {
  return ACTIVITY_LEVELS[level].color;
};

export const getActivityLabel = (level: 'high' | 'medium' | 'emerging'): string => {
  return ACTIVITY_LEVELS[level].label;
};

// Calculate global stats from activity data
export const getGlobalStats = () => {
  const countries = Object.keys(COUNTRY_ACTIVITY_DATA);
  const totalContributions = Object.values(COUNTRY_ACTIVITY_DATA).reduce(
    (sum, data) => sum + data.contributions, 0
  );
  const activeCountries = countries.filter(
    code => COUNTRY_ACTIVITY_DATA[code].level !== 'emerging'
  ).length;
  
  return {
    totalCountries: countries.length,
    totalContributions,
    activeCountries,
    emergingCountries: countries.length - activeCountries
  };
};
