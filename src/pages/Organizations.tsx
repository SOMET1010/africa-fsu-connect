
import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAgencies } from "@/hooks/useAgencies";
import { HeroSection } from "@/components/ui/hero-section";
import { ModernStatsCard } from "@/components/ui/modern-stats-card";
import { ModernCard } from "@/components/ui/modern-card";
import { ModernButton } from "@/components/ui/modern-button";
import { Input } from "@/components/ui/input";
import { OrganizationsOverview } from "@/components/organizations/OrganizationsOverview";
import { OrganizationsMap } from "@/components/organizations/OrganizationsMap";
import { EnrichedAgencyCard } from "@/components/organizations/EnrichedAgencyCard";
import { AutoEnrichmentPanel } from "@/components/organizations/AutoEnrichmentPanel";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Building2, 
  Globe, 
  Users, 
  TrendingUp,
  Filter,
  Download,
  Sync,
  BarChart3
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Organizations = () => {
  const { t } = useTranslation();
  const { agencies, loading, error } = useAgencies();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'map' | 'overview' | 'enrichment'>('grid');

  // Get unique regions and countries for filters
  const regions = [...new Set(agencies.map(agency => agency.region).filter(Boolean))];
  const countries = [...new Set(agencies.map(agency => agency.country).filter(Boolean))];

  // Filter agencies based on search and filters
  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.acronym?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegion = selectedRegion === "all" || agency.region === selectedRegion;
    const matchesCountry = selectedCountry === "all" || agency.country === selectedCountry;
    
    return matchesSearch && matchesRegion && matchesCountry;
  });

  // Calculate stats
  const totalOrganizations = agencies.length;
  const activeRegions = regions.length;
  const totalCountries = countries.length;
  const enrichedAgencies = agencies.filter(agency => agency.description || agency.website).length;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Hero Section */}
        <HeroSection
          title="Organisations FSU"
          subtitle="Réseau Africain"
          description="Découvrez les agences et organismes de régulation des télécommunications à travers l'Afrique. Une plateforme collaborative pour renforcer les liens et partager les bonnes pratiques."
          actions={[
            {
              label: "Synchroniser",
              onClick: () => {},
              icon: <Sync className="h-5 w-5" />,
              variant: "default"
            },
            {
              label: "Analytics",
              onClick: () => setViewMode('overview'),
              icon: <BarChart3 className="h-5 w-5" />,
              variant: "outline"
            }
          ]}
        />

        {/* Statistics Cards */}
        <ScrollReveal delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ModernStatsCard
              title="Organisations"
              value={totalOrganizations}
              icon={Building2}
              variant="gradient"
              trend={{ value: 5, label: "Nouvelles ce mois", positive: true }}
              description="Agences de régulation actives"
            />
            <ModernStatsCard
              title="Régions"
              value={activeRegions}
              icon={Globe}
              variant="gradient"
              trend={{ value: 2, label: "Couverture étendue", positive: true }}
              description="Zones géographiques couvertes"
            />
            <ModernStatsCard
              title="Pays"
              value={totalCountries}
              icon={MapPin}
              variant="gradient"
              trend={{ value: 8, label: "Expansion continue", positive: true }}
              description="Présence continentale"
            />
            <ModernStatsCard
              title="Profils Enrichis"
              value={enrichedAgencies}
              icon={Users}
              variant="gradient"
              trend={{ value: 15, label: "Données complétées", positive: true }}
              description="Informations détaillées"
            />
          </div>
        </ScrollReveal>

        {/* View Mode Toggle */}
        <ScrollReveal delay={400}>
          <ModernCard variant="glass" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Vue des Organisations</h2>
              <div className="flex border border-border/50 rounded-xl p-1 bg-muted/30">
                <ModernButton 
                  variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grille
                </ModernButton>
                <ModernButton 
                  variant={viewMode === 'map' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setViewMode('map')}
                >
                  Carte
                </ModernButton>
                <ModernButton 
                  variant={viewMode === 'overview' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setViewMode('overview')}
                >
                  Vue d'ensemble
                </ModernButton>
                <ModernButton 
                  variant={viewMode === 'enrichment' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setViewMode('enrichment')}
                >
                  Enrichissement
                </ModernButton>
              </div>
            </div>
          </ModernCard>
        </ScrollReveal>

        {/* View-specific content */}
        {viewMode === 'map' && (
          <ScrollReveal delay={600}>
            <OrganizationsMap agencies={filteredAgencies} />
          </ScrollReveal>
        )}
        
        {viewMode === 'overview' && (
          <ScrollReveal delay={600}>
            <OrganizationsOverview agencies={filteredAgencies} />
          </ScrollReveal>
        )}
        
        {viewMode === 'enrichment' && (
          <ScrollReveal delay={600}>
            <AutoEnrichmentPanel />
          </ScrollReveal>
        )}

        {/* Filters and Grid - only show for grid view */}
        {viewMode === 'grid' && (
          <>
            <ScrollReveal delay={600}>
              <ModernCard variant="glass" className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Filtres et Recherche</h3>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par nom, acronyme ou pays..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 rounded-xl border-border/50 bg-background/50"
                    />
                  </div>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="w-full md:w-48 h-12 rounded-xl border-border/50 bg-background/50">
                      <SelectValue placeholder="Région" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les régions</SelectItem>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="w-full md:w-48 h-12 rounded-xl border-border/50 bg-background/50">
                      <SelectValue placeholder="Pays" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les pays</SelectItem>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </ModernCard>
            </ScrollReveal>

            {/* Organizations Grid */}
            <ScrollReveal delay={800}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgencies.map((agency, index) => (
                  <ScrollReveal key={agency.id} delay={100 * (index % 6)} direction="up">
                    <EnrichedAgencyCard agency={agency} />
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>

            {filteredAgencies.length === 0 && (
              <ScrollReveal delay={600}>
                <ModernCard variant="glass" className="p-12 text-center">
                  <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Aucune organisation trouvée
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Essayez de modifier vos critères de recherche ou filtres.
                  </p>
                  <ModernButton 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedRegion("all");
                      setSelectedCountry("all");
                    }}
                    size="lg"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Réinitialiser les filtres
                  </ModernButton>
                </ModernCard>
              </ScrollReveal>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Organizations;
