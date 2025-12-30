import { useState, useEffect, useMemo } from 'react';
import { CountriesService, Country } from '@/services/countriesService';

export interface MemberCountry {
  code: string;
  name: string;
  flag: string;
  region: string;
  status: 'active' | 'member' | 'joining';
}

// Génère un drapeau emoji à partir du code pays
const getCountryFlag = (code: string): string => {
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Simule le statut membre (MVP - en production viendrait de la DB)
const simulateMemberStatus = (code: string): 'active' | 'member' | 'joining' => {
  const activeCountries = ['SN', 'CI', 'GH', 'KE', 'NG', 'TZ', 'RW', 'MA', 'EG', 'ZA', 'ET', 'UG', 'CM', 'ML', 'BF'];
  const joiningCountries = ['LY', 'SD', 'ER', 'DJ', 'SO', 'SS'];
  
  if (activeCountries.includes(code.toUpperCase())) return 'active';
  if (joiningCountries.includes(code.toUpperCase())) return 'joining';
  return 'member';
};

export const useMembersDirectory = () => {
  const [countries, setCountries] = useState<MemberCountry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setIsLoading(true);
        const data = await CountriesService.getAfricanCountries();
        
        const memberCountries: MemberCountry[] = data.map((c: Country) => ({
          code: c.code,
          name: c.name_fr,
          flag: getCountryFlag(c.code),
          region: c.region || 'Afrique',
          status: simulateMemberStatus(c.code),
        }));
        
        setCountries(memberCountries);
      } catch (error) {
        console.error('Error loading countries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCountries();
  }, []);

  // Régions uniques
  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(countries.map(c => c.region))];
    return uniqueRegions.sort();
  }, [countries]);

  // Filtrage
  const filteredCountries = useMemo(() => {
    return countries.filter(country => {
      // Recherche textuelle
      if (searchTerm && !country.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      // Filtre région
      if (selectedRegion && country.region !== selectedRegion) {
        return false;
      }
      // Filtre statut
      if (selectedStatus && country.status !== selectedStatus) {
        return false;
      }
      return true;
    });
  }, [countries, searchTerm, selectedRegion, selectedStatus]);

  // Grouper par région
  const countriesByRegion = useMemo(() => {
    const grouped: Record<string, MemberCountry[]> = {};
    
    filteredCountries.forEach(country => {
      if (!grouped[country.region]) {
        grouped[country.region] = [];
      }
      grouped[country.region].push(country);
    });

    // Trier les pays par nom dans chaque région
    Object.keys(grouped).forEach(region => {
      grouped[region].sort((a, b) => a.name.localeCompare(b.name));
    });

    return grouped;
  }, [filteredCountries]);

  return {
    countries,
    filteredCountries,
    countriesByRegion,
    regions,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedRegion,
    setSelectedRegion,
    selectedStatus,
    setSelectedStatus,
    filteredCount: filteredCountries.length,
  };
};
