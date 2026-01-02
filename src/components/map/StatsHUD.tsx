import { motion } from "framer-motion";
import { Globe, Server, Users, Wifi, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  glowColor: string;
}

const stats: StatItem[] = [
  { label: "Pays Connectés", value: "54", icon: Globe, color: "text-emerald-400", glowColor: "border-emerald-500/50" },
  { label: "Projets Actifs", value: "127", icon: Server, color: "text-blue-400", glowColor: "border-blue-500/50" },
  { label: "Impact", value: "24M", icon: Users, color: "text-purple-400", glowColor: "border-purple-500/50" },
  { label: "Infrastructures", value: "450", icon: Wifi, color: "text-amber-400", glowColor: "border-amber-500/50" },
];

interface StatsHUDProps {
  className?: string;
}

export const StatsHUD = ({ className }: StatsHUDProps) => (
  <div className={cn("flex items-center gap-2", className)}>
    {stats.map((stat, idx) => (
      <motion.div
        key={stat.label}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.1 }}
        className="relative group"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-lg border border-white/10 px-3 py-2 flex items-center gap-2 min-w-[120px]">
          <stat.icon className={cn("h-4 w-4", stat.color)} />
          <div className="flex flex-col">
            <span className="text-[10px] text-white/50 uppercase tracking-wider">{stat.label}</span>
            <span className="text-sm font-bold text-white">{stat.value}</span>
          </div>
        </div>
        {/* Glow effect bottom */}
        <div className={cn("absolute bottom-0 left-2 right-2 h-px", stat.glowColor, "border-b")} />
      </motion.div>
    ))}
  </div>
);
