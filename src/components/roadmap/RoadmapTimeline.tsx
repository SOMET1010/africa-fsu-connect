import { GlassCard } from "@/components/ui/glass-card";
import { LucideIcon } from "lucide-react";

interface Milestone {
  date: string;
  event: string;
  icon: LucideIcon;
}

interface RoadmapTimelineProps {
  milestones: Milestone[];
}

const RoadmapTimeline = ({ milestones }: RoadmapTimelineProps) => {
  return (
    <GlassCard className="p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-white mb-2">Jalons Clés 2025</h3>
      <p className="text-sm text-white/80 mb-8">Les étapes majeures de notre développement</p>

      {/* Desktop: horizontal timeline */}
      <div className="hidden md:block relative">
        {/* Connecting line */}
        <div className="absolute top-[7px] left-[10%] right-[10%] border-t-2 border-dashed border-[hsl(var(--nx-gold)/0.3)]" />

        <div className="flex justify-between relative">
          {milestones.map((milestone, idx) => (
            <div key={idx} className="group flex flex-col items-center flex-1 px-2">
              {/* Dot on the line */}
              <div className="w-4 h-4 rounded-full bg-[hsl(var(--nx-gold))] border-2 border-[hsl(var(--nx-night))] z-10 mb-4 group-hover:scale-125 transition-transform duration-300" />

              {/* Card */}
              <div className="bg-white/5 rounded-xl p-4 text-center shadow-lg shadow-black/10 hover:bg-white/10 hover:scale-105 hover:shadow-xl transition-all duration-300 w-full">
                <div className="w-10 h-10 rounded-full bg-[hsl(var(--nx-gold)/0.2)] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <milestone.icon className="h-5 w-5 text-[hsl(var(--nx-gold))]" />
                </div>
                <p className="text-xs text-white/70 mb-1">{milestone.date}</p>
                <p className="text-sm font-medium text-white">{milestone.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: vertical timeline */}
      <div className="md:hidden relative pl-8">
        {/* Vertical line */}
        <div className="absolute top-0 bottom-0 left-[7px] border-l-2 border-dashed border-[hsl(var(--nx-gold)/0.3)]" />

        <div className="space-y-4">
          {milestones.map((milestone, idx) => (
            <div key={idx} className="group relative flex items-start gap-4">
              {/* Dot */}
              <div className="absolute -left-8 top-4 w-4 h-4 rounded-full bg-[hsl(var(--nx-gold))] border-2 border-[hsl(var(--nx-night))] z-10" />

              {/* Card */}
              <div className="bg-white/5 rounded-xl p-4 shadow-lg shadow-black/10 hover:bg-white/10 transition-all duration-300 flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-full bg-[hsl(var(--nx-gold)/0.2)] flex items-center justify-center shrink-0">
                  <milestone.icon className="h-5 w-5 text-[hsl(var(--nx-gold))]" />
                </div>
                <div>
                  <p className="text-xs text-white/70">{milestone.date}</p>
                  <p className="text-sm font-medium text-white">{milestone.event}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

export default RoadmapTimeline;
