import { FolderKanban, FileText, Calendar, Send } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardKPI } from "@/hooks/useUserDashboardKPIs";

interface UserKPICardsProps {
  kpis: {
    projects: DashboardKPI;
    documents: DashboardKPI;
    events: DashboardKPI;
    submissions: DashboardKPI;
  } | null;
  loading: boolean;
}

const kpiConfig = [
  { key: "projects" as const, icon: FolderKanban, color: "text-[hsl(var(--nx-electric))]", bgGlow: "bg-[hsl(var(--nx-electric))]/10" },
  { key: "documents" as const, icon: FileText, color: "text-[hsl(var(--nx-gold))]", bgGlow: "bg-[hsl(var(--nx-gold))]/10" },
  { key: "events" as const, icon: Calendar, color: "text-emerald-400", bgGlow: "bg-emerald-500/10" },
  { key: "submissions" as const, icon: Send, color: "text-purple-400", bgGlow: "bg-purple-500/10" },
];

export function UserKPICards({ kpis, loading }: UserKPICardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <Skeleton className="h-4 w-24 mb-3 bg-white/10" />
            <Skeleton className="h-8 w-16 mb-2 bg-white/10" />
            <Skeleton className="h-4 w-20 bg-white/10" />
          </div>
        ))}
      </div>
    );
  }

  if (!kpis) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpiConfig.map(({ key, icon: Icon, color, bgGlow }, index) => {
        const kpi = kpis[key];
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-xl ${bgGlow}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              {kpi.trend !== null && (
                <Badge
                  variant="outline"
                  className={`text-xs border-0 ${
                    kpi.trend >= 0
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {kpi.trend >= 0 ? "+" : ""}
                  {kpi.trend}%
                </Badge>
              )}
            </div>
            <AnimatedCounter
              value={kpi.value}
              className="text-2xl text-white"
            />
            <p className="text-sm text-white/60 mt-1">{kpi.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
