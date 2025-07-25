import { TrendingUp, TrendingDown, Users, FileText, Calendar, Target, Activity } from "lucide-react";
import { DashboardWidget } from "../DashboardWidget";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface StatsWidgetProps {
  id: string;
  stats: any;
  loading: boolean;
  onRemove?: (id: string) => void;
}

export const StatsWidget = ({ id, stats, loading, onRemove }: StatsWidgetProps) => {
  const isMobile = useIsMobile();

  const statsCards = [
    {
      title: "Utilisateurs Actifs",
      value: stats.activeUsers,
      total: stats.totalProfiles,
      icon: Users,
      trend: { value: stats.profilesGrowth, positive: stats.profilesGrowth > 0 },
      color: "text-blue-600",
      bgColor: "bg-blue-500/20"
    },
    {
      title: "Documents",
      value: stats.documentsThisPeriod,
      total: stats.totalDocuments,
      icon: FileText,
      trend: { value: stats.documentsGrowth, positive: stats.documentsGrowth > 0 },
      color: "text-green-600",
      bgColor: "bg-green-500/20"
    },
    {
      title: "Événements",
      value: stats.eventsThisPeriod,
      total: stats.totalEvents,
      icon: Calendar,
      trend: { value: stats.eventsGrowth, positive: stats.eventsGrowth > 0 },
      color: "text-purple-600",
      bgColor: "bg-purple-500/20"
    },
    {
      title: "Projets",
      value: stats.projectsThisPeriod,
      total: stats.totalProjects,
      icon: Target,
      trend: { value: 12, positive: true },
      color: "text-orange-600",
      bgColor: "bg-orange-500/20"
    }
  ];

  if (loading) {
    return (
      <DashboardWidget
        id={id}
        title="Statistiques Principales"
        icon={<Activity className="h-5 w-5" />}
        isRemovable
        onRemove={onRemove}
        className="col-span-full"
      >
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-lg"></div>
          ))}
        </div>
      </DashboardWidget>
    );
  }

  return (
    <DashboardWidget
      id={id}
      title="Statistiques Principales"
      icon={<Activity className="h-5 w-5 text-primary" />}
      isRemovable
      onRemove={onRemove}
      className="col-span-full"
    >
      <div className="space-y-4">
        {/* System Health Indicator */}
        <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Système en Ligne</span>
          </div>
          <Badge variant="secondary" className="bg-green-500/20 text-green-700">
            {stats.systemHealth?.uptime || 99.9}% Uptime
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {statsCards.map((stat, index) => (
            <div key={index} className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="flex items-center gap-1">
                  {stat.trend.positive ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.trend.positive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend.value > 0 ? '+' : ''}{stat.trend.value}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">{stat.title}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">{stat.value || 0}</span>
                  <span className="text-sm text-muted-foreground">/ {stat.total || 0}</span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      stat.color.includes('blue') ? 'bg-blue-500' :
                      stat.color.includes('green') ? 'bg-green-500' :
                      stat.color.includes('purple') ? 'bg-purple-500' :
                      'bg-orange-500'
                    }`}
                    style={{ width: `${Math.min(((stat.value || 0) / (stat.total || 1)) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.engagementRate || 85}%</div>
            <div className="text-sm text-muted-foreground">Taux d'Engagement</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.avgSessionDuration || 24}min</div>
            <div className="text-sm text-muted-foreground">Durée Moyenne</div>
          </div>
        </div>
      </div>
    </DashboardWidget>
  );
};