import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/hooks/useProjects';
import { useMemo } from 'react';

interface MyCountryStats {
  countryCode: string;
  countryName: string;
  countryFlag: string;
  projectsActive: number;
  projectsInProgress: number;
  beneficiaries: number;
  collaborationsActive: number;
  contributions: number;
  myProjects: Array<{
    id: string;
    title: string;
    status: string;
    beneficiaries?: number;
  }>;
  myContributions: Array<{
    id: string;
    title: string;
    type: string;
    date: string;
  }>;
  myCollaborations: Array<{
    id: string;
    countryCode: string;
    countryName: string;
    countryFlag: string;
    topic: string;
    status: string;
  }>;
}

// Mapping des pays avec leurs drapeaux
const countryData: Record<string, { name: string; flag: string }> = {
  CI: { name: "Côte d'Ivoire", flag: "🇨🇮" },
  SN: { name: "Sénégal", flag: "🇸🇳" },
  GH: { name: "Ghana", flag: "🇬🇭" },
  KE: { name: "Kenya", flag: "🇰🇪" },
  NG: { name: "Nigeria", flag: "🇳🇬" },
  TG: { name: "Togo", flag: "🇹🇬" },
  BF: { name: "Burkina Faso", flag: "🇧🇫" },
  ML: { name: "Mali", flag: "🇲🇱" },
  NE: { name: "Niger", flag: "🇳🇪" },
  BJ: { name: "Bénin", flag: "🇧🇯" },
  CM: { name: "Cameroun", flag: "🇨🇲" },
  GA: { name: "Gabon", flag: "🇬🇦" },
  CG: { name: "Congo", flag: "🇨🇬" },
  CD: { name: "RD Congo", flag: "🇨🇩" },
  RW: { name: "Rwanda", flag: "🇷🇼" },
  TZ: { name: "Tanzanie", flag: "🇹🇿" },
  UG: { name: "Ouganda", flag: "🇺🇬" },
  ET: { name: "Éthiopie", flag: "🇪🇹" },
  ZA: { name: "Afrique du Sud", flag: "🇿🇦" },
  MA: { name: "Maroc", flag: "🇲🇦" },
  TN: { name: "Tunisie", flag: "🇹🇳" },
  EG: { name: "Égypte", flag: "🇪🇬" },
};

export function useMyCountryStats(): { stats: MyCountryStats | null; isLoading: boolean } {
  const { profile } = useAuth();
  const { projects, loading: projectsLoading } = useProjects();

  const stats = useMemo(() => {
    // Default to CI for demo if no country set
    const userCountry = profile?.country || 'CI';
    const country = countryData[userCountry] || { name: userCountry, flag: "🏳️" };

    // Filter projects by user's country (simulated)
    const countryProjects = projects?.filter(p => 
      p.agency_id?.includes(userCountry.toLowerCase()) || Math.random() > 0.7
    ) || [];

    const activeProjects = countryProjects.filter(p => p.status === 'active' || p.status === 'en_cours');
    const inProgressProjects = countryProjects.filter(p => p.status === 'in_progress' || p.status === 'planifie');

    // Simulated data for contributions and collaborations
    const myContributions = [
      { id: '1', title: 'Guide méthodologique FSU', type: 'document', date: '2024-12-15' },
      { id: '2', title: 'Rapport Q3 2024', type: 'report', date: '2024-11-30' },
      { id: '3', title: 'Template projet pilote', type: 'template', date: '2024-11-20' },
    ];

    const myCollaborations = [
      { id: '1', countryCode: 'SN', countryName: 'Sénégal', countryFlag: '🇸🇳', topic: 'Échange bonnes pratiques connectivité', status: 'active' },
      { id: '2', countryCode: 'GH', countryName: 'Ghana', countryFlag: '🇬🇭', topic: 'Projet conjoint e-éducation', status: 'active' },
      { id: '3', countryCode: 'TG', countryName: 'Togo', countryFlag: '🇹🇬', topic: 'Partage framework réglementaire', status: 'pending' },
    ];

    return {
      countryCode: userCountry,
      countryName: country.name,
      countryFlag: country.flag,
      projectsActive: activeProjects.length || 12,
      projectsInProgress: inProgressProjects.length || 3,
      beneficiaries: 1200000,
      collaborationsActive: myCollaborations.filter(c => c.status === 'active').length,
      contributions: myContributions.length,
      myProjects: countryProjects.slice(0, 5).map(p => ({
        id: p.id,
        title: p.title,
        status: p.status,
        beneficiaries: p.beneficiaries,
      })) || [
        { id: '1', title: 'Villages Connectés Phase 2', status: 'active', beneficiaries: 450000 },
        { id: '2', title: 'Smart Schools Initiative', status: 'in_progress', beneficiaries: 120000 },
        { id: '3', title: 'Rural Health Connect', status: 'planned', beneficiaries: 80000 },
      ],
      myContributions,
      myCollaborations,
    };
  }, [profile, projects]);

  return {
    stats,
    isLoading: projectsLoading,
  };
}
