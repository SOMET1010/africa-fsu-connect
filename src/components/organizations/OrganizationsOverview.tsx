import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  Globe, 
  Zap,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Map,
  BarChart3,
  PieChart
} from "lucide-react";

interface Agency {
  id: string;
  name: string;
  country: string;
  region: string;
  sync_status: string;
  project_count?: number;
  last_sync_at?: string;
  budget_total?: number;
  completion_avg?: number;
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

export const OrganizationsOverview = ({ agencies, onAgencyClick }: OrganizationsOverviewProps) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const stats = useMemo(() => {
    const regionStats = agencies.reduce((acc, agency) => {
      if (!acc[agency.region]) {
        acc[agency.region] = {
          count: 0,
          projects: 0,
          budget: 0,
          synced: 0,
          countries: new Set()
        };
      }
      acc[agency.region].count++;
      acc[agency.region].projects += agency.project_count || 0;
      acc[agency.region].budget += agency.budget_total || 0;
      acc[agency.region].countries.add(agency.country);
      if (agency.sync_status === 'synced') acc[agency.region].synced++;
      return acc;
    }, {} as any);

    return {
      total: agencies.length,
      synced: agencies.filter(a => a.sync_status === 'synced').length,
      totalProjects: Object.values(regionStats).reduce((sum: number, r: any) => sum + r.projects, 0),
      totalBudget: Object.values(regionStats).reduce((sum: number, r: any) => sum + r.budget, 0),
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
              <p className="text-sm text-muted-foreground">Organisations</p>
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
                {Math.round((stats.synced / stats.total) * 100)}% du total
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Projets</p>
              <p className="text-2xl font-bold">{Number(stats.totalProjects)}</p>
              <p className="text-xs text-muted-foreground">En cours de collecte</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Globe className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Régions</p>
              <p className="text-2xl font-bold">{stats.regions.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="regions">Par régions</TabsTrigger>
          <TabsTrigger value="projects">Projets</TabsTrigger>
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
                         {String(region.count)} org.
                       </Badge>
                    </div>
                     <div className="flex items-center gap-4 text-sm text-muted-foreground">
                       <span>{String(region.countries)} pays</span>
                       <span>{String(region.synced)}/{String(region.count)} sync.</span>
                     </div>
                     <Progress 
                       value={(Number(region.synced) / Number(region.count)) * 100} 
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
                  <span className="font-semibold">
                    {agencies.filter(a => a.sync_status === 'pending').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Échec</span>
                  </div>
                  <span className="font-semibold">
                    {agencies.filter(a => a.sync_status === 'failed').length}
                  </span>
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
                       <p className="font-semibold">{String(region.count)}</p>
                     </div>
                     <div>
                       <p className="text-muted-foreground">Pays</p>
                       <p className="font-semibold">{String(region.countries)}</p>
                     </div>
                   </div>

                   <Progress 
                     value={(Number(region.synced) / Number(region.count)) * 100} 
                     className="h-2"
                   />
                   <p className="text-xs text-muted-foreground">
                     {String(region.synced)}/{String(region.count)} synchronisées
                   </p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card className="p-6">
            <div className="text-center py-8">
              <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Collecte de données en cours</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Les informations sur les projets seront disponibles une fois la synchronisation 
                avec les agences partenaires terminée.
              </p>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  🚀 {stats.synced} agences synchronisées sur {stats.total}
                </p>
              </div>
            </div>
          </Card>
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
                  <Badge 
                    variant={agency.sync_status === 'synced' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {agency.sync_status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{agency.country}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};