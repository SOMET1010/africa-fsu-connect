import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";
import type { Alert } from "./AlertsPanel";

interface ExecutiveSummaryProps {
  stats: {
    totalProjects: number;
    coveragePercentage: number;
    populationCovered: number;
    projectsGrowth: number;
    totalAgencies: number;
  };
  alerts: Alert[];
  periodLabel?: string;
}

export const ExecutiveSummary = ({ 
  stats, 
  alerts, 
  periodLabel = "ce trimestre" 
}: ExecutiveSummaryProps) => {
  const criticalAlerts = alerts.filter(a => a.level === 'critical').length;
  const warningAlerts = alerts.filter(a => a.level === 'warning').length;

  // Generate narrative based on stats
  const getCoverageStatus = () => {
    if (stats.coveragePercentage >= 80) return "progresse excellemment";
    if (stats.coveragePercentage >= 60) return "avance régulièrement";
    if (stats.coveragePercentage >= 40) return "se développe";
    return "nécessite une accélération";
  };

  const getGrowthDescription = () => {
    if (stats.projectsGrowth > 15) return "forte croissance";
    if (stats.projectsGrowth > 5) return "croissance soutenue";
    if (stats.projectsGrowth > 0) return "légère progression";
    if (stats.projectsGrowth === 0) return "stabilité";
    return "baisse";
  };

  const getAlertPhrase = () => {
    if (criticalAlerts > 0) {
      return `${criticalAlerts} projet${criticalAlerts > 1 ? 's' : ''} nécessite${criticalAlerts > 1 ? 'nt' : ''} une attention immédiate.`;
    }
    if (warningAlerts > 0) {
      return `${warningAlerts} point${warningAlerts > 1 ? 's' : ''} de vigilance à surveiller.`;
    }
    return "Tous les projets sont dans les délais prévus.";
  };

  const formatPopulation = (pop: number) => {
    if (pop >= 1e9) return `${(pop / 1e9).toFixed(1)} milliard`;
    if (pop >= 1e6) return `${(pop / 1e6).toFixed(0)} millions`;
    return pop.toLocaleString();
  };

  const getTrendIcon = () => {
    if (stats.projectsGrowth > 0) return <TrendingUp className="h-4 w-4 text-success" />;
    if (stats.projectsGrowth < 0) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="premium-card border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-xl bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-semibold text-foreground">
                  Synthèse exécutive
                </h2>
                <Badge variant="outline" className="text-xs">
                  {periodLabel}
                </Badge>
                {getTrendIcon()}
              </div>

              <div className="space-y-2">
                <p className="text-base leading-relaxed text-foreground/90">
                  Le réseau FSU africain <strong className="text-primary">{getCoverageStatus()}</strong> avec{" "}
                  <strong>{stats.totalProjects} projets actifs</strong> répartis sur{" "}
                  <strong>{stats.totalAgencies} agences</strong>, couvrant{" "}
                  <strong className="text-accent">{stats.coveragePercentage}%</strong> de la population cible
                  soit environ <strong>{formatPopulation(stats.populationCovered)} de personnes</strong>.
                </p>

                <p className="text-sm text-muted-foreground">
                  Tendance : <span className={stats.projectsGrowth >= 0 ? "text-success font-medium" : "text-destructive font-medium"}>
                    {getGrowthDescription()} ({stats.projectsGrowth > 0 ? "+" : ""}{stats.projectsGrowth}% {periodLabel})
                  </span>. {getAlertPhrase()}
                </p>
              </div>

              {(criticalAlerts > 0 || warningAlerts > 0) && (
                <div className="flex gap-2 pt-1">
                  {criticalAlerts > 0 && (
                    <Badge variant="destructive" className="text-xs animate-pulse">
                      {criticalAlerts} alerte{criticalAlerts > 1 ? 's' : ''} critique{criticalAlerts > 1 ? 's' : ''}
                    </Badge>
                  )}
                  {warningAlerts > 0 && (
                    <Badge className="bg-warning text-warning-foreground text-xs">
                      {warningAlerts} point{warningAlerts > 1 ? 's' : ''} d'attention
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
