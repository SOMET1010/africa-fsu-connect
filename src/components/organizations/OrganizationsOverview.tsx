
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { OrganizationsMap } from "./OrganizationsMap";
import { MapboxInteractiveMap } from "./MapboxInteractiveMap";
import { 
  Building2, 
  Globe, 
  Zap,
  Map,
  CheckCircle,
  Clock,
  AlertTriangle,
  Network,
  Target,
  DollarSign
} from "lucide-react";

interface Agency {
  id: string;
  name: string;
  country: string;
  region: string;
  sync_status: string;
  acronym: string;
  website_url?: string;
  contact_email?: string;
  last_sync_at?: string;
  description?: string;
  metadata?: any;
}

interface OrganizationsOverviewProps {
  agencies: Agency[];
  onAgencyClick?: (Agency: Agency) => void;
}

const SYNC_STATUS_ICONS = {
  synced: <CheckCircle className="h-4 w-4 text-green-600" />,
  pending: <Clock className="h-4 w-4 text-yellow-600" />,
  failed: <AlertTriangle className="h-4 w-4 text-red-600" />,
  partial: <AlertTriangle className="h-4 w-4 text-yellow-600" />
};

export const OrganizationsOverview = ({ agencies, onAgencyClick }: OrganizationsOverviewProps) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const stats = useMemo(() => {
    const regionStats = agencies.reduce((acc, agency) => {
      if (!acc[agency.region]) {
        acc[agency.region] = {
          count: 0,
          synced: 0,
          countries: new Set(),
          governanceTypes: new Set()
        };
      }
      acc[agency.region].count++;
      acc[agency.region].countries.add(agency.country);
      if (agency.sync_status === 'synced') acc[agency.region].synced++;
      
      // Ajouter les types de gouvernance
      if (agency.metadata && agency.metadata.governance_type) {
        acc[agency.region].governanceTypes.add(agency.metadata.governance_type);
      }
      
      return acc;
    }, {} as any);

    // Compter les types de gouvernance
    const governanceStats = agencies.reduce((acc, agency) => {
      if (agency.metadata && agency.metadata.governance_type) {
        const type = agency.metadata.governance_type;
        acc[type] = (acc[type] || 0) + 1;
      }
      return acc;
    }, {} as any);

    return {
      total: agencies.length,
      synced: agencies.filter(a => a.sync_status === 'synced').length,
      pending: agencies.filter(a => a.sync_status === 'pending').length,
      failed: agencies.filter(a => a.sync_status === 'failed').length,
      autonomous: governanceStats['autonomous_agency'] || 0,
      regulatorManaged: (governanceStats['unit_within_regulator'] || 0) + (governanceStats['regulator_managed_fund'] || 0),
      ministryManaged: governanceStats['ministry_unit'] || 0,
      regions: Object.entries(regionStats).map(([region, stats]: [string, any]) => ({
        region,
        ...stats,
        countries: stats.countries.size,
        governanceTypes: stats.governanceTypes.size
      }))
    };
  }, [agencies]);

  const filteredAgencies = selectedRegion 
    ? agencies.filter(a => a.region === selectedRegion)
    : agencies;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">SUTEL Africaines</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Target className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Agences autonomes</p>
              <p className="text-2xl font-bold">{stats.autonomous}</p>
              <p className="text-xs text-green-600">
                Gestion indépendante
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Building2 className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unités régulateur</p>
              <p className="text-2xl font-bold">{stats.regulatorManaged}</p>
              <p className="text-xs text-blue-600">
                Gestion intégrée
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Globe className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pays couverts</p>
              <p className="text-2xl font-bold">
                {[...new Set(agencies.map(a => a.country))].length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="governance">Types de gouvernance</TabsTrigger>
          <TabsTrigger value="network">Réseau</TabsTrigger>
          <TabsTrigger value="map">Carte interactive</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Regional Breakdown */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Map className="h-5 w-5" />
                Répartition régionale SUTEL
              </h3>
              <div className="space-y-4">
                {stats.regions.map((region) => (
                  <div 
                    key={region.region}
                    className="cursor-pointer p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedRegion(region.region === selectedRegion ? null : region.region)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{region.region}</span>
                      <Badge variant="outline">
                        {region.count} SUTEL{region.count > 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{region.countries} pays</span>
                      <span>{region.synced}/{region.count} synchronisées</span>
                    </div>
                    <Progress 
                      value={region.count > 0 ? (region.synced / region.count) * 100 : 0} 
                      className="mt-2 h-2"
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Status Overview */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Network className="h-5 w-5" />
                État de la collecte de données
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Données collectées</span>
                  </div>
                  <span className="font-semibold">{stats.synced}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Collecte en cours</span>
                  </div>
                  <span className="font-semibold">{stats.pending}</span>
                </div>
                {stats.failed > 0 && (
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Erreur collecte</span>
                    </div>
                    <span className="font-semibold">{stats.failed}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="governance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Target className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="font-semibold">Agences Autonomes</h3>
              </div>
              <p className="text-2xl font-bold mb-2">{stats.autonomous}</p>
              <p className="text-sm text-muted-foreground">
                Structures indépendantes avec autonomie de gestion et budget propre
              </p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Building2 className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="font-semibold">Unités Régulateur</h3>
              </div>
              <p className="text-2xl font-bold mb-2">{stats.regulatorManaged}</p>
              <p className="text-sm text-muted-foreground">
                Départements spécialisés intégrés aux autorités de régulation
              </p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="font-semibold">Fonds Ministériels</h3>
              </div>
              <p className="text-2xl font-bold mb-2">{stats.ministryManaged}</p>
              <p className="text-sm text-muted-foreground">
                Fonds gérés directement par les ministères de tutelle
              </p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Mission des SUTEL</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h4 className="font-medium">Inclusion Numérique</h4>
                <p className="text-xs text-muted-foreground mt-1">Réduire la fracture numérique</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Map className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h4 className="font-medium">Zones Rurales</h4>
                <p className="text-xs text-muted-foreground mt-1">Connecter les zones isolées</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h4 className="font-medium">Financement</h4>
                <p className="text-xs text-muted-foreground mt-1">Fonds dédiés au service universel</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Network className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h4 className="font-medium">Infrastructure</h4>
                <p className="text-xs text-muted-foreground mt-1">Déploiement réseau national</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <OrganizationsMap agencies={agencies} />
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <MapboxInteractiveMap agencies={agencies} />
        </TabsContent>
      </Tabs>

      {selectedRegion && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">SUTEL - {selectedRegion}</h3>
            <button 
              onClick={() => setSelectedRegion(null)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Voir toutes les régions
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredAgencies.map((agency) => (
              <div 
                key={agency.id}
                className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onAgencyClick?.(agency)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{agency.name}</span>
                  <div className="flex items-center gap-1">
                    {SYNC_STATUS_ICONS[agency.sync_status as keyof typeof SYNC_STATUS_ICONS]}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{agency.country}</p>
                <div className="flex gap-1">
                  <Badge variant="default" className="text-xs">
                    SUTEL
                  </Badge>
                  {agency.metadata?.governance_type === 'autonomous_agency' && (
                    <Badge variant="outline" className="text-xs">
                      Autonome
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
