import { Rocket, MapPin, Calendar, ArrowRight } from "lucide-react";
import { ModernCard } from "@/components/ui/modern-card";
import { Badge } from "@/components/ui/badge";
import { ModernButton } from "@/components/ui/modern-button";

interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
  location?: string;
  agencies?: {
    country: string;
    acronym: string;
    region?: string;
  };
  start_date?: string;
  beneficiaries?: number;
}

interface InspiringProjectsGridProps {
  projects: Project[];
  onViewProject?: (project: Project) => void;
  loading?: boolean;
}

export function InspiringProjectsGrid({ projects, onViewProject, loading }: InspiringProjectsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 rounded-xl bg-muted/50 animate-pulse" />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <Rocket className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          Aucun projet pour le moment
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Les projets partagés par le réseau apparaîtront ici. 
          Soyez le premier à proposer une initiative !
        </p>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'En cours': return 'default';
      case 'Terminé': return 'secondary';
      case 'En attente': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ModernCard
          key={project.id}
          className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
          onClick={() => onViewProject?.(project)}
        >
          {/* Header with country flag/badge */}
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                {project.agencies?.country && (
                  <Badge variant="outline" className="text-xs font-medium">
                    {project.agencies.country}
                  </Badge>
                )}
                {project.agencies?.acronym && (
                  <span className="text-xs text-muted-foreground">
                    {project.agencies.acronym}
                  </span>
                )}
              </div>
              <Badge variant={getStatusVariant(project.status)} className="text-xs">
                {project.status}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {project.title}
            </h3>

            {/* Description */}
            {project.description && (
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {project.description}
              </p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              {project.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{project.location}</span>
                </div>
              )}
              {project.start_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(project.start_date).getFullYear()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="px-6 py-4 border-t border-border/50 bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                En savoir plus
              </span>
              <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </ModernCard>
      ))}
    </div>
  );
}
