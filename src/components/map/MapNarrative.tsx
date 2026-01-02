import { TrendingUp, Users, Briefcase } from "lucide-react";
import { getStatsByMode, MapMode, ACTIVITY_LEVELS } from "./activityData";

interface MapNarrativeProps {
  mode?: MapMode;
  className?: string;
}

const MODE_CONFIG = {
  members: {
    icon: Users,
    label: 'Membres du réseau',
    template: (stats: ReturnType<typeof getStatsByMode>) => 
      `Ce mois-ci, ${stats.primary} contributions de ${stats.secondary} pays enrichissent notre réseau de coopération.`,
  },
  projects: {
    icon: Briefcase,
    label: 'Projets partagés',
    template: (stats: ReturnType<typeof getStatsByMode>) => 
      `${stats.primary} projets partagés entre ${stats.secondary} pays ce trimestre favorisent l'échange d'expériences.`,
  },
  trends: {
    icon: TrendingUp,
    label: 'Tendances réseau',
    template: (stats: ReturnType<typeof getStatsByMode>) => 
      `Le réseau progresse : ${stats.primary}% de dynamique moyenne, +${stats.secondary}% vs le mois dernier.`,
  },
};

export const MapNarrative = ({ mode = 'members', className }: MapNarrativeProps) => {
  const stats = getStatsByMode(mode);
  const config = MODE_CONFIG[mode];
  const Icon = config.icon;
  
  return (
    <div className={`text-center py-6 ${className}`}>
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full mb-4">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-primary">{config.label}</span>
      </div>
      
      <p className="text-xl md:text-2xl text-foreground max-w-3xl mx-auto leading-relaxed">
        {config.template(stats).split(/(\d+%?)/g).map((part, i) => 
          /^\d+%?$/.test(part) ? (
            <span key={i} className="font-bold text-primary">{part}</span>
          ) : part
        )}
      </p>
      
      <div className="flex justify-center gap-6 mt-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ACTIVITY_LEVELS.high.color }} />
          <span>Très actifs</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ACTIVITY_LEVELS.medium.color }} />
          <span>Actifs</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ACTIVITY_LEVELS.emerging.color }} />
          <span>Émergents</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ACTIVITY_LEVELS.joining.color }} />
          <span>En adhésion</span>
        </div>
      </div>
    </div>
  );
};
