import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

interface ResourceFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: ResourceFilterValues) => void;
  initialFilters?: ResourceFilterValues;
}

export interface ResourceFilterValues {
  type?: string;
  theme?: string;
  country?: string;
  language?: string;
}

const DOCUMENT_TYPES = [
  { value: 'guide', labelFr: 'Guide', labelEn: 'Guide' },
  { value: 'rapport', labelFr: 'Rapport', labelEn: 'Report' },
  { value: 'presentation', labelFr: 'Présentation', labelEn: 'Presentation' },
  { value: 'formulaire', labelFr: 'Formulaire', labelEn: 'Form' },
  { value: 'autre', labelFr: 'Autre', labelEn: 'Other' },
];

const THEMES = [
  { value: 'connectivity', labelFr: 'Connectivité', labelEn: 'Connectivity' },
  { value: 'funding', labelFr: 'Financement', labelEn: 'Funding' },
  { value: 'regulation', labelFr: 'Régulation', labelEn: 'Regulation' },
  { value: 'governance', labelFr: 'Gouvernance', labelEn: 'Governance' },
  { value: 'digital-inclusion', labelFr: 'Inclusion numérique', labelEn: 'Digital Inclusion' },
];

const COUNTRIES = [
  { value: 'ci', labelFr: 'Côte d\'Ivoire', labelEn: 'Côte d\'Ivoire' },
  { value: 'sn', labelFr: 'Sénégal', labelEn: 'Senegal' },
  { value: 'za', labelFr: 'Afrique du Sud', labelEn: 'South Africa' },
  { value: 'ng', labelFr: 'Nigéria', labelEn: 'Nigeria' },
  { value: 'gh', labelFr: 'Ghana', labelEn: 'Ghana' },
  { value: 'ke', labelFr: 'Kenya', labelEn: 'Kenya' },
  { value: 'tz', labelFr: 'Tanzanie', labelEn: 'Tanzania' },
  { value: 'ug', labelFr: 'Ouganda', labelEn: 'Uganda' },
];

const LANGUAGES = [
  { value: 'fr', labelFr: 'Français', labelEn: 'French' },
  { value: 'en', labelFr: 'Anglais', labelEn: 'English' },
  { value: 'pt', labelFr: 'Portugais', labelEn: 'Portuguese' },
  { value: 'ar', labelFr: 'Arabe', labelEn: 'Arabic' },
];

export const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  onSearch,
  onFilterChange,
  initialFilters = {},
}) => {
  const { currentLanguage } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ResourceFilterValues>(initialFilters);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  }, [onSearch]);

  const handleFilterChange = useCallback((key: keyof ResourceFilterValues, value: string) => {
    const newFilters = { ...filters, [key]: value === 'all' ? undefined : value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [filters, onFilterChange]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setFilters({});
    onSearch('');
    onFilterChange({});
  }, [onSearch, onFilterChange]);

  const hasActiveFilters = searchQuery || Object.values(filters).some(v => v);

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder={currentLanguage === 'en' ? 'Search resources...' : 'Rechercher une ressource...'}
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-12 h-12 text-base bg-background border-border/50 focus:border-primary/50"
        />
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            {currentLanguage === 'en' ? 'Clear' : 'Effacer'}
          </Button>
        )}
      </div>

      {/* Filter row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Type filter */}
        <Select
          value={filters.type || 'all'}
          onValueChange={(value) => handleFilterChange('type', value)}
        >
          <SelectTrigger className="h-10 bg-background border-border/50">
            <SelectValue placeholder={currentLanguage === 'en' ? 'Type' : 'Type'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {currentLanguage === 'en' ? 'All types' : 'Tous les types'}
            </SelectItem>
            {DOCUMENT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {currentLanguage === 'en' ? type.labelEn : type.labelFr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Theme filter */}
        <Select
          value={filters.theme || 'all'}
          onValueChange={(value) => handleFilterChange('theme', value)}
        >
          <SelectTrigger className="h-10 bg-background border-border/50">
            <SelectValue placeholder={currentLanguage === 'en' ? 'Theme' : 'Thème'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {currentLanguage === 'en' ? 'All themes' : 'Tous les thèmes'}
            </SelectItem>
            {THEMES.map((theme) => (
              <SelectItem key={theme.value} value={theme.value}>
                {currentLanguage === 'en' ? theme.labelEn : theme.labelFr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Country filter */}
        <Select
          value={filters.country || 'all'}
          onValueChange={(value) => handleFilterChange('country', value)}
        >
          <SelectTrigger className="h-10 bg-background border-border/50">
            <SelectValue placeholder={currentLanguage === 'en' ? 'Country' : 'Pays'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {currentLanguage === 'en' ? 'All countries' : 'Tous les pays'}
            </SelectItem>
            {COUNTRIES.map((country) => (
              <SelectItem key={country.value} value={country.value}>
                {currentLanguage === 'en' ? country.labelEn : country.labelFr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Language filter */}
        <Select
          value={filters.language || 'all'}
          onValueChange={(value) => handleFilterChange('language', value)}
        >
          <SelectTrigger className="h-10 bg-background border-border/50">
            <SelectValue placeholder={currentLanguage === 'en' ? 'Language' : 'Langue'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {currentLanguage === 'en' ? 'All languages' : 'Toutes les langues'}
            </SelectItem>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {currentLanguage === 'en' ? lang.labelEn : lang.labelFr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ResourceFilters;
