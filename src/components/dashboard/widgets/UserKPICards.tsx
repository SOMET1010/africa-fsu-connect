import { FolderKanban, FileText, Calendar, Send, Download } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  { key: "projects" as const, icon: FolderKanban, color: "text-primary", bgGlow: "bg-primary/10" },
  { key: "documents" as const, icon: FileText, color: "text-amber-600 dark:text-amber-400", bgGlow: "bg-amber-100 dark:bg-amber-500/10" },
  { key: "events" as const, icon: Calendar, color: "text-emerald-600 dark:text-emerald-400", bgGlow: "bg-emerald-100 dark:bg-emerald-500/10" },
  { key: "submissions" as const, icon: Send, color: "text-purple-600 dark:text-purple-400", bgGlow: "bg-purple-100 dark:bg-purple-500/10" },
];

function exportKPIsToCSV(kpis: UserKPICardsProps["kpis"]) {
  if (!kpis) return;
  const BOM = "\uFEFF";
  const header = "Indicateur,Valeur,Tendance (%)";
  const rows = (["projects", "documents", "events", "submissions"] as const).map((key) => {
    const k = kpis[key];
    return `"${k.label}",${k.value},${k.trend ?? "N/A"}`;
  });
  const csv = BOM + [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `kpis_export_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function UserKPICards({ kpis, loading }: UserKPICardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white dark:bg-card border border-slate-200 dark:border-border">
            <Skeleton className="h-4 w-24 mb-3 bg-muted" />
            <Skeleton className="h-8 w-16 mb-2 bg-muted" />
            <Skeleton className="h-4 w-20 bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (!kpis) return null;

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => exportKPIsToCSV(kpis)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Download className="h-4 w-4 mr-1" />
          Exporter
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiConfig.map(({ key, icon: Icon, color, bgGlow }, index) => {
          const kpi = kpis[key];
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="p-5 rounded-2xl bg-white dark:bg-card border border-slate-200 dark:border-border shadow-sm hover:shadow-md transition-shadow"
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
                        ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {kpi.trend >= 0 ? "+" : ""}
                    {kpi.trend}%
                  </Badge>
                )}
              </div>
              <AnimatedCounter
                value={kpi.value}
                className="text-2xl font-bold text-slate-900 dark:text-foreground"
              />
              <p className="text-sm text-slate-600 dark:text-muted-foreground mt-1">{kpi.label}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
