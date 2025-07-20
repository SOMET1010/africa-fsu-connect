
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  Globe, 
  Zap,
  Users,
  Activity,
  Map,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

interface Agency {
  id: string;
  name: string;
  country: string;
  region: string;
  sync_status: string;
  website_url?: string;
  contact_email?: string;
  last_sync_at?: string;
}

interface OrganizationsOverviewProps {
  agencies: Agency[];
  onAgencyClick?: (agency: Agency) => void;
}

const REGION_COLORS = {
  "Europe": "hsl(var(--chart-1))",
  "Afrique": "hsl(var(--chart-2))", 
  "Asie": "hsl(var(--chart-3))",
  "Amérique": "hsl(var(--chart-4))",
  "CEDEAO": "hsl(var(--chart-2))",
  "EACO": "hsl(var(--chart-3))",
  "SADC": "hsl(var(--chart-4))",
  "UMA": "hsl(var(--chart-5))"
};

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
          countries: new Set()
        };
      }
      acc[agency.region].count++;
      acc[agency.region].countries.add(agency.country);
      if (agency.sync_status === 'synced') acc[agency.region].synced++;
      return acc;
    }, {} as any);

    return {
      total: agencies.length,
      synced: agencies.filter(a => a.sync_status === 'synced').length,
      pending: agencies.filter(a => a.sync_status === 'pending').length,
      failed: agencies.filter(a => a.sync_status === 'failed').length,
      regions: Object.entries(regionStats).map(([region, stats]: [string, any]) => ({
        region,
        ...stats,
        countries: stats.countries.size
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
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Organisations Partenaires</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Zap className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Synchronisées</p>
              <p className="text-2xl font-bold">{stats.synced}</p>
              <p className="text-xs text-green-600">
                {stats.total > 0 ? Math.round((stats.synced / stats.total) * 100) : 0}% du total
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Map className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Régions</p>
              <p className="text-2xl font-bold">{stats.regions.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Globe className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pays</p>
              <p className="text-2xl font-bold">
                {[...new Set(agencies.map(a => a.country))].length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="regions">Par régions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Regional Breakdown */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Map className="h-5 w-5" />
                Répartition par région
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
                        {region.count} org.
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{region.countries} pays</span>
                      <span>{region.synced}/{region.count} sync.</span>
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
                <Activity className="h-5 w-5" />
                État de synchronisation
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Synchronisé</span>
                  </div>
                  <span className="font-semibold">{stats.synced}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>En attente</span>
                  </div>
                  <span className="font-semibold">{stats.pending}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Échec</span>
                  </div>
                  <span className="font-semibold">{stats.failed}</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.regions.map((region) => (
              <Card 
                key={region.region} 
                className={`p-4 cursor-pointer transition-all ${
                  selectedRegion === region.region 
                    ? 'ring-2 ring-primary' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedRegion(region.region === selectedRegion ? null : region.region)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{region.region}</h3>
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: REGION_COLORS[region.region as keyof typeof REGION_COLORS] }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Organisations</p>
                      <p className="font-semibold">{region.count}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pays</p>
                      <p className="font-semibold">{region.countries}</p>
                    </div>
                  </div>

                  <Progress 
                    value={region.count > 0 ? (region.synced / region.count) * 100 : 0} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {region.synced}/{region.count} synchronisées
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedRegion && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Organisations - {selectedRegion}</h3>
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
                    <Badge 
                      variant={agency.sync_status === 'synced' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {agency.sync_status}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{agency.country}</p>
                {agency.website_url && (
                  <p className="text-xs text-blue-600 truncate">{agency.website_url}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
