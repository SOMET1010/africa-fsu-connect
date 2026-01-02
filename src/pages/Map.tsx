import { useState } from "react";
import { ModernCard } from "@/components/ui/modern-card";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { HeroSection } from "@/components/ui/hero-section";
import { Globe, Users, Briefcase, TrendingUp } from "lucide-react";
import { useAfricanCountries } from "@/hooks/useCountries";
import { Country } from "@/services/countriesService";
import { NetworkMap } from "@/components/map/NetworkMap";
import { MapNarrative } from "@/components/map/MapNarrative";
import { CountryDetailPanel } from "@/components/map/CountryDetailPanel";
import { getGlobalStats } from "@/components/map/activityData";

const Map = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const { data: countries = [], isLoading } = useAfricanCountries();
  
  const globalStats = getGlobalStats();
  
  // Filter countries with coordinates
  const countriesWithCoords = countries.filter(c => c.latitude && c.longitude);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
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

        {/* Micro-Narrative */}
        <ScrollReveal delay={200}>
          <MapNarrative />
        </ScrollReveal>

        {/* Interactive Map */}
        <ScrollReveal delay={400}>
          <ModernCard variant="glass" className="p-6">
            <NetworkMap 
              countries={countriesWithCoords}
              onCountryClick={setSelectedCountry}
              isLoading={isLoading}
            />
          </ModernCard>
        </ScrollReveal>
      </div>

      {/* Country Detail Panel */}
      {selectedCountry && (
        <CountryDetailPanel 
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  );
};

export default Map;
