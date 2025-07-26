import { ModernStatsCard } from "@/components/ui/modern-stats-card";
import { ModernCard } from "@/components/ui/modern-card";
import { ModernButton } from "@/components/ui/modern-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EnrichedAgencyCard } from "@/components/organizations/EnrichedAgencyCard";
import { 
  Search, 
  Building2, 
  Globe, 
  MapPin, 
  Users, 
  RefreshCw,
  BarChart3
} from "lucide-react";

interface SimplifiedOrganizationsProps {
  agencies: any[];
  loading: boolean;
  onSync: () => void;
  onAnalytics: () => void;
  isSyncing: boolean;
}

export const SimplifiedOrganizations = ({
  agencies,
  loading,
  onSync,
  onAnalytics,
  isSyncing
}: SimplifiedOrganizationsProps) => {
  const totalOrganizations = agencies.length;
  const regions = [...new Set(agencies.map(agency => agency.region).filter(Boolean))];
  const countries = [...new Set(agencies.map(agency => agency.country).filter(Boolean))];
  
  const basicStats = [
    {
      title: "Organisations",
      value: totalOrganizations,
      icon: Building2,
      trend: { value: 5, label: "Nouvelles", positive: true },
      description: "Agences actives"
    },
    {
      title: "Pays",
      value: countries.length,
      icon: MapPin,
      trend: { value: 8, label: "Expansion", positive: true },
      description: "Couverture continentale"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {basicStats.map((stat, index) => (
          <ModernStatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            description={stat.description}
            variant="gradient"
            size="md"
          />
        ))}
      </div>

      {/* Quick Actions */}
      <ModernCard variant="glass" className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Actions Rapides</h3>
            <p className="text-sm text-muted-foreground">
              Synchroniser et analyser vos organisations
            </p>
          </div>
          <div className="flex gap-2">
            <ModernButton 
              variant="default" 
              size="sm"
              onClick={onSync}
              disabled={isSyncing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Sync...' : 'Synchroniser'}
            </ModernButton>
            <ModernButton variant="outline" size="sm" onClick={onAnalytics}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </ModernButton>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs">
            <Globe className="h-3 w-3 mr-1" />
            {regions.length} Régions
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <Building2 className="h-3 w-3 mr-1" />
            {totalOrganizations} Agences
          </Badge>
        </div>
      </ModernCard>

      {/* Simple Search */}
      <ModernCard variant="glass" className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Search className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Recherche Simple</h3>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une organisation..."
            className="pl-10 h-10 rounded-lg border-border/50 bg-background/50"
          />
        </div>
      </ModernCard>

      {/* Organizations Grid - Limited to first 6 */}
      <ModernCard variant="glass" className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Organisations Principales</h3>
          <Badge variant="secondary" className="text-xs">
            Affichage simplifié
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agencies.slice(0, 6).map((agency) => (
            <div key={agency.id} className="scale-95">
              <EnrichedAgencyCard agency={agency} onViewProfile={() => {}} />
            </div>
          ))}
        </div>
        
        {agencies.length > 6 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {agencies.length - 6} autres organisations disponibles en mode avancé
            </p>
          </div>
        )}
      </ModernCard>
    </div>
  );
};