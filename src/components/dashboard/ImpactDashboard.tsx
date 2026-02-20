import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  FolderKanban, 
  Globe2,
  Download,
  RefreshCw,
  Calendar,
  Handshake,
  Activity,
  Lightbulb
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
import { LearningWidget } from "./widgets/LearningWidget";

// Generate collaborative alerts (network-oriented)
const generateAlerts = (stats: any): Alert[] => {
  const alerts: Alert[] = [];
  
  // Collaboration opportunity (not punitive)
  if (stats.coveragePercentage < 50) {
    alerts.push({
      id: "collaboration-opportunity",
      level: "critical",
      title: "Opportunité de collaboration",
      description: `${Math.round(50 - stats.coveragePercentage)}% de progression possible avec l'appui du réseau. Des pays membres peuvent partager leur expérience.`,
      action: { label: "Explorer les bonnes pratiques", href: "/projects?filter=inspiring" },
      timestamp: "Maintenant"
    });
  }

  // Coordination point (not warning)
  if (stats.projectsThisPeriod < 5 && stats.totalProjects > 0) {
    alerts.push({
      id: "coordination-point",
      level: "warning",
      title: "Point de coordination réseau",
      description: `${stats.projectsThisPeriod} nouveau(x) projet(s) partagé(s) ce mois. Le réseau peut aider à identifier de nouvelles initiatives.`,
      action: { label: "Partager un projet", href: "/submit" },
      timestamp: "Cette semaine"
    });
  }

  // Good news from the network
  if (stats.documentsThisPeriod > 0) {
    alerts.push({
      id: "new-resources",
      level: "info",
      title: "Nouvelles ressources partagées",
      description: `${stats.documentsThisPeriod} ressource(s) partagée(s) par des pays membres du réseau.`,
      action: { label: "Consulter", href: "/resources" },
      timestamp: "Récemment"
    });
  }

  // Network events
  if (stats.eventsThisPeriod > 0) {
    alerts.push({
      id: "network-events",
      level: "info",
      title: "Rencontres du réseau",
      description: `${stats.eventsThisPeriod} événement(s) de partage d'expériences prévu(s).`,
      action: { label: "Voir le calendrier", href: "/events" },
      timestamp: "À venir"
    });
  }

  return alerts;
};

// Generate trend data for sparklines (network-focused labels)
const generateTrendData = (stats: any) => {
  const generateSeries = (current: number, variance: number = 0.2) => {
    const data: number[] = [];
    for (let i = 0; i < 12; i++) {
      const factor = 0.7 + (i / 12) * 0.3 + (Math.random() - 0.5) * variance;
      data.push(Math.round(current * factor));
    }
    data[11] = current;
    return data;
  };

  return [
    {
      label: "Progression collective",
      data: generateSeries(stats.coveragePercentage, 0.1),
      currentValue: stats.coveragePercentage,
      previousValue: Math.round(stats.coveragePercentage * 0.92),
      unit: "%",
      color: "hsl(var(--primary))"
    },
    {
      label: "Projets partagés",
      data: generateSeries(stats.totalProjects, 0.15),
      currentValue: stats.totalProjects,
      previousValue: Math.round(stats.totalProjects * 0.88),
      color: "hsl(var(--success))"
    },
    {
      label: "Population bénéficiaire",
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

  // Network-oriented targets
  const targets = {
    members: 54, // All African countries
    projects: 150,
    population: 1.2e9,
    bestPractices: 50
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

  const collaborationCount = alerts.filter(a => a.level === 'critical').length;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header - Network-oriented */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">
            Vue Réseau UDC
          </h1>
          <p className="text-muted-foreground mt-1">
            Coordination collective des Fonds du Service Universel
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

          {collaborationCount > 0 && (
            <Badge className="bg-primary text-primary-foreground gap-1">
              <Handshake className="h-3 w-3" />
              {collaborationCount} opportunité(s)
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Executive Summary - Peer-to-peer narrative */}
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

      {/* Main Grid: Coordination + KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Coordination Panel (was Alerts) */}
        <div className="lg:col-span-1">
          <AlertsPanel alerts={alerts} />
        </div>

        {/* Network KPI Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <ImpactKPICard
            title="Pays membres actifs"
            value={stats.totalAgencies}
            target={targets.members}
            trend={8}
            icon={Globe2}
            color="primary"
            targetLabel="Objectif continental"
            trendLabel="de participation"
            delay={0}
          />
          <ImpactKPICard
            title="Projets partagés"
            value={stats.totalProjects}
            target={targets.projects}
            trend={stats.submissionsGrowth || 12}
            icon={FolderKanban}
            color="success"
            targetLabel="Objectif réseau"
            delay={1}
          />
          <ImpactKPICard
            title="Population bénéficiaire"
            value={stats.populationCovered}
            target={targets.population}
            trend={5}
            icon={Users}
            color="accent"
            format="population"
            targetLabel="Objectif 2030"
            delay={2}
          />
          <ImpactKPICard
            title="Bonnes pratiques"
            value={24}
            target={targets.bestPractices}
            trend={15}
            icon={Lightbulb}
            color="warning"
            targetLabel="Objectif partage"
            trendLabel="ce trimestre"
            delay={3}
          />
        </div>
      </div>

      {/* Map + Learning Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardMapWidget compact />
        </div>
        <LearningWidget maxItems={4} />
      </div>

      {/* Trends */}
      <TrendSparklines trends={trends} />

      {/* Recent Activity */}
      <RecentActivityWidget 
        id="dashboard-activity"
        activities={stats.recentActivities} 
      />
    </div>
  );
};
