import { ModernStatsCard } from "@/components/ui/modern-stats-card";
import { ModernCard } from "@/components/ui/modern-card";
import { Badge } from "@/components/ui/badge";
import { Globe, Activity, Database, BarChart3 } from "lucide-react";
import { GlobalIndicatorsWidget } from "@/components/dashboard/widgets/GlobalIndicatorsWidget";

export const SimplifiedIndicators = () => {
  const basicStats = [
    {
      title: "Pays Couverts",
      value: 12,
      icon: Globe,
      trend: { value: 8, label: "Nouveaux", positive: true },
      description: "Couverture régionale"
    },
    {
      title: "Indicateurs",
      value: 48,
      icon: Activity,
      trend: { value: 12, label: "Ce mois", positive: true },
      description: "Métriques actives"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {basicStats.map((stat, index) => (
          <ModernStatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            description={stat.description}
            variant="gradient"
            size="md"
          />
        ))}
      </div>

      {/* Quick Info */}
      <ModernCard variant="glass" className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Globe className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Indicateurs FSU</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Suivez les indicateurs essentiels du Service Universel des télécommunications
        </p>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs">
            <Globe className="h-3 w-3 mr-1" />
            12 Pays
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <Activity className="h-3 w-3 mr-1" />
            Temps Réel
          </Badge>
        </div>
      </ModernCard>

      {/* Simplified Dashboard */}
      <ModernCard variant="glass" className="p-4">
        <div className="mb-4">
          <h3 className="font-semibold text-foreground mb-1">Dashboard Principal</h3>
          <p className="text-sm text-muted-foreground">
            Vue d'ensemble des données essentielles
          </p>
        </div>
        <GlobalIndicatorsWidget />
      </ModernCard>
    </div>
  );
};