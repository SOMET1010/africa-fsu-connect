import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GlassCard } from "@/components/ui/glass-card";
import { CheckCircle, Clock, Target, Star } from "lucide-react";

interface PhaseItem {
  text: string;
  done: boolean;
}

interface Phase {
  quarter: string;
  title: string;
  status: string;
  progress: number;
  items: PhaseItem[];
  highlight: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'in-progress': return 'bg-[hsl(var(--nx-cyan)/0.1)] text-[hsl(var(--nx-cyan))] border-[hsl(var(--nx-cyan)/0.2)]';
    case 'upcoming': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    case 'planned': return 'bg-white/5 text-white/60 border-white/10';
    default: return 'bg-white/5';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed': return 'Terminé';
    case 'in-progress': return 'En cours';
    case 'upcoming': return 'À venir';
    case 'planned': return 'Planifié';
    default: return status;
  }
};

const RoadmapPhaseCard = ({ phase }: { phase: Phase }) => {
  return (
    <GlassCard
      className={`p-6 transition-all duration-300 ${
        phase.status === 'in-progress' ? 'ring-2 ring-[hsl(var(--nx-cyan)/0.3)]' : ''
      }`}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Phase Info */}
        <div className="lg:w-1/3 space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              phase.status === 'completed' ? 'bg-green-500/10' :
              phase.status === 'in-progress' ? 'bg-[hsl(var(--nx-cyan)/0.1)]' :
              'bg-white/5'
            }`}>
              {phase.status === 'completed' ? (
                <CheckCircle className="h-6 w-6 text-green-400" />
              ) : phase.status === 'in-progress' ? (
                <Clock className="h-6 w-6 text-[hsl(var(--nx-cyan))] animate-pulse" />
              ) : (
                <Target className="h-6 w-6 text-white/40" />
              )}
            </div>
            <div>
              <Badge className={getStatusColor(phase.status)}>
                {getStatusLabel(phase.status)}
              </Badge>
              <h3 className="text-lg font-bold mt-1 text-white">{phase.quarter}</h3>
            </div>
          </div>
          <h4 className="text-xl font-semibold text-white">{phase.title}</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/80">Progression</span>
              <span className="font-medium text-white">{phase.progress}%</span>
            </div>
            <Progress value={phase.progress} className="h-2" />
          </div>
          <Badge variant="outline" className="text-xs border-white/20 text-white/85">
            <Star className="h-3 w-3 mr-1" />
            {phase.highlight}
          </Badge>
        </div>

        {/* Right: Items */}
        <div className="lg:w-2/3">
          <div className="grid md:grid-cols-2 gap-3">
            {phase.items.map((item, itemIdx) => (
              <div
                key={itemIdx}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  item.done ? 'bg-green-500/5' : 'bg-white/5'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  item.done ? 'bg-green-500 text-white' : 'bg-white/20'
                }`}>
                  {item.done && <CheckCircle className="h-3 w-3" />}
                </div>
                <span className={`text-sm ${item.done ? 'text-white' : 'text-white/70'}`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default RoadmapPhaseCard;
