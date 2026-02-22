import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Milestone {
  date: string;
  event: string;
  icon: LucideIcon;
  description?: string;
  status?: "completed" | "in-progress" | "upcoming";
}

interface RoadmapTimelineProps {
  milestones: Milestone[];
}

const RoadmapTimeline = ({ milestones }: RoadmapTimelineProps) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <GlassCard className="p-6 md:p-8 animate-fade-in">
      <h3 className="text-xl font-bold text-white mb-1">Jalons Clés 2025</h3>
      <p className="text-sm text-white/80 mb-10">Les étapes majeures de notre développement</p>

      {/* Desktop: horizontal timeline */}
      <div className="hidden md:block relative">
        {/* Connecting line */}
        <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[hsl(var(--nx-gold)/0.1)] via-[hsl(var(--nx-gold)/0.4)] to-[hsl(var(--nx-gold)/0.1)]" />
        {/* Animated progress overlay */}
        <div className="absolute top-5 left-[10%] h-0.5 bg-[hsl(var(--nx-gold))] transition-all duration-700 ease-out" style={{ width: `${((Math.min(activeIdx ?? 0, milestones.length - 1)) / (milestones.length - 1)) * 80}%` }} />

        <div className="flex justify-between relative">
          {milestones.map((milestone, idx) => {
            const isActive = activeIdx === idx;
            const isPast = idx <= (activeIdx ?? -1);
            const MilestoneIcon = milestone.icon;

            return (
              <div
                key={idx}
                className="group flex flex-col items-center flex-1 px-2 cursor-pointer"
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
                onClick={() => setActiveIdx(isActive ? null : idx)}
              >
                {/* Dot on the line */}
                <div className={cn(
                  "w-[14px] h-[14px] rounded-full z-10 mb-5 transition-all duration-300 ring-4",
                  isPast || isActive
                    ? "bg-[hsl(var(--nx-gold))] ring-[hsl(var(--nx-gold)/0.2)] scale-125"
                    : "bg-white/20 ring-transparent group-hover:bg-[hsl(var(--nx-gold)/0.6)] group-hover:ring-[hsl(var(--nx-gold)/0.1)]"
                )} />

                {/* Card */}
                <div className={cn(
                  "rounded-xl p-5 text-center w-full transition-all duration-300 border",
                  isActive
                    ? "bg-white/10 border-[hsl(var(--nx-gold)/0.3)] shadow-md -translate-y-1"
                    : "bg-white/5 border-transparent shadow-sm hover:bg-white/[0.07] hover:-translate-y-0.5"
                )}>
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300",
                    isActive
                      ? "bg-[hsl(var(--nx-gold)/0.25)] scale-110"
                      : "bg-[hsl(var(--nx-gold)/0.15)] group-hover:scale-105"
                  )}>
                    <MilestoneIcon className={cn(
                      "h-5 w-5 transition-colors duration-300",
                      isActive ? "text-[hsl(var(--nx-gold))]" : "text-[hsl(var(--nx-gold)/0.8)]"
                    )} />
                  </div>
                  <p className={cn(
                    "text-xs mb-1 transition-colors duration-300",
                    isActive ? "text-[hsl(var(--nx-gold))]" : "text-white/60"
                  )}>{milestone.date}</p>
                  <p className={cn(
                    "text-sm font-semibold transition-colors duration-300",
                    isActive ? "text-white" : "text-white/85"
                  )}>{milestone.event}</p>

                  {/* Expanded description on active */}
                  {isActive && milestone.description && (
                    <p className="text-xs text-white/70 mt-2 animate-fade-in">
                      {milestone.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: vertical timeline */}
      <div className="md:hidden relative pl-10">
        {/* Vertical line */}
        <div className="absolute top-0 bottom-0 left-[9px] w-0.5 bg-gradient-to-b from-[hsl(var(--nx-gold)/0.4)] via-[hsl(var(--nx-gold)/0.2)] to-transparent" />

        <div className="space-y-5">
          {milestones.map((milestone, idx) => {
            const isActive = activeIdx === idx;
            const MilestoneIcon = milestone.icon;

            return (
              <div
                key={idx}
                className="group relative flex items-start gap-4 cursor-pointer"
                onClick={() => setActiveIdx(isActive ? null : idx)}
              >
                {/* Dot */}
                <div className={cn(
                  "absolute -left-10 top-5 w-[18px] h-[18px] rounded-full z-10 transition-all duration-300 ring-4",
                  isActive
                    ? "bg-[hsl(var(--nx-gold))] ring-[hsl(var(--nx-gold)/0.2)] scale-110"
                    : "bg-white/20 ring-transparent"
                )} />

                {/* Card */}
                <div className={cn(
                  "rounded-xl p-4 w-full transition-all duration-300 border",
                  isActive
                    ? "bg-white/10 border-[hsl(var(--nx-gold)/0.3)] shadow-xl shadow-[hsl(var(--nx-gold)/0.1)]"
                    : "bg-white/5 border-transparent shadow-lg shadow-black/10 active:bg-white/[0.07]"
                )}>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                      isActive ? "bg-[hsl(var(--nx-gold)/0.25)]" : "bg-[hsl(var(--nx-gold)/0.15)]"
                    )}>
                      <MilestoneIcon className="h-5 w-5 text-[hsl(var(--nx-gold))]" />
                    </div>
                    <div>
                      <p className={cn(
                        "text-xs transition-colors duration-300",
                        isActive ? "text-[hsl(var(--nx-gold))]" : "text-white/60"
                      )}>{milestone.date}</p>
                      <p className="text-sm font-semibold text-white">{milestone.event}</p>
                    </div>
                  </div>

                  {isActive && milestone.description && (
                    <p className="text-xs text-white/70 mt-3 pl-[52px] animate-fade-in">
                      {milestone.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
};

export default RoadmapTimeline;
