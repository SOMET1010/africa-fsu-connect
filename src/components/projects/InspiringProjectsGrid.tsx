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
  variant?: 'light' | 'dark';
}

export function InspiringProjectsGrid({ 
  projects, 
  onViewProject, 
  loading,
  variant = 'light'
}: InspiringProjectsGridProps) {
  const isDark = variant === 'dark';
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={`h-64 rounded-xl animate-pulse ${isDark ? 'bg-white/10' : 'bg-muted/50'}`} />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-[hsl(var(--nx-night)/0.4)]' : 'bg-muted/50'}`}>
          <Rocket className={`h-8 w-8 ${isDark ? 'text-muted-foreground' : 'text-muted-foreground'}`} />
        </div>
        <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-foreground'}`}>
          Aucun projet pour le moment
        </h3>
        <p className={`max-w-md mx-auto ${isDark ? 'text-white/60' : 'text-muted-foreground'}`}>
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
                <div
                  key={project.id}
                  className={`
                    group cursor-pointer overflow-hidden rounded-xl border transition-all duration-300
                    ${isDark 
                      ? 'bg-[hsl(var(--nx-night)/0.6)] border-white/10 hover:bg-[hsl(var(--nx-night)/0.8)] hover:border-[hsl(var(--nx-gold)/0.4)]' 
                      : 'bg-card border-border hover:shadow-lg'
                    }
                  `}
                  onClick={() => onViewProject?.(project)}
                >
          {/* Header with country flag/badge */}
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                {project.agencies?.country && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs font-medium ${isDark ? 'border-white/20 text-white' : ''}`}
                  >
                    {project.agencies.country}
                  </Badge>
                )}
                {project.agencies?.acronym && (
                  <span className={`text-xs ${isDark ? 'text-white/50' : 'text-muted-foreground'}`}>
                    {project.agencies.acronym}
                  </span>
                )}
              </div>
              <Badge 
                variant={getStatusVariant(project.status)} 
                className={`text-xs ${isDark && project.status === 'En cours' ? 'bg-[hsl(var(--nx-gold)/0.2)] text-[hsl(var(--nx-gold))] border-[hsl(var(--nx-gold)/0.4)]' : ''}`}
              >
                {project.status}
              </Badge>
            </div>

            {/* Title */}
            <h3 className={`text-lg font-semibold mb-2 line-clamp-2 transition-colors ${
              isDark 
                ? 'text-white group-hover:text-[hsl(var(--nx-gold))]' 
                : 'text-foreground group-hover:text-primary'
            }`}>
              {project.title}
            </h3>

            {/* Description */}
                {project.description && (
                  <p className={`text-sm line-clamp-3 mb-4 ${isDark ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
                    {project.description}
                  </p>
                )}

                {/* Meta info */}
                <div className={`flex flex-wrap gap-3 text-xs ${isDark ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
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
                  <div className={`px-6 py-4 border-t ${isDark ? 'border-white/10 bg-[hsl(var(--nx-night)/0.4)]' : 'border-border/50 bg-muted/30'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDark ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
                        En savoir plus
                      </span>
                      <ArrowRight className={`h-4 w-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all ${isDark ? 'text-[hsl(var(--nx-gold))]' : 'text-primary'}`} />
                    </div>
                  </div>
        </div>
      ))}
    </div>
  );
}
