import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { AdminStat } from "../hooks/useAdminPage";

interface AdminStatsGridProps {
  stats: AdminStat[];
}

export const AdminStatsGrid = ({ stats }: AdminStatsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <GlassCard 
            key={index}
            variant="default" 
            className="p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-foreground">
                    <AnimatedCounter value={stat.value} />
                  </span>
                  <span className="text-xs font-medium text-emerald-500">
                    {stat.description}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
};
