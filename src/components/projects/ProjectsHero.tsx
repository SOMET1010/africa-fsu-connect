import { Rocket, Globe, Users } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export function ProjectsHero() {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-dark border border-border p-8 md:p-12">
      
      <div className="relative z-10 max-w-3xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-6">
          <Globe className="h-4 w-4" />
          <span>Réseau SUTEL</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Découvrez les initiatives inspirantes
        </h1>

        {/* Description */}
        <p className="text-lg text-white/80 mb-8 max-w-2xl">
          Explorez les projets portés par les Fonds du Service Universel africains. 
          Chaque initiative témoigne de l'engagement collectif pour réduire la fracture numérique.
        </p>

        {/* Stats narratives (pas KPIs) */}
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/70">Initiatives partagées</p>
              <p className="text-lg font-semibold text-white">par le réseau</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/70">Pays contributeurs</p>
              <p className="text-lg font-semibold text-white">actifs ensemble</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
