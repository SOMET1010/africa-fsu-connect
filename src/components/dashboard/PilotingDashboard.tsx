import { TelecomIndicatorsWidget } from "./widgets/TelecomIndicatorsWidget";
import { ModernStatsWidget } from "./widgets/ModernStatsWidget";
import { RealTimeMetricsWidget } from "./widgets/RealTimeMetricsWidget";
import { RecentActivityWidget } from "./widgets/RecentActivityWidget";
import { QuickActionsWidget } from "./widgets/QuickActionsWidget";
import { RegionalProgressWidget } from "./widgets/RegionalProgressWidget";
import { PageContainer } from "@/components/layout/PageContainer";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Download, Bell, TrendingUp, Activity } from "lucide-react";
import { useEnhancedDashboardStats } from "@/hooks/useEnhancedDashboardStats";
import { useTranslation } from "@/hooks/useTranslation";

export const PilotingDashboard = () => {
  const { profile } = useAuth();
  const { stats, loading } = useEnhancedDashboardStats();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Dashboard Header - Institutional tone */}
      <div className="glass-card m-6 p-8 border border-border/50">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold gradient-text">
                Tableau de Bord – Pilotage
              </h1>
              <Badge className="bg-primary/10 text-primary border-primary/20">
                <Activity className="h-3 w-3 mr-1" />
                Temps Réel
              </Badge>
            </div>
            <p className="text-muted-foreground text-lg">
              {t('dashboard.welcome', { name: profile?.first_name || 'Utilisateur' })}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Alertes
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurer
            </Button>
          </div>
        </div>
      </div>

      <PageContainer>
        <div className="space-y-6 animate-fade-in">
          {/* Indicateurs Télécoms - Section Principale */}
          <div className="animate-slide-up">
            <TelecomIndicatorsWidget />
          </div>

          {/* Première rangée - Métriques principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Card className="glass-card p-6 border border-border/50">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Statistiques Principales</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{stats.totalProjects}</div>
                    <div className="text-sm text-muted-foreground">{t('common.projects')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{stats.totalAgencies}</div>
                    <div className="text-sm text-muted-foreground">Agences</div>
                  </div>
                </div>
              </div>
            </Card>
            <Card className="glass-card p-6 border border-border/50">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Métriques Télécoms</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{stats.totalBtsSites}</div>
                    <div className="text-sm text-muted-foreground">Sites BTS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{stats.localitiesCovered}</div>
                    <div className="text-sm text-muted-foreground">Localités</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Deuxième rangée - Widgets interactifs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Card className="glass-card p-6 border border-border/50">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Activité Récente</h3>
                <div className="text-center py-8">
                  <div className="text-muted-foreground">Aucune activité récente</div>
                </div>
              </div>
            </Card>
            <Card className="glass-card p-6 border border-border/50">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Actions Rapides</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">Nouveau Projet</Button>
                  <Button variant="outline" size="sm">Rapport</Button>
                  <Button variant="outline" size="sm">Analyse</Button>
                  <Button variant="outline" size="sm">Export</Button>
                </div>
              </div>
            </Card>
            <Card className="glass-card p-6 border border-border/50">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Couverture Population</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{stats.coveragePercentage?.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Population Couverte</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Section analytique avancée */}
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Card className="glass-card p-8 border border-border/50">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl mx-auto flex items-center justify-center">
                  <TrendingUp className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Analyses Avancées</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Accédez à des insights approfondis pour optimiser vos performances
                </p>
                <Button className="mt-4">
                  Voir les Analyses
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};
