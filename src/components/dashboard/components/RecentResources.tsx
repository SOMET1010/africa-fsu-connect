import { BookOpen, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="p-5 rounded-2xl bg-card border border-border shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <h2 className="text-lg font-semibold text-foreground">
            Ressources récentes
          </h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onViewAll} 
          className="gap-1 text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          Voir tout
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      <div className="space-y-3">
        {resources.slice(0, 3).map((resource) => (
          <button
            key={resource.id}
            onClick={() => onViewResource?.(resource.id)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 group-hover:border-amber-400 dark:group-hover:border-amber-500/40 transition-colors">
              <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">{resource.title}</p>
              <p className="text-sm text-muted-foreground">
                {resource.countryFlag} {resource.country} · {resource.type}
              </p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
