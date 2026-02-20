import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Bell, Settings, BarChart3, Activity, Radio, FileText, Globe, Rocket, Building2, FileIcon } from "lucide-react";
import { ModernStatsCard } from "@/components/ui/modern-stats-card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";

const AdminDashboard = () => {
  const [period, setPeriod] = useState<'24h' | '7d' | '30d' | '90d' | '1y'>('30d');

  // Fetch admin stats
  const { data: stats } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const [countries, projects, agencies, documents] = await Promise.all([
        supabase.from('countries').select('id', { count: 'exact', head: true }),
        supabase.from('agency_projects').select('id', { count: 'exact', head: true }),
        supabase.from('agencies').select('id', { count: 'exact', head: true }),
        supabase.from('documents').select('id', { count: 'exact', head: true })
      ]);
      return {
        countriesCount: countries.count || 0,
        projectsCount: projects.count || 0,
        agenciesCount: agencies.count || 0,
        documentsCount: documents.count || 0
      };
    }
  });

  const periodOptions = [
    { value: '24h', label: '24h' },
    { value: '7d', label: '7 jours' },
    { value: '30d', label: '30 jours' },
    { value: '90d', label: '90 jours' },
    { value: '1y', label: '1 an' }
  ];

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Tableau de Pilotage"
        description="Indicateurs de performance et outils d'administration du réseau UDC"
        badge="Administration"
        gradient
        actions={
          <>
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              {periodOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={period === option.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPeriod(option.value as typeof period)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="mr-2 h-4 w-4" />
              Alertes
            </Button>
            <Button size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Configurer
            </Button>
          </>
        }
      />

      <PageContainer>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="telecom" className="gap-2">
              <Radio className="h-4 w-4" />
              Télécoms
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Activity className="h-4 w-4" />
              Activité
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <FileText className="h-4 w-4" />
              Rapports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPIs */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ModernStatsCard
                title="Pays membres"
                value={stats?.countriesCount || 0}
                trend={{ value: 5, label: "vs mois dernier", positive: true }}
                icon={Globe}
              />
              <ModernStatsCard
                title="Projets FSU"
                value={stats?.projectsCount || 0}
                trend={{ value: 12, label: "vs mois dernier", positive: true }}
                icon={Rocket}
              />
              <ModernStatsCard
                title="Agences"
                value={stats?.agenciesCount || 0}
                trend={{ value: 3, label: "vs mois dernier", positive: true }}
                icon={Building2}
              />
              <ModernStatsCard
                title="Documents"
                value={stats?.documentsCount || 0}
                trend={{ value: 8, label: "vs mois dernier", positive: true }}
                icon={FileIcon}
              />
            </div>

            {/* Additional admin content */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Analyses de tendances</h3>
              <p className="text-muted-foreground">
                Les graphiques de tendances et analyses avancées seront affichés ici.
              </p>
            </GlassCard>
          </TabsContent>

          <TabsContent value="telecom" className="space-y-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Indicateurs Télécoms</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-3xl font-bold text-primary">1,250</p>
                  <p className="text-sm text-muted-foreground">Sites BTS</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-3xl font-bold text-primary">4,500</p>
                  <p className="text-sm text-muted-foreground">Localités couvertes</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-3xl font-bold text-primary">73%</p>
                  <p className="text-sm text-muted-foreground">Taux de couverture</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-3xl font-bold text-primary">150M</p>
                  <p className="text-sm text-muted-foreground">Population couverte</p>
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Journal d'activité</h3>
              <p className="text-muted-foreground">
                L'historique complet des activités et modifications sera affiché ici.
              </p>
            </GlassCard>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Rapports générés</h3>
              <p className="text-muted-foreground">
                Les rapports de pilotage et exports seront disponibles ici.
              </p>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </div>
  );
};

export default AdminDashboard;
