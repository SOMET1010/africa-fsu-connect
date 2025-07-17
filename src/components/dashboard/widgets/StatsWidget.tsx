import { LucideIcon } from "lucide-react";
import { DashboardWidget } from "../DashboardWidget";
import { CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { StatusIndicator } from "@/components/ui/status-indicator";

interface StatItem {
  title: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  color: string;
  clickable?: boolean;
  onStatClick?: () => void;
}

interface StatsWidgetProps {
  id: string;
  stats: StatItem[];
  loading?: boolean;
  onRemove?: (id: string) => void;
}

export const StatsWidget = ({ id, stats, loading, onRemove }: StatsWidgetProps) => {
  const isMobile = useIsMobile();
  
  if (loading) {
    return (
      <DashboardWidget
        id={id}
        title="Statistiques"
        isRemovable
        onRemove={onRemove}
      >
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'}`}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
              <div className="h-8 bg-muted rounded w-16 animate-pulse"></div>
              <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>
            </div>
          ))}
        </div>
      </DashboardWidget>
    );
  }

  return (
    <DashboardWidget
      id={id}
      title="Statistiques"
      isRemovable
      onRemove={onRemove}
    >
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'}`}>
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`space-y-2 p-3 rounded-lg border border-border/50 transition-all duration-200 animate-fade-in hover:shadow-medium
              ${stat.clickable ? 'cursor-pointer hover:border-primary/30 hover:bg-muted/30 hover:scale-105' : ''}`}
            onClick={stat.clickable ? stat.onStatClick : undefined}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground truncate">
                {stat.title}
              </p>
              <stat.icon className={`h-4 w-4 ${stat.color} flex-shrink-0`} />
            </div>
            <div className="text-2xl font-bold text-foreground animate-fade-in">{stat.value}</div>
            {stat.change && (
              <div className="flex items-center space-x-1">
                <StatusIndicator status="success" size="sm" />
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </DashboardWidget>
  );
};