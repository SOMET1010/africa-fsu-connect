import { useState, useEffect } from 'react';
import { CountriesService } from '@/services/countriesService';

export interface CountryProfile {
  code: string;
  name: string;
  flag: string;
  status: 'active' | 'member' | 'joining';
  lastContribution?: string;
  presenceLevel: number;
  region: string;
  collaborationsCount: number;
  focalPoint?: {
    name: string;
    role: string;
    email?: string;
  };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
}

export interface Practice {
  id: string;
  title: string;
  description: string;
}

// Génère un drapeau emoji à partir du code pays
const getCountryFlag = (code: string): string => {
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Simule le statut (MVP)
const simulateStatus = (code: string): 'active' | 'member' | 'joining' => {
  const activeCountries = ['SN', 'CI', 'GH', 'KE', 'NG', 'TZ', 'RW', 'MA', 'EG', 'ZA', 'ET', 'UG', 'CM', 'ML', 'BF'];
  const joiningCountries = ['LY', 'SD', 'ER', 'DJ', 'SO', 'SS'];
  
  if (activeCountries.includes(code.toUpperCase())) return 'active';
  if (joiningCountries.includes(code.toUpperCase())) return 'joining';
  return 'member';
};

// Simule le niveau de présence (MVP)
const simulatePresenceLevel = (status: string): number => {
  if (status === 'active') return Math.floor(Math.random() * 2) + 5; // 5-6
  if (status === 'joining') return Math.floor(Math.random() * 2) + 1; // 1-2
  return Math.floor(Math.random() * 3) + 3; // 3-5
};

// Simule la dernière contribution (MVP)
const simulateLastContribution = (status: string): string => {
  if (status === 'active') {
    const options = ['il y a 2 jours', 'il y a 3 jours', 'il y a 5 jours', 'cette semaine'];
    return options[Math.floor(Math.random() * options.length)];
  }
  if (status === 'joining') {
    return 'En attente';
  }
  const options = ['il y a 2 semaines', 'il y a 1 mois', 'le mois dernier'];
  return options[Math.floor(Math.random() * options.length)];
};

// Mock projets
const mockProjects: Record<string, Project[]> = {
  'SN': [
    { id: '1', title: 'Connectivité rurale Casamance', description: 'Déploiement de fibre optique dans les zones rurales de Casamance', status: 'active' },
    { id: '2', title: 'Écoles connectées', description: 'Programme de connexion de 500 écoles primaires', status: 'completed' },
  ],
  'CI': [
    { id: '3', title: 'Backbone national phase 2', description: 'Extension du réseau backbone vers le nord du pays', status: 'active' },
  ],
  'KE': [
    { id: '4', title: 'Digital Villages', description: 'Création de centres numériques communautaires', status: 'active' },
    { id: '5', title: 'Last Mile Connectivity', description: 'Connectivité du dernier kilomètre en zone rurale', status: 'active' },
  ],
};

// Mock bonnes pratiques
const mockPractices: Record<string, Practice[]> = {
  'SN': [
    { id: '1', title: 'Méthodologie de suivi d\'impact', description: 'Guide pour mesurer l\'impact des projets FSU sur les communautés' },
  ],
  'KE': [
    { id: '2', title: 'Partenariats public-privé', description: 'Modèle de partenariat avec les opérateurs télécom' },
  ],
};

export const useCountryProfile = (code: string) => {
  const [country, setCountry] = useState<CountryProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!code) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Charger les données du pays
        const countries = await CountriesService.getCountries();
        const countryData = countries.find(c => c.code.toUpperCase() === code.toUpperCase());
        
        if (!countryData) {
          setCountry(null);
          setIsLoading(false);
          return;
        }

        const status = simulateStatus(code);
        
        const profile: CountryProfile = {
          code: countryData.code,
          name: countryData.name_fr,
          flag: getCountryFlag(countryData.code),
          status,
          lastContribution: simulateLastContribution(status),
          presenceLevel: simulatePresenceLevel(status),
          region: countryData.region || 'Afrique',
          collaborationsCount: Math.floor(Math.random() * 8) + 1,
          focalPoint: status === 'active' ? {
            name: 'Point focal national',
            role: 'Directeur FSU',
          } : undefined,
        };

        setCountry(profile);
        setProjects(mockProjects[code.toUpperCase()] || []);
        setPractices(mockPractices[code.toUpperCase()] || []);
      } catch (error) {
        console.error('Error loading country profile:', error);
        setCountry(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [code]);

  return {
    country,
    projects,
    practices,
    isLoading,
  };
};
