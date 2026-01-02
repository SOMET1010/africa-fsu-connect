import { Rocket, Globe, Users } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export function ProjectsHero() {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-background border border-border/50 p-8 md:p-12">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-2xl" />
      
      <div className="relative z-10 max-w-3xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
          <Globe className="h-4 w-4" />
          <span>Réseau SUTEL</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Découvrez les initiatives inspirantes
        </h1>

        {/* Description */}
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          Explorez les projets portés par les Fonds du Service Universel africains. 
          Chaque initiative témoigne de l'engagement collectif pour réduire la fracture numérique.
        </p>

        {/* Stats narratives (pas KPIs) */}
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Rocket className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Initiatives partagées</p>
              <p className="text-lg font-semibold text-foreground">par le réseau</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent/10">
              <Users className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pays contributeurs</p>
              <p className="text-lg font-semibold text-foreground">actifs ensemble</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
