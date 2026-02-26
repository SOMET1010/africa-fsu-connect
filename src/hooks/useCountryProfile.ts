import { useState, useEffect } from 'react';
import { CountriesService } from '@/services/countriesService';
import type { Country } from '@/services/countriesService';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

import type { CountryStatus } from '@/types/countryStatus';

export interface CountryProfile {
  code: string;
  name: string;
  flag: string;
  status: CountryStatus;
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
  status?: string;
  updatedAt?: string;
  country?: string;
  agencyName?: string;
}

export interface Practice {
  id: string;
  title: string;
  description: string;
  type?: string;
  country?: string;
  updatedAt?: string;
  sourceUrl?: string;
}

// Génère un drapeau emoji à partir du code pays
const getCountryFlag = (code: string): string => {
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const simulateStatus = (code: string): CountryStatus => {
  const activeCountries = ['SN', 'CI', 'GH', 'KE', 'NG', 'TZ', 'RW', 'MA', 'EG', 'ZA'];
  const onboardingCountries = ['ET', 'UG', 'CM', 'ML', 'BF', 'LY', 'SD'];
  const observerCountries = ['ER', 'DJ', 'SO', 'SS'];
  
  if (activeCountries.includes(code.toUpperCase())) return 'active';
  if (onboardingCountries.includes(code.toUpperCase())) return 'onboarding';
  if (observerCountries.includes(code.toUpperCase())) return 'observer';
  return 'member';
};

const simulateLastContribution = (status: CountryStatus): string => {
  if (status === 'active') {
    const options = ['il y a 2 jours', 'il y a 3 jours', 'il y a 5 jours', 'cette semaine'];
    return options[Math.floor(Math.random() * options.length)];
  }
  if (status === 'onboarding') {
    return 'il y a 2 semaines';
  }
  if (status === 'observer') {
    return 'En attente';
  }
  const options = ['il y a 2 semaines', 'il y a 1 mois', 'le mois dernier'];
  return options[Math.floor(Math.random() * options.length)];
};

const normalizeLabel = (value?: string | null) => {
  if (!value) return '';
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toUpperCase()
    .trim();
};

const matchesCountry = (value: string | null | undefined, countryData: { code: string; name_fr: string; name_en: string }) => {
  if (!value) return false;
  const normalizedValue = normalizeLabel(value);
  if (!normalizedValue) return false;
  const targets = [
    normalizeLabel(countryData.code),
    normalizeLabel(countryData.name_fr),
    normalizeLabel(countryData.name_en),
  ].filter(Boolean);
  return targets.some(target => target && (normalizedValue === target || normalizedValue.includes(target) || target.includes(normalizedValue)));
};

const practiceDocumentTypes = new Set(['guide', 'report', 'presentation']);

interface CountryAgency {
  id: string;
  name?: string;
  country?: string;
}

interface CountryMembershipStats {
  activeMembers: number;
  totalMembers: number;
  lastActivity?: string;
  focalPoint?: {
    name: string;
    role: string;
    email?: string;
  };
}

/**
 * Retrieve the agencies whose country metadata matches the requested country.
 * Matching happens on both the localized name and the ISO code to be resilient.
 */
const fetchAgenciesForCountry = async (countryData: Country): Promise<CountryAgency[]> => {
  try {
    const { data } = await supabase
      .from('agencies')
      .select('id,name,country')
      .order('name');

    return (data || []).filter(agency => matchesCountry(agency.country, countryData));
  } catch (error) {
    logger.error('Error fetching agencies for country', error, { component: 'useCountryProfile' });
    return [];
  }
};

/**
 * Aggregates membership stats for the agencies operating in a country so we can compute
 * activity signals (presence, focal points, latest member onboarding).
 */
const fetchAgencyMembershipStats = async (agencyIds: string[]): Promise<CountryMembershipStats> => {
  if (!agencyIds.length) {
    return { activeMembers: 0, totalMembers: 0 };
  }

  try {
    const { data: members, error: membersError } = await supabase
      .from('agency_members')
      .select('user_id,role,active,joined_at')
      .in('agency_id', agencyIds)
      .order('joined_at', { ascending: false });

    if (membersError) {
      throw membersError;
    }

    const stats: CountryMembershipStats = {
      activeMembers: 0,
      totalMembers: members?.length ?? 0,
    };

    let latestActivity: string | undefined;
    let focalPointMember = members?.find(member => member.role === 'focal_point' && member.active);

    members?.forEach(member => {
      if (member.active) {
        stats.activeMembers += 1;
      }

      if (member.joined_at) {
        const memberDate = new Date(member.joined_at);
        if (!Number.isNaN(memberDate.getTime())) {
          latestActivity = !latestActivity || memberDate.getTime() > new Date(latestActivity).getTime()
            ? member.joined_at
            : latestActivity;
        }
      }
    });

    stats.lastActivity = latestActivity;

    if (focalPointMember?.user_id) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name,last_name,email')
        .eq('user_id', focalPointMember.user_id)
        .maybeSingle();

      const nameParts = [profileData?.first_name, profileData?.last_name].filter(Boolean);
      stats.focalPoint = {
        name: nameParts.length ? nameParts.join(' ') : 'Point focal national',
        role: 'Point focal national',
        email: profileData?.email ?? undefined,
      };
    }

    return stats;
  } catch (error) {
    logger.error('Error fetching agency member stats', error, { component: 'useCountryProfile' });
    return { activeMembers: 0, totalMembers: 0 };
  }
};

const determineCountryStatus = (
  projectList: Project[],
  practiceList: Practice[],
  membershipStats: CountryMembershipStats,
  fallbackCode: string
): CountryStatus => {
  const now = Date.now();
  const ninetyDays = 90 * 24 * 60 * 60 * 1000;
  const sixtyDays = 60 * 24 * 60 * 60 * 1000;

  const hasRecentProject = projectList.some(project => {
    if (!project.updatedAt) return false;
    const updatedAt = new Date(project.updatedAt);
    return !Number.isNaN(updatedAt.getTime()) && (now - updatedAt.getTime()) <= ninetyDays;
  });

  const hasRecentPractice = practiceList.some(practice => {
    if (!practice.updatedAt) return false;
    const updatedAt = new Date(practice.updatedAt);
    return !Number.isNaN(updatedAt.getTime()) && (now - updatedAt.getTime()) <= ninetyDays;
  });

  const hasRecentMember = membershipStats.lastActivity
    ? !Number.isNaN(new Date(membershipStats.lastActivity).getTime()) && (now - new Date(membershipStats.lastActivity).getTime()) <= sixtyDays
    : false;

  if (hasRecentProject || hasRecentMember) {
    return 'active';
  }

  if (projectList.length > 0 || practiceList.length > 0 || membershipStats.activeMembers > 0) {
    return 'onboarding';
  }

  if (membershipStats.totalMembers > 0) {
    return 'member';
  }

  return simulateStatus(fallbackCode);
};

const calculatePresenceLevel = (
  membershipStats: CountryMembershipStats,
  projectCount: number,
  practiceCount: number
): number => {
  const memberScore = Math.min(4, Math.ceil(membershipStats.activeMembers / 2));
  const projectScore = Math.min(2, Math.ceil(projectCount / 2));
  const practiceScore = Math.min(1, Math.ceil(practiceCount / 3));
  const rawScore = memberScore + projectScore + practiceScore;
  if (!rawScore) {
    return 1;
  }
  return Math.min(7, rawScore);
};

const fetchProjectsForCountry = async (countryData: { code: string; name_fr: string; name_en: string }) => {
  try {
    const { data } = await supabase
      .from('agency_projects')
      .select('id,title,description,status,updated_at,created_at,agencies (id,name,country)')
      .order('updated_at', { ascending: false })
      .limit(12);

    return (data || [])
      .filter(entry => matchesCountry(entry?.agencies?.country, countryData))
      .map(entry => ({
        id: entry.id,
        title: entry.title,
        description: entry.description ?? '',
        status: entry.status,
        updatedAt: entry.updated_at ?? entry.created_at,
        country: entry.agencies?.country ?? '',
        agencyName: entry.agencies?.name ?? '',
      }));
  } catch (error) {
    logger.error('Error querying country projects', error, { component: 'useCountryProfile' });
    return [];
  }
};

const fetchPracticesForCountry = async (countryData: { code: string; name_fr: string; name_en: string }) => {
  try {
    const { data } = await supabase
      .from('documents')
      .select('id,title,description,document_type,updated_at,created_at,country,file_url')
      .order('updated_at', { ascending: false })
      .limit(12);

    return (data || [])
      .filter(entry => practiceDocumentTypes.has(entry.document_type || '') && matchesCountry(entry.country, countryData))
      .map(entry => ({
        id: entry.id,
        title: entry.title,
        description: entry.description ?? '',
        type: entry.document_type,
        updatedAt: entry.updated_at ?? entry.created_at,
        country: entry.country ?? '',
        sourceUrl: entry.file_url ?? undefined,
      }));
  } catch (error) {
    logger.error('Error querying practices for country', error, { component: 'useCountryProfile' });
    return [];
  }
};

const deriveLastContribution = (dates: (string | undefined)[], fallbackStatus: CountryStatus) => {
  const validDates = dates
    .map(date => (date ? new Date(date) : null))
    .filter((date): date is Date => Boolean(date) && !Number.isNaN(date.getTime()));

  if (!validDates.length) {
    return simulateLastContribution(fallbackStatus);
  }

  const latest = validDates.reduce((prev, current) => (current > prev ? current : prev));
  const diffDays = Math.floor((Date.now() - latest.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  return `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
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
        const countries = await CountriesService.getCountries();
        const countryData = countries.find(c => c.code.toUpperCase() === code.toUpperCase());

        if (!countryData) {
          setCountry(null);
          setProjects([]);
          setPractices([]);
          setIsLoading(false);
          return;
        }

        const [projectList, practiceList, agencies] = await Promise.all([
          fetchProjectsForCountry(countryData),
          fetchPracticesForCountry(countryData),
          fetchAgenciesForCountry(countryData),
        ]);

        setProjects(projectList);
        setPractices(practiceList);

        const membershipStats = await fetchAgencyMembershipStats(agencies.map(agency => agency.id));
        const status = determineCountryStatus(projectList, practiceList, membershipStats, countryData.code);
        const presenceLevel = calculatePresenceLevel(membershipStats, projectList.length, practiceList.length);
        const contributions = [
          ...projectList.map(p => p.updatedAt),
          ...practiceList.map(p => p.updatedAt),
          membershipStats.lastActivity,
        ];
        const collaborationsCount = Math.max(1, projectList.length + practiceList.length + membershipStats.activeMembers);
        const focalPoint = membershipStats.focalPoint ?? (status === 'active' ? {
          name: 'Point focal national',
          role: 'Directeur FSU',
        } : undefined);

        const profile: CountryProfile = {
          code: countryData.code,
          name: countryData.name_fr,
          flag: getCountryFlag(countryData.code),
          status,
          lastContribution: deriveLastContribution(contributions, status),
          presenceLevel,
          region: countryData.region || 'Afrique',
          collaborationsCount,
          focalPoint,
        };

        setCountry(profile);
      } catch (error) {
        logger.error('Error loading country profile', error, { component: 'useCountryProfile' });
        setCountry(null);
        setProjects([]);
        setPractices([]);
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
