
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Globe, TrendingUp, Users, Wifi, Activity, Database, Zap, Globe2, Shield } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useEnhancedIndicators, useRegionalIndicatorStats, useDataSourceStats } from "@/hooks/useEnhancedIndicators";
import { logger } from '@/utils/logger';
import type { TooltipFormatter } from '@/types/common';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export const GlobalIndicatorsWidget = () => {
  logger.debug("GlobalIndicatorsWidget component rendering", { component: 'GlobalIndicatorsWidget' });
  
  const { data: indicators, isLoading: indicatorsLoading } = useEnhancedIndicators({ year: 2024 });
  const { data: regionalStats, isLoading: regionalLoading } = useRegionalIndicatorStats();
  const { data: sourceStats, isLoading: sourceLoading } = useDataSourceStats();

  // Traitement des données pour les graphiques
  const connectivityData = indicators?.filter(ind => 
    ['INTERNET_PENETRATION', 'MOBILE_PENETRATION', 'NETWORK_COVERAGE_4G', 'NETWORK_COVERAGE_5G']
    .includes(ind.indicator_code)
  ).slice(0, 20) || [];

  const regionData = regionalStats?.map((stat, index) => ({
    name: stat.region,
    value: stat.totalIndicators,
    coverage: stat.coverage,
    color: COLORS[index % COLORS.length]
  })) || [];

  const countryComparisonData = indicators?.filter(ind => 
    ind.indicator_code === 'INTERNET_PENETRATION'
  ).slice(0, 8).map(ind => ({
    name: ind.country_code,
    internet: ind.value,
    mobile: indicators?.find(i => i.country_code === ind.country_code && i.indicator_code === 'MOBILE_PENETRATION')?.value || 0,
    coverage4g: indicators?.find(i => i.country_code === ind.country_code && i.indicator_code === 'NETWORK_COVERAGE_4G')?.value || 0
  })) || [];

  if (indicatorsLoading || regionalLoading || sourceLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-3 h-32 bg-muted animate-pulse rounded-lg" />
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
        <div className="lg:col-span-2 xl:col-span-3 h-80 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  const totalIndicators = indicators?.length || 0;
  const uniqueCountries = new Set(indicators?.map(i => i.country_code)).size;
  const uniqueRegions = new Set(indicators?.map(i => i.region)).size;
  const latestYear = Math.max(...(indicators?.map(i => i.year) || [2024]));

  // Calculer les standards internationaux
  const internationalStandards = indicators?.filter(ind => 
    ind.metadata?.category && ['Infrastructure', 'Inclusion', 'Qualité', 'Économique'].includes(ind.metadata.category)
  ).length || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Overview Stats Enhanced avec Standards Internationaux */}
      <ScrollReveal className="xl:col-span-3">
        <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Globe2 className="h-6 w-6 text-blue-600" />
              Indicateurs FSU - Standards Internationaux ITU/OCDE/G20
            </CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="default" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Standards ITU/OCDE
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Multi-Sources Officielles
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                Temps Réel
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalIndicators.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Indicateurs Totaux</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{internationalStandards}</div>
                <div className="text-sm text-muted-foreground">Standards Internationaux</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{uniqueCountries}</div>
                <div className="text-sm text-muted-foreground">Pays Couverts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{uniqueRegions}</div>
                <div className="text-sm text-muted-foreground">Régions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-1">{sourceStats?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Sources API</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-2">{latestYear}</div>
                <div className="text-sm text-muted-foreground">Dernière Année</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* Connectivity Progress Enhanced */}
      <ScrollReveal>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-primary" />
              Indicateurs Clés de Connectivité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {connectivityData.slice(0, 6).map((indicator, index) => {
              const target = indicator.indicator_code === 'INTERNET_PENETRATION' ? 75 :
                            indicator.indicator_code === 'MOBILE_PENETRATION' ? 120 :
                            indicator.indicator_code === 'NETWORK_COVERAGE_4G' ? 90 :
                            indicator.indicator_code === 'NETWORK_COVERAGE_5G' ? 50 : 100;
              
              const progress = Math.min((indicator.value / target) * 100, 100);
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{indicator.country_code}</span>
                    <span className="text-muted-foreground">
                      {indicator.value.toFixed(1)}{indicator.unit === 'pourcentage' ? '%' : ''}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{indicator.indicator_name}</span>
                    <Badge variant="outline" className="text-xs">
                      {indicator.data_source}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* Regional Distribution Enhanced */}
      <ScrollReveal>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-secondary" />
              Couverture Régionale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={((value: number, name: string) => [`${value} indicateurs`, 'Total']) as TooltipFormatter} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {regionData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <div className="flex-1">
                    <div className="text-xs font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.coverage}% couverture</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* Country Comparison Enhanced */}
      <ScrollReveal className="lg:col-span-2 xl:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Comparaison Multi-Indicateurs par Pays
            </CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">Pénétration Internet</Badge>
              <Badge variant="outline">Pénétration Mobile</Badge>
              <Badge variant="outline">Couverture 4G</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={countryComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={((value: number, name: string) => [`${value?.toFixed(1)}%`, name]) as TooltipFormatter} />
                <Bar dataKey="internet" fill="hsl(var(--primary))" name="Internet %" />
                <Bar dataKey="mobile" fill="hsl(var(--secondary))" name="Mobile %" />
                <Bar dataKey="coverage4g" fill="hsl(var(--accent))" name="4G %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* Data Sources Enhanced */}
      <ScrollReveal>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-chart-1" />
              Sources de Données Actives
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sourceStats?.slice(0, 5).map((source, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-sm">{source.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {source.totalIndicators} indicateurs • {source.categories.length} catégories
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Maj: {new Date(source.lastUpdate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={source.apiStatus === 'active' ? 'default' : 'secondary'} className="text-xs">
                      {source.apiStatus}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {source.reliability}% fiabilité
                    </Badge>
                  </div>
                </div>
                <Badge variant={source.totalIndicators > 100 ? "default" : "secondary"}>
                  {source.totalIndicators > 1000 ? `${Math.round(source.totalIndicators/1000)}k` : source.totalIndicators}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </ScrollReveal>
    </div>
  );
};
