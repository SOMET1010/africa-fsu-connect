import { useState, useMemo } from "react";
import { ModernCard } from "@/components/ui/modern-card";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { HeroSection } from "@/components/ui/hero-section";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Users, Briefcase, TrendingUp } from "lucide-react";
import { useAfricanCountries } from "@/hooks/useCountries";
import { Country } from "@/services/countriesService";
import { NetworkMap } from "@/components/map/NetworkMap";
import { MapNarrative } from "@/components/map/MapNarrative";
import { CountrySheet } from "@/components/map/CountrySheet";
import { MapFilters, MapFiltersState } from "@/components/map/MapFilters";
import { getGlobalStats, getCountryActivity, MapMode } from "@/components/map/activityData";

const Map = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [mapMode, setMapMode] = useState<MapMode>('members');
  const [filters, setFilters] = useState<MapFiltersState>({
    region: null,
    activityLevel: null,
    period: 'month'
  });
  
  const { data: countries = [], isLoading } = useAfricanCountries();
  const globalStats = getGlobalStats();
  
  // Filter countries with coordinates
  const countriesWithCoords = countries.filter(c => c.latitude && c.longitude);
  
  // Apply filters to countries
  const filteredCountries = useMemo(() => {
    return countriesWithCoords.filter(country => {
      const activity = getCountryActivity(country.code);
      
      // Filter by region
      if (filters.region && country.region !== filters.region) return false;
      
      // Filter by activity level
      if (filters.activityLevel && activity.level !== filters.activityLevel) return false;
      
      return true;
    });
  }, [countriesWithCoords, filters]);
  
  const hasActiveFilters = filters.region || filters.activityLevel;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-6">
        
        {/* Hero Section */}
        <ScrollReveal direction="fade">
          <HeroSection
            title="Carte du Réseau NEXUS"
            subtitle="La coopération africaine en action"
            description="Découvrez les pays qui partagent projets, expériences et bonnes pratiques. Cliquez sur un pays pour explorer ses contributions au réseau."
          >
            <div className="flex flex-wrap gap-2 mt-6">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {globalStats.totalCountries} Pays actifs
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {globalStats.totalContributions} Contributions
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {globalStats.activeCountries} Très actifs
              </Badge>
            </div>
          </HeroSection>
        </ScrollReveal>

        {/* Tabs & Filters */}
        <ScrollReveal delay={100}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Tabs value={mapMode} onValueChange={(v) => setMapMode(v as MapMode)}>
              <TabsList className="grid w-full md:w-auto grid-cols-3">
                <TabsTrigger value="members" className="gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Pays membres</span>
                  <span className="sm:hidden">Membres</span>
                </TabsTrigger>
                <TabsTrigger value="projects" className="gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">Projets partagés</span>
                  <span className="sm:hidden">Projets</span>
                </TabsTrigger>
                <TabsTrigger value="trends" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Tendances</span>
                  <span className="sm:hidden">Tendances</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <MapFilters filters={filters} onFilterChange={setFilters} />
            
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {filteredCountries.length} pays affichés
              </Badge>
            )}
          </div>
        </ScrollReveal>

        {/* Micro-Narrative */}
        <ScrollReveal delay={200}>
          <MapNarrative mode={mapMode} />
        </ScrollReveal>

        {/* Interactive Map */}
        <ScrollReveal delay={300}>
          <ModernCard variant="glass" className="p-6">
            <NetworkMap 
              countries={filteredCountries}
              onCountryClick={setSelectedCountry}
              mode={mapMode}
              isLoading={isLoading}
            />
          </ModernCard>
        </ScrollReveal>
      </div>

      {/* Country Sheet (shadcn/ui) */}
      <CountrySheet 
        country={selectedCountry}
        onClose={() => setSelectedCountry(null)}
        mode={mapMode}
      />
    </div>
  );
};

export default Map;
