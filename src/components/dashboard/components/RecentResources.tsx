import { BookOpen, ArrowRight, FileText } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

interface RecentResource {
  id: string;
  title: string;
  country: string;
  countryFlag: string;
  type: string;
}

interface RecentResourcesProps {
  resources?: RecentResource[];
  onViewResource?: (resourceId: string) => void;
  onViewAll?: () => void;
}

const defaultResources: RecentResource[] = [
  {
    id: "1",
    title: "Guide Villages Connectés",
    country: "Côte d'Ivoire",
    countryFlag: "🇨🇮",
    type: "Guide"
  },
  {
    id: "2",
    title: "Rapport FSU 2024",
    country: "Sénégal",
    countryFlag: "🇸🇳",
    type: "Rapport"
  },
  {
    id: "3",
    title: "Stratégie Inclusion Numérique",
    country: "Mali",
    countryFlag: "🇲🇱",
    type: "Stratégie"
  }
];

export function RecentResources({ 
  resources = defaultResources,
  onViewResource,
  onViewAll
}: RecentResourcesProps) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Ressources récentes
          </h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onViewAll} className="gap-1 text-muted-foreground">
          Voir tout
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      <div className="space-y-3">
        {resources.slice(0, 3).map((resource) => (
          <button
            key={resource.id}
            onClick={() => onViewResource?.(resource.id)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{resource.title}</p>
              <p className="text-sm text-muted-foreground">
                {resource.countryFlag} {resource.country} · {resource.type}
              </p>
            </div>
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
