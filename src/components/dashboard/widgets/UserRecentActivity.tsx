import { Clock, ArrowRight, FileText, Send, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { RecentActivityItem } from "@/hooks/useUserDashboardKPIs";
import { Skeleton } from "@/components/ui/skeleton";

interface UserRecentActivityProps {
  activities: RecentActivityItem[];
  loading: boolean;
  onViewAll?: () => void;
}

const typeConfig: Record<RecentActivityItem["type"], { dot: string; icon: typeof FileText; label: string }> = {
  submission: { dot: "bg-purple-600 dark:bg-purple-400", icon: Send, label: "Soumission" },
  document: { dot: "bg-amber-600 dark:bg-amber-400", icon: FileText, label: "Document" },
  event: { dot: "bg-emerald-600 dark:bg-emerald-400", icon: Calendar, label: "Événement" },
};

export function UserRecentActivity({ activities, loading, onViewAll }: UserRecentActivityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="p-5 rounded-2xl bg-card border border-border shadow-sm h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Activité récente</h2>
        </div>
        {onViewAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="gap-1 text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            Voir tout
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="w-2.5 h-2.5 rounded-full mt-1.5 bg-muted" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-1 bg-muted" />
                <Skeleton className="h-3 w-1/2 bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">Aucune activité récente</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, i) => {
            const config = typeConfig[activity.type];
            return (
              <div key={activity.id} className="flex items-start gap-3 group">
                <div className="relative mt-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
                  {i < activities.length - 1 && (
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-8 bg-border" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors cursor-pointer truncate">
                    {activity.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <config.icon className="h-3 w-3" />
                      {config.label}
                    </span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(activity.date), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
