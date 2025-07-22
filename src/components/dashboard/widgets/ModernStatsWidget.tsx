
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton-loader";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface StatItem {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  icon: LucideIcon;
  color: string;
  clickable?: boolean;
  onStatClick?: () => void;
}

interface ModernStatsWidgetProps {
  stats: StatItem[];
  loading?: boolean;
  title?: string;
}

export const ModernStatsWidget = ({ 
  stats, 
  loading = false, 
  title = "Statistiques" 
}: ModernStatsWidgetProps) => {
  
  if (loading) {
    return (
      <EnhancedCard variant="glassmorphism" className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-3 p-4 border rounded-lg">
                <Skeleton variant="avatar" className="w-8 h-8" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </EnhancedCard>
    );
  }

  return (
    <ScrollReveal delay={200}>
      <EnhancedCard variant="glassmorphism" hover="glow" className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Aperçu de vos métriques importantes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <ScrollReveal key={index} delay={100 * (index + 1)} direction="up">
              <EnhancedCard
                variant="minimal"
                hover={stat.clickable ? "lift" : "none"}
                interactive={stat.clickable}
                onClick={stat.clickable ? stat.onStatClick : undefined}
                className="p-4 border border-border/50 bg-gradient-to-br from-card to-card/30 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${stat.color}`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  
                  {stat.change && (
                    <Badge 
                      variant={stat.change.trend === "up" ? "default" : stat.change.trend === "down" ? "destructive" : "secondary"}
                      className="text-xs flex items-center gap-1"
                    >
                      {stat.change.trend === "up" ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : stat.change.trend === "down" ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : null}
                      {stat.change.value}
                    </Badge>
                  )}
                </div>
                
                <div>
                  <div className="text-2xl font-bold text-foreground mb-1 transition-colors group-hover:text-primary">
                    {stat.value}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {stat.title}
                  </p>
                </div>
              </EnhancedCard>
            </ScrollReveal>
          ))}
        </div>
      </EnhancedCard>
    </ScrollReveal>
  );
};
