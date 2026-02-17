import { Handshake, Globe, DollarSign, Users } from "lucide-react";
import { motion } from "framer-motion";
import type { CrossBorderProject } from "./crossBorderData";

function formatBudget(amount: number) {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M $`;
  return `${(amount / 1_000).toFixed(0)}K $`;
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent: string;
  index: number;
}

function StatCard({ icon: Icon, label, value, accent, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-xl border border-[hsl(var(--nx-border))] bg-[hsl(var(--nx-night)/0.5)] p-5 flex items-center gap-4"
    >
      <div className={`rounded-lg p-2.5 ${accent}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-[hsl(var(--nx-text-500))]">{label}</p>
      </div>
    </motion.div>
  );
}

export function CrossBorderStats({ projects }: { projects: CrossBorderProject[] }) {
  const uniqueCountries = new Set(projects.flatMap(p => p.partner_countries));
  const totalBudget = projects.reduce((s, p) => s + (p.budget ?? 0), 0);
  const totalBeneficiaries = projects.reduce((s, p) => s + (p.beneficiaries ?? 0), 0);

  const stats: Omit<StatCardProps, "index">[] = [
    { icon: Handshake, label: "Projets conjoints", value: projects.length, accent: "bg-[hsl(var(--nx-gold)/0.25)]" },
    { icon: Globe, label: "Pays impliqués", value: uniqueCountries.size, accent: "bg-[hsl(var(--nx-cyan)/0.25)]" },
    { icon: DollarSign, label: "Budget mobilisé", value: formatBudget(totalBudget), accent: "bg-[hsl(var(--nx-success-500)/0.25)]" },
    { icon: Users, label: "Bénéficiaires", value: totalBeneficiaries.toLocaleString(), accent: "bg-[hsl(var(--nx-network)/0.25)]" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <StatCard key={s.label} {...s} index={i} />
      ))}
    </div>
  );
}
