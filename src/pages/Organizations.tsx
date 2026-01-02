
import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAgencies } from "@/hooks/useAgencies";
import { AdaptiveInterface } from "@/components/layout/AdaptiveInterface";
import { SimplifiedOrganizations } from "@/components/organizations/SimplifiedOrganizations";
import { AdvancedOrganizationsControls } from "@/components/organizations/AdvancedOrganizationsControls";
import { HeroSection } from "@/components/ui/hero-section";
import { ModernStatsCard } from "@/components/ui/modern-stats-card";
import { ModernCard } from "@/components/ui/modern-card";
import { ModernButton } from "@/components/ui/modern-button";
import { Input } from "@/components/ui/input";
import { OrganizationsOverview } from "@/components/organizations/OrganizationsOverview";
import { OrganizationsMap } from "@/components/organizations/OrganizationsMap";
import { EnrichedAgencyCard } from "@/components/organizations/EnrichedAgencyCard";
import { AutoEnrichmentPanel } from "@/components/organizations/AutoEnrichmentPanel";
import { AgencyComparison } from "@/components/organizations/AgencyComparison";
import { AdvancedGeolocation } from "@/components/organizations/AdvancedGeolocation";
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
  RefreshCw,
  BarChart3,
  GitCompare,
  Navigation
} from "lucide-react";
import { logger } from '@/utils/logger';

const Organizations = () => {
  const { t } = useTranslation();
  const { agencies, loading, error, refetch } = useAgencies();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'map' | 'overview' | 'enrichment' | 'comparison' | 'geolocation'>('grid');
  const [isSyncing, setIsSyncing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // Handle sync functionality
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await refetch(); // Refresh the agencies data
      setViewMode('enrichment'); // Switch to enrichment view
    } catch (error) {
      logger.error('Sync failed', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle analytics view
  const handleAnalytics = () => {
    setViewMode('overview');
    // Scroll to the content area
    setTimeout(() => {
      const element = document.querySelector('[data-view-content]');
      logger.debug('Analytics scroll element found', { data: element ? 'found' : 'not-found' });
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Fallback: scroll to top if element not found
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 200);
  };

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
  const enrichedAgencies = agencies.filter(agency => agency.description || agency.website_url).length;

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
              label: isSyncing ? "Synchronisation..." : "Synchroniser",
              onClick: handleSync,
              icon: <RefreshCw className={`h-5 w-5 ${isSyncing ? 'animate-spin' : ''}`} />,
              variant: "default"
            },
            {
              label: "Analytics", 
              onClick: handleAnalytics,
              icon: <BarChart3 className="h-5 w-5" />,
              variant: "outline"
            },
            {
              label: "Comparer",
              onClick: () => setShowComparison(true),
              icon: <GitCompare className="h-5 w-5" />,
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

        {/* Adaptive Interface */}
        <AdaptiveInterface
          title="Gestion des Organisations"
          description="Interface adaptée à votre niveau d'expertise"
          advancedContent={
            <AdvancedOrganizationsControls
              agencies={agencies}
              filteredAgencies={filteredAgencies}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              regions={regions}
              countries={countries}
              showComparison={showComparison}
              setShowComparison={setShowComparison}
            />
          }
        >
          <SimplifiedOrganizations
            agencies={agencies}
            loading={loading}
            onSync={handleSync}
            onAnalytics={handleAnalytics}
            isSyncing={isSyncing}
          />
        </AdaptiveInterface>
      </div>
    </div>
  );
};

export default Organizations;
