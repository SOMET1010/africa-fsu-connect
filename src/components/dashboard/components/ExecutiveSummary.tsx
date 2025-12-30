import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Users, Handshake } from "lucide-react";
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
  const collaborationOpportunities = alerts.filter(a => a.level === 'critical').length;
  const discussionPoints = alerts.filter(a => a.level === 'warning').length;

  // Network-oriented narrative (peer-to-peer)
  const getNetworkDynamic = () => {
    if (stats.coveragePercentage >= 80) return "est en forte dynamique collective";
    if (stats.coveragePercentage >= 60) return "progresse ensemble";
    if (stats.coveragePercentage >= 40) return "construit ses synergies";
    return "renforce ses liens";
  };

  const getGrowthDescription = () => {
    if (stats.projectsGrowth > 15) return "forte dynamique de partage";
    if (stats.projectsGrowth > 5) return "collaboration soutenue";
    if (stats.projectsGrowth > 0) return "échanges réguliers";
    if (stats.projectsGrowth === 0) return "stabilité du réseau";
    return "consolidation en cours";
  };

  const getCollaborationPhrase = () => {
    if (collaborationOpportunities > 0) {
      return `${collaborationOpportunities} opportunité${collaborationOpportunities > 1 ? 's' : ''} de collaboration identifiée${collaborationOpportunities > 1 ? 's' : ''}.`;
    }
    if (discussionPoints > 0) {
      return `${discussionPoints} point${discussionPoints > 1 ? 's' : ''} de coordination à explorer ensemble.`;
    }
    return "Tous les pays membres avancent au rythme prévu.";
  };

  const formatPopulation = (pop: number) => {
    if (pop >= 1e9) return `${(pop / 1e9).toFixed(1)} milliard`;
    if (pop >= 1e6) return `${(pop / 1e6).toFixed(0)} millions`;
    return pop.toLocaleString();
  };

  const getTrendIcon = () => {
    if (stats.projectsGrowth > 0) return <TrendingUp className="h-4 w-4 text-success" />;
    if (stats.projectsGrowth < 0) return <TrendingDown className="h-4 w-4 text-warning" />;
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
              <Handshake className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-semibold text-foreground">
                  Synthèse Réseau
                </h2>
                <Badge variant="outline" className="text-xs">
                  {periodLabel}
                </Badge>
                {getTrendIcon()}
              </div>

              <div className="space-y-2">
                <p className="text-base leading-relaxed text-foreground/90">
                  Le réseau SUTEL <strong className="text-primary">{getNetworkDynamic()}</strong> : {" "}
                  <strong>{stats.totalAgencies} pays membres</strong> partagent{" "}
                  <strong>{stats.totalProjects} projets</strong>, bénéficiant à{" "}
                  <strong className="text-accent">{formatPopulation(stats.populationCovered)} de personnes</strong>.
                </p>

                <p className="text-sm text-muted-foreground">
                  Dynamique : <span className={stats.projectsGrowth >= 0 ? "text-success font-medium" : "text-warning font-medium"}>
                    {getGrowthDescription()} ({stats.projectsGrowth > 0 ? "+" : ""}{stats.projectsGrowth}% {periodLabel})
                  </span>. {getCollaborationPhrase()}
                </p>
              </div>

              {(collaborationOpportunities > 0 || discussionPoints > 0) && (
                <div className="flex gap-2 pt-1">
                  {collaborationOpportunities > 0 && (
                    <Badge className="bg-primary/90 text-primary-foreground text-xs">
                      <Handshake className="h-3 w-3 mr-1" />
                      {collaborationOpportunities} opportunité{collaborationOpportunities > 1 ? 's' : ''} de collaboration
                    </Badge>
                  )}
                  {discussionPoints > 0 && (
                    <Badge className="bg-info text-info-foreground text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {discussionPoints} point{discussionPoints > 1 ? 's' : ''} de coordination
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
