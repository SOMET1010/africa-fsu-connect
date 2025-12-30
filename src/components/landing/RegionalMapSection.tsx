import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Building2, TrendingUp, Eye } from "lucide-react";
import { useAgencies } from "@/hooks/useAgencies";
import { useRegionalIndicatorStats } from "@/hooks/useRegionalStats";
import { LeafletInteractiveMap } from "@/components/organizations/LeafletInteractiveMap";
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

export const RegionalMapSection = () => {
  const { t } = useTranslation();
  const { agencies, loading: agenciesLoading } = useAgencies();
  const { data: regionalStats, isLoading: statsLoading } = useRegionalIndicatorStats();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Filter agencies with SUTEL type
  const sutelAgencies = agencies?.filter(agency => {
    const metadata = agency.metadata as { sutel_type?: string } | null;
    return metadata?.sutel_type;
  }) || [];

  // Calculate regional statistics
  const regionStats = sutelAgencies.reduce((acc, agency) => {
    const region = agency.region || 'Autre';
    if (!acc[region]) {
      acc[region] = { agencies: 0, countries: new Set(), syncedAgencies: 0 };
    }
    acc[region].agencies++;
    acc[region].countries.add(agency.country);
    if (agency.sync_status === 'synced') {
      acc[region].syncedAgencies++;
    }
    return acc;
  }, {} as Record<string, { agencies: number; countries: Set<string>; syncedAgencies: number }>);

  const regions = Object.entries(regionStats).map(([name, stats]) => ({
    name,
    agencies: stats.agencies,
    countries: stats.countries.size,
    syncRate: stats.agencies > 0 ? Math.round((stats.syncedAgencies / stats.agencies) * 100) : 0,
    indicators: regionalStats?.find(r => r.region === name)?.totalIndicators || 0
  }));

  if (agenciesLoading || statsLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-muted/30 via-background to-muted/20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mx-auto mb-4" />
            <div className="h-4 bg-muted rounded w-96 mx-auto mb-8" />
            <div className="h-96 bg-muted rounded-lg" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 via-background to-muted/20 relative z-10">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-2 bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
            <MapPin className="w-4 h-4 mr-2" />
            {t('nexus.interactive.map')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('nexus.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('nexus.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Interactive Map */}
          <div className="lg:col-span-2">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    {t('nexus.interactive.map')}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {sutelAgencies.length} agences
                    </Badge>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/organizations" className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {t('common.view')}
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-96 rounded-lg overflow-hidden">
                  <LeafletInteractiveMap agencies={sutelAgencies} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Regional Statistics */}
          <div className="space-y-4">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Statistiques Régionales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {regions.map((region, index) => (
                  <div
                    key={region.name}
                    className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer hover:scale-[1.02] animate-fade-in ${
                      selectedRegion === region.name
                        ? 'border-primary bg-primary/5'
                        : 'border-border/50 bg-muted/30 hover:bg-muted/50'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSelectedRegion(
                      selectedRegion === region.name ? null : region.name
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{region.name}</h3>
                      <Badge 
                        variant={region.syncRate > 75 ? "default" : region.syncRate > 50 ? "secondary" : "destructive"}
                        className="text-xs"
                      >
                        {region.syncRate}% sync
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {region.agencies} agences
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {region.countries} pays
                      </div>
                    </div>

                    {region.indicators > 0 && (
                      <div className="mt-2 pt-2 border-t border-border/30">
                        <div className="text-xs text-muted-foreground">
                          {region.indicators} indicateurs FSU
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-blue-500/5 backdrop-blur-sm">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 text-foreground">Actions Rapides</h3>
                <div className="space-y-2">
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to="/organizations">
                      <Building2 className="h-4 w-4 mr-2" />
                      Voir toutes les agences
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to="/projects">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Explorer les projets
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to="/dashboard">
                      <Globe className="h-4 w-4 mr-2" />
                      Tableau de bord
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};