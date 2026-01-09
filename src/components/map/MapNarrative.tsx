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
  
  return (
    <div className={`text-center py-4 ${className}`}>
      <p className="text-lg text-foreground max-w-2xl mx-auto leading-relaxed">
        {config.template(stats).split(/(\d+%?)/g).map((part, i) => 
          /^\d+%?$/.test(part) ? (
            <span key={i} className="font-semibold text-primary">{part}</span>
          ) : part
        )}
      </p>
      
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ACTIVITY_LEVELS.high.color }} />
          <span>Très actifs</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ACTIVITY_LEVELS.medium.color }} />
          <span>Actifs</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ACTIVITY_LEVELS.onboarding.color }} />
          <span>En intégration</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ACTIVITY_LEVELS.observer.color }} />
          <span>Observateurs</span>
        </div>
      </div>
    </div>
  );
};
