import { Rocket, ArrowRight, MessageCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface InspiringProject {
  id: string;
  title: string;
  country: string;
  countryFlag: string;
  theme: string;
  themeIcon: string;
  description: string;
}

interface InspiringProjectsProps {
  projects?: InspiringProject[];
  onViewProject?: (projectId: string) => void;
  onContactCountry?: (country: string) => void;
}

const defaultProjects: InspiringProject[] = [
  {
    id: "1",
    title: "Villages Connectés",
    country: "Côte d'Ivoire",
    countryFlag: "🇨🇮",
    theme: "Connectivité rurale",
    themeIcon: "📡",
    description: "Programme d'extension de la couverture réseau dans les zones rurales"
  },
  {
    id: "2",
    title: "Smart Schools",
    country: "Sénégal",
    countryFlag: "🇸🇳",
    theme: "Éducation numérique",
    themeIcon: "🏫",
    description: "Équipement numérique et connectivité des établissements scolaires"
  },
  {
    id: "3",
    title: "Santé Connectée",
    country: "Mali",
    countryFlag: "🇲🇱",
    theme: "Santé",
    themeIcon: "🏥",
    description: "Télémédecine et connectivité des centres de santé ruraux"
  }
];

export function InspiringProjects({ 
  projects = defaultProjects,
  onViewProject,
  onContactCountry
}: InspiringProjectsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Rocket className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Projets inspirants du réseau
        </h2>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.slice(0, 3).map((project) => (
          <GlassCard key={project.id} className="p-5 hover:shadow-lg transition-shadow">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-2xl">{project.themeIcon}</span>
                <Badge variant="outline" className="text-xs">
                  {project.countryFlag} {project.country}
                </Badge>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground">{project.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {project.description}
                </p>
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1 gap-1"
                  onClick={() => onViewProject?.(project.id)}
                >
                  S'inspirer
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="gap-1"
                  onClick={() => onContactCountry?.(project.country)}
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Contacter
                </Button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
