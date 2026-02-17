import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, DollarSign, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import type { CrossBorderProject } from "./crossBorderData";
import { THEMES } from "./CrossBorderFilters";

const FLAG_MAP: Record<string, string> = {
  "Côte d'Ivoire": "🇨🇮", "Ghana": "🇬🇭", "Sénégal": "🇸🇳", "Mali": "🇲🇱",
  "Burkina Faso": "🇧🇫", "Kenya": "🇰🇪", "Tanzanie": "🇹🇿", "Ouganda": "🇺🇬",
  "Cameroun": "🇨🇲", "Niger": "🇳🇪", "Togo": "🇹🇬", "Bénin": "🇧🇯",
  "Rwanda": "🇷🇼", "RDC": "🇨🇩", "Madagascar": "🇲🇬",
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-[hsl(var(--nx-success-500)/0.2)] text-[hsl(var(--nx-success-500))]",
  completed: "bg-[hsl(var(--nx-cyan)/0.2)] text-[hsl(var(--nx-cyan))]",
  planned: "bg-[hsl(var(--nx-gold)/0.2)] text-[hsl(var(--nx-gold))]",
};

const STATUS_LABELS: Record<string, string> = {
  active: "En cours", completed: "Terminé", planned: "Planifié",
};

function formatBudget(amount: number) {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M $`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K $`;
  return `${amount} $`;
}

export function CrossBorderProjectCard({ project, index }: { project: CrossBorderProject; index: number }) {
  const themeLabel = THEMES.find(t => t.value === project.theme)?.label ?? project.theme;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="group rounded-xl border border-[hsl(var(--nx-border))] bg-[hsl(var(--nx-night)/0.5)] p-5 hover:border-[hsl(var(--nx-gold)/0.5)] transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <Badge className={`text-xs ${STATUS_COLORS[project.status] ?? ""}`}>
          {STATUS_LABELS[project.status] ?? project.status}
        </Badge>
        <Badge variant="outline" className="text-xs border-[hsl(var(--nx-border))] text-[hsl(var(--nx-text-500))]">
          {themeLabel}
        </Badge>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-white mb-2 group-hover:text-[hsl(var(--nx-gold))] transition-colors line-clamp-2">
        {project.title}
      </h3>
      <p className="text-sm text-[hsl(var(--nx-text-500))] mb-4 line-clamp-2">
        {project.description}
      </p>

      {/* Country flags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.partner_countries.map((c) => (
          <span
            key={c}
            className="inline-flex items-center gap-1 text-xs bg-[hsl(var(--nx-night)/0.8)] border border-[hsl(var(--nx-border))] rounded-full px-2 py-0.5 text-[hsl(var(--nx-text-700))]"
          >
            {FLAG_MAP[c] ?? "🏳️"} {c}
          </span>
        ))}
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-[hsl(var(--nx-text-500))] mb-1">
          <span>Progression</span>
          <span className="text-[hsl(var(--nx-gold))]">{project.completion_percentage}%</span>
        </div>
        <Progress value={project.completion_percentage} className="h-1.5 bg-[hsl(var(--nx-night))]" />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 text-xs text-[hsl(var(--nx-text-500))]">
        <div className="flex items-center gap-1">
          <DollarSign className="h-3.5 w-3.5 text-[hsl(var(--nx-gold))]" />
          {formatBudget(project.budget ?? 0)}
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5 text-[hsl(var(--nx-cyan))]" />
          {(project.beneficiaries ?? 0).toLocaleString()}
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5 text-[hsl(var(--nx-text-500))]" />
          {project.start_date?.slice(0, 4) ?? "—"}
        </div>
      </div>
    </motion.div>
  );
}
