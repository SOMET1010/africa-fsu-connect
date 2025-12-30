import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart3, 
  Users, 
  FolderKanban, 
  Globe2,
  Download,
  RefreshCw,
  Calendar,
  Bell,
  Wallet,
  Activity
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useEnhancedDashboardStats, TimeRange } from "@/hooks/useEnhancedDashboardStats";
import { useAuth } from "@/contexts/AuthContext";
import { ExecutiveSummary } from "./components/ExecutiveSummary";
import { AlertsPanel, Alert } from "./components/AlertsPanel";
import { ImpactKPICard } from "./components/ImpactKPICard";
import { TrendSparklines } from "./components/TrendSparklines";
import { DashboardMapWidget } from "./widgets/DashboardMapWidget";
import { RecentActivityWidget } from "./widgets/RecentActivityWidget";

// Generate mock alerts based on stats
const generateAlerts = (stats: any): Alert[] => {
  const alerts: Alert[] = [];
  
  // Critical: Low coverage
  if (stats.coveragePercentage < 50) {
    alerts.push({
      id: "coverage-low",
      level: "critical",
      title: "Couverture insuffisante",
      description: `Le taux de couverture actuel (${stats.coveragePercentage}%) est en dessous de l'objectif minimum de 50%.`,
      action: { label: "Voir les projets", href: "/projects" },
      timestamp: "Maintenant"
    });
  }

  // Warning: Projects needing attention
  if (stats.projectsThisPeriod < 5 && stats.totalProjects > 0) {
    alerts.push({
      id: "projects-slow",
      level: "warning",
      title: "Ralentissement des nouveaux projets",
      description: `Seulement ${stats.projectsThisPeriod} nouveaux projets ce mois. Objectif: 10 projets/mois.`,
      project: "Tous projets",
      action: { label: "Soumettre un projet", href: "/submit" },
      timestamp: "Cette semaine"
    });
  }

  // Info: New documents
  if (stats.documentsThisPeriod > 0) {
    alerts.push({
      id: "new-docs",
      level: "info",
      title: "Nouvelles ressources disponibles",
      description: `${stats.documentsThisPeriod} nouveau(x) document(s) ajouté(s) à la bibliothèque.`,
      action: { label: "Consulter", href: "/resources" },
      timestamp: "Récemment"
    });
  }

  // Warning: Events coming soon
  if (stats.eventsThisPeriod > 0) {
    alerts.push({
      id: "events-soon",
      level: "info",
      title: "Événements à venir",
      description: `${stats.eventsThisPeriod} événement(s) prévu(s) prochainement.`,
      action: { label: "Voir le calendrier", href: "/events" },
      timestamp: "Cette semaine"
    });
  }

  return alerts;
};

// Generate trend data for sparklines
const generateTrendData = (stats: any) => {
  // Simulate historical data based on current values
  const generateSeries = (current: number, variance: number = 0.2) => {
    const data: number[] = [];
    for (let i = 0; i < 12; i++) {
      const factor = 0.7 + (i / 12) * 0.3 + (Math.random() - 0.5) * variance;
      data.push(Math.round(current * factor));
    }
    data[11] = current; // Last value is current
    return data;
  };

  return [
    {
      label: "Couverture",
      data: generateSeries(stats.coveragePercentage, 0.1),
      currentValue: stats.coveragePercentage,
      previousValue: Math.round(stats.coveragePercentage * 0.92),
      unit: "%",
      color: "hsl(var(--primary))"
    },
    {
      label: "Projets actifs",
      data: generateSeries(stats.totalProjects, 0.15),
      currentValue: stats.totalProjects,
      previousValue: Math.round(stats.totalProjects * 0.88),
      color: "hsl(var(--success))"
    },
    {
      label: "Population couverte",
      data: generateSeries(stats.populationCovered / 1e6, 0.1),
      currentValue: Math.round(stats.populationCovered / 1e6),
      previousValue: Math.round(stats.populationCovered / 1e6 * 0.95),
      unit: "M",
      color: "hsl(var(--accent))"
    }
  ];
};

const periodLabels: Record<TimeRange, string> = {
  "24h": "les 24 dernières heures",
  "7d": "les 7 derniers jours",
  "30d": "ce mois",
  "90d": "ce trimestre",
  "1y": "cette année"
};

export const ImpactDashboard = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const { stats, loading, error, refreshStats } = useEnhancedDashboardStats(timeRange);
  const { user } = useAuth();

  const alerts = generateAlerts(stats);
  const trends = generateTrendData(stats);

  // Calculate targets
  const targets = {
    coverage: 95,
    projects: 150,
    population: 1.2e9,
    agencies: 60
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-48" />
        </div>
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <Activity className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Erreur de chargement</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={refreshStats}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">
            Vue d'impact
          </h1>
          <p className="text-muted-foreground mt-1">
            Pilotage du réseau FSU africain
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 heures</SelectItem>
              <SelectItem value="7d">7 jours</SelectItem>
              <SelectItem value="30d">30 jours</SelectItem>
              <SelectItem value="90d">90 jours</SelectItem>
              <SelectItem value="1y">1 an</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={refreshStats}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>

          {alerts.filter(a => a.level === 'critical').length > 0 && (
            <Badge variant="destructive" className="gap-1 animate-pulse">
              <Bell className="h-3 w-3" />
              {alerts.filter(a => a.level === 'critical').length} alerte(s)
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Executive Summary */}
      <ExecutiveSummary 
        stats={{
          totalProjects: stats.totalProjects,
          coveragePercentage: stats.coveragePercentage,
          populationCovered: stats.populationCovered,
          projectsGrowth: stats.documentsGrowth || 12,
          totalAgencies: stats.totalAgencies
        }}
        alerts={alerts}
        periodLabel={periodLabels[timeRange]}
      />

      {/* Main Grid: Alerts + KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Alerts Panel */}
        <div className="lg:col-span-1">
          <AlertsPanel alerts={alerts} />
        </div>

        {/* KPI Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <ImpactKPICard
            title="Couverture"
            value={stats.coveragePercentage}
            target={targets.coverage}
            trend={stats.profilesGrowth}
            icon={Globe2}
            color="primary"
            format="percentage"
            delay={0}
          />
          <ImpactKPICard
            title="Projets actifs"
            value={stats.totalProjects}
            target={targets.projects}
            trend={stats.submissionsGrowth || 12}
            icon={FolderKanban}
            color="success"
            delay={1}
          />
          <ImpactKPICard
            title="Population couverte"
            value={stats.populationCovered}
            target={targets.population}
            trend={5}
            icon={Users}
            color="accent"
            format="population"
            delay={2}
          />
          <ImpactKPICard
            title="Agences FSU"
            value={stats.totalAgencies}
            target={targets.agencies}
            trend={8}
            icon={BarChart3}
            color="info"
            delay={3}
          />
        </div>
      </div>

      {/* Map + Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardMapWidget compact />
        <TrendSparklines trends={trends} />
      </div>

      {/* Recent Activity */}
      <RecentActivityWidget 
        id="dashboard-activity"
        activities={stats.recentActivities} 
      />
    </div>
  );
};
