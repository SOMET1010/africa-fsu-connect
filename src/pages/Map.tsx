import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ModernCard } from "@/components/ui/modern-card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Briefcase, TrendingUp, ArrowRight } from "lucide-react";
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
    activityLevel: null
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
        
        {/* Header minimaliste */}
        <div className="text-center mb-2">
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            Carte du Réseau SUTEL
          </h1>
          <p className="text-muted-foreground mt-1">
            Participation et échanges entre pays
          </p>
          <Badge variant="outline" className="mt-3">
            {globalStats.totalCountries} pays
          </Badge>
        </div>

        {/* Tabs & Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Tabs value={mapMode} onValueChange={(v) => setMapMode(v as MapMode)}>
            <TabsList className="grid w-full md:w-auto grid-cols-3">
              <TabsTrigger value="members" className="gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Membres</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="gap-2">
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Projets</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Tendances</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-3">
            <MapFilters filters={filters} onFilterChange={setFilters} />
            
            {hasActiveFilters && (
              <Badge variant="secondary">
                {filteredCountries.length} pays affichés
              </Badge>
            )}
          </div>
        </div>

        {/* Micro-Narrative */}
        <MapNarrative mode={mapMode} />

        {/* Interactive Map */}
        <ModernCard variant="glass" className="p-4">
          <NetworkMap 
            countries={filteredCountries}
            onCountryClick={setSelectedCountry}
            mode={mapMode}
            isLoading={isLoading}
          />
        </ModernCard>

        {/* Link to activity */}
        <div className="text-center pt-2">
          <Link 
            to="/activity" 
            className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1 transition-colors"
          >
            Voir l'activité détaillée du réseau
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
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
