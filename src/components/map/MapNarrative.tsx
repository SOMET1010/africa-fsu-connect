import { Globe, TrendingUp, Users } from "lucide-react";
import { getGlobalStats } from "./activityData";

interface MapNarrativeProps {
  className?: string;
}

export const MapNarrative = ({ className }: MapNarrativeProps) => {
  const stats = getGlobalStats();
  
  return (
    <div className={`text-center py-6 ${className}`}>
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full mb-4">
        <TrendingUp className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-primary">Activité du réseau</span>
      </div>
      
      <p className="text-xl md:text-2xl text-foreground max-w-3xl mx-auto leading-relaxed">
        Ce mois-ci, <span className="font-bold text-primary">{stats.totalContributions} contributions</span> de{" "}
        <span className="font-bold text-primary">{stats.totalCountries} pays</span> enrichissent 
        notre réseau de projets et d'expériences partagées.
      </p>
      
      <div className="flex justify-center gap-6 mt-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-[#10B981]" />
          <span>{stats.activeCountries} très actifs</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
          <span>{stats.emergingCountries} émergents</span>
        </div>
      </div>
    </div>
  );
};
