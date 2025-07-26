import { ModernButton } from "@/components/ui/modern-button";
import { ModernCard } from "@/components/ui/modern-card";
import { OrganizationsOverview } from "@/components/organizations/OrganizationsOverview";
import { OrganizationsMap } from "@/components/organizations/OrganizationsMap";
import { AutoEnrichmentPanel } from "@/components/organizations/AutoEnrichmentPanel";
import { AgencyComparison } from "@/components/organizations/AgencyComparison";
import { AdvancedGeolocation } from "@/components/organizations/AdvancedGeolocation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MapPin, 
  BarChart3,
  GitCompare,
  Navigation,
  Filter,
  Download,
  Settings
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdvancedOrganizationsControlsProps {
  agencies: any[];
  filteredAgencies: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  regions: string[];
  countries: string[];
  showComparison: boolean;
  setShowComparison: (show: boolean) => void;
}

export const AdvancedOrganizationsControls = ({
  agencies,
  filteredAgencies,
  searchTerm,
  setSearchTerm,
  selectedRegion,
  setSelectedRegion,
  selectedCountry,
  setSelectedCountry,
  regions,
  countries,
  showComparison,
  setShowComparison
}: AdvancedOrganizationsControlsProps) => {
  return (
    <div className="space-y-6">
      {/* Advanced Tools */}
      <ModernCard variant="glass" className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Outils Avancés</h3>
            <p className="text-sm text-muted-foreground">
              Analyse, comparaison et géolocalisation avancées
            </p>
          </div>
          <div className="flex gap-2">
            <ModernButton variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </ModernButton>
            <ModernButton variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Config
            </ModernButton>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <ModernButton 
            variant="outline" 
            size="sm" 
            className="justify-start"
            onClick={() => setShowComparison(true)}
          >
            <GitCompare className="h-4 w-4 mr-2" />
            Comparer
          </ModernButton>
          <ModernButton variant="outline" size="sm" className="justify-start">
            <MapPin className="h-4 w-4 mr-2" />
            Géolocalisation
          </ModernButton>
          <ModernButton variant="outline" size="sm" className="justify-start">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </ModernButton>
          <ModernButton variant="outline" size="sm" className="justify-start">
            <Navigation className="h-4 w-4 mr-2" />
            Cartographie
          </ModernButton>
        </div>
      </ModernCard>

      {/* Advanced Filters */}
      <ModernCard variant="glass" className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Filtres Avancés</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, acronyme ou pays..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 rounded-lg border-border/50 bg-background/50"
            />
          </div>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full md:w-48 h-10 rounded-lg border-border/50 bg-background/50">
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
            <SelectTrigger className="w-full md:w-48 h-10 rounded-lg border-border/50 bg-background/50">
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

      {/* Advanced Views */}
      <ModernCard variant="glass" className="overflow-hidden">
        <Tabs defaultValue="overview" className="w-full">
          <div className="border-b border-border/30 px-6 pt-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-muted/30">
              <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-background">
                <BarChart3 className="h-4 w-4" />
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-2 data-[state=active]:bg-background">
                <MapPin className="h-4 w-4" />
                Carte
              </TabsTrigger>
              <TabsTrigger value="enrichment" className="flex items-center gap-2 data-[state=active]:bg-background">
                <Settings className="h-4 w-4" />
                Enrichissement
              </TabsTrigger>
              <TabsTrigger value="geolocation" className="flex items-center gap-2 data-[state=active]:bg-background">
                <Navigation className="h-4 w-4" />
                Géolocalisation
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview" className="p-6 mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Vue d'Ensemble Analytique</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Analyse détaillée des organisations et de leur répartition
                </p>
              </div>
              <OrganizationsOverview agencies={filteredAgencies} />
            </div>
          </TabsContent>
          
          <TabsContent value="map" className="p-6 mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Cartographie Interactive</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Visualisation géographique des organisations
                </p>
              </div>
              <OrganizationsMap agencies={filteredAgencies} />
            </div>
          </TabsContent>
          
          <TabsContent value="enrichment" className="p-6 mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Enrichissement Automatique</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Compléter automatiquement les profils d'organisations
                </p>
              </div>
              <AutoEnrichmentPanel agencies={filteredAgencies} onRefresh={() => {}} />
            </div>
          </TabsContent>
          
          <TabsContent value="geolocation" className="p-6 mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Géolocalisation Avancée</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Outils de géolocalisation et d'analyse spatiale
                </p>
              </div>
              <AdvancedGeolocation agencies={filteredAgencies} />
            </div>
          </TabsContent>
        </Tabs>
      </ModernCard>

      {/* Agency Comparison Modal */}
      <AgencyComparison
        agencies={agencies}
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
      />
    </div>
  );
};