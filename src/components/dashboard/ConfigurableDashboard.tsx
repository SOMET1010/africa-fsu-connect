import { useState } from "react";
import { Settings, Plus, Filter, Calendar, BarChart3, Maximize2, Minimize2 } from "lucide-react";
import { useDashboardLayout } from "@/hooks/useDashboardLayout";
import { useEnhancedDashboardStats } from "@/hooks/useEnhancedDashboardStats";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PageContainer } from "@/components/layout/PageContainer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { StatsWidget } from "./widgets/StatsWidget";
import { RecentActivityWidget } from "./widgets/RecentActivityWidget";
import { RegionalProgressWidget } from "./widgets/RegionalProgressWidget";
import { QuickActionsWidget } from "./widgets/QuickActionsWidget";
import { RealTimeMetricsWidget } from "./widgets/RealTimeMetricsWidget";
import { CustomMetricsWidget } from "./widgets/CustomMetricsWidget";

export type TimeRange = '24h' | '7d' | '30d' | '90d' | '1y';

export const ConfigurableDashboard = () => {
  const { layout, enabledWidgets, isLoading, toggleWidget, resetLayout } = useDashboardLayout();
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { stats, loading: statsLoading, refreshStats } = useEnhancedDashboardStats(timeRange);

  const availableWidgets = [
    { id: 'stats', label: 'Statistiques Principales', description: 'Métriques clés du système' },
    { id: 'real-time-metrics', label: 'Métriques Temps Réel', description: 'Données en direct' },
    { id: 'regional-progress', label: 'Progrès Régional', description: 'Vue par région' },
    { id: 'recent-activity', label: 'Activité Récente', description: 'Actions récentes' },
    { id: 'quick-actions', label: 'Actions Rapides', description: 'Raccourcis utiles' },
    { id: 'custom-metrics', label: 'Métriques Personnalisées', description: 'Indicateurs sur mesure' }
  ];

  const renderWidget = (widget: any) => {
    const widgetProps = {
      id: widget.id,
      timeRange,
      onRemove: () => toggleWidget(widget.id),
      config: widget.config
    };

    switch (widget.type) {
      case 'stats':
        return <StatsWidget id={widget.id} stats={stats} loading={statsLoading} onRemove={() => toggleWidget(widget.id)} />;
      case 'real-time-metrics':
        return <RealTimeMetricsWidget id={widget.id} onRemove={() => toggleWidget(widget.id)} />;
      case 'regional-progress':
        return <RegionalProgressWidget id={widget.id} regions={stats.regionalData || []} onRemove={() => toggleWidget(widget.id)} />;
      case 'recent-activity':
        return <RecentActivityWidget id={widget.id} activities={stats.recentActivities || []} onRemove={() => toggleWidget(widget.id)} />;
      case 'quick-actions':
        return <QuickActionsWidget id={widget.id} onRemove={() => toggleWidget(widget.id)} />;
      case 'custom-metrics':
        return <CustomMetricsWidget id={widget.id} onRemove={() => toggleWidget(widget.id)} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <PageContainer size="xl" padding="md">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-muted/20 transition-all duration-300 ${
      isFullscreen ? 'fixed inset-0 z-50' : ''
    }`}>
      <PageContainer size="xl" padding="md" className="space-y-6">
        
        {/* Dashboard Header */}
        <ScrollReveal direction="fade">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                Tableau de Bord Intelligent
              </h1>
              <p className="text-muted-foreground mt-1">
                Dashboard configuré personnalisé • {enabledWidgets.length} widgets actifs
              </p>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              {/* Time Range Filter */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 heures</SelectItem>
                    <SelectItem value="7d">7 jours</SelectItem>
                    <SelectItem value="30d">30 jours</SelectItem>
                    <SelectItem value="90d">3 mois</SelectItem>
                    <SelectItem value="1y">1 an</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Fullscreen Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>

              {/* Refresh */}
              <Button
                variant="outline"
                size="sm"
                onClick={refreshStats}
                disabled={statsLoading}
              >
                <Filter className="h-4 w-4 mr-2" />
                Actualiser
              </Button>

              {/* Configuration Panel */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurer
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-80">
                  <SheetHeader>
                    <SheetTitle>Configuration du Dashboard</SheetTitle>
                    <SheetDescription>
                      Personnalisez votre espace de travail
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Widgets Disponibles</h4>
                      <div className="space-y-3">
                        {availableWidgets.map((widget) => {
                          const isEnabled = layout.widgets.find(w => w.id === widget.id)?.enabled || false;
                          return (
                            <div key={widget.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <Label htmlFor={widget.id} className="font-medium cursor-pointer">
                                  {widget.label}
                                </Label>
                                <p className="text-sm text-muted-foreground">{widget.description}</p>
                              </div>
                              <Switch
                                id={widget.id}
                                checked={isEnabled}
                                onCheckedChange={() => toggleWidget(widget.id)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Button variant="outline" onClick={resetLayout} className="w-full">
                        Réinitialiser la Configuration
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </ScrollReveal>

        {/* Active Filters Display */}
        {timeRange !== '30d' && (
          <ScrollReveal direction="up" delay={100}>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filtres actifs:</span>
              <Badge variant="secondary" className="gap-1">
                <Calendar className="h-3 w-3" />
                {timeRange === '24h' ? '24 heures' : 
                 timeRange === '7d' ? '7 jours' : 
                 timeRange === '90d' ? '3 mois' : 
                 timeRange === '1y' ? '1 an' : '30 jours'}
              </Badge>
            </div>
          </ScrollReveal>
        )}

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enabledWidgets.map((widget, index) => (
            <ScrollReveal key={widget.id} direction="up" delay={200 + index * 100}>
              <div className="transition-all duration-300 hover:scale-[1.02]">
                {renderWidget(widget)}
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Empty State */}
        {enabledWidgets.length === 0 && (
          <ScrollReveal direction="fade" delay={300}>
            <div className="text-center py-12 bg-background/50 backdrop-blur-sm rounded-xl border border-border/50">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Aucun widget activé
              </h3>
              <p className="text-muted-foreground mb-4">
                Activez des widgets pour commencer à visualiser vos données
              </p>
              <Sheet>
                <SheetTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter des Widgets
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-80">
                  <SheetHeader>
                    <SheetTitle>Ajouter des Widgets</SheetTitle>
                    <SheetDescription>
                      Sélectionnez les widgets à afficher
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-3">
                    {availableWidgets.map((widget) => (
                      <Button
                        key={widget.id}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => toggleWidget(widget.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {widget.label}
                      </Button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </ScrollReveal>
        )}
      </PageContainer>
    </div>
  );
};