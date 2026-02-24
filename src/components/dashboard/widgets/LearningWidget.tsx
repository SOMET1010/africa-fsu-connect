import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Lightbulb, 
  ExternalLink, 
  Users, 
  MapPin,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useProjects } from "@/hooks/useProjects";

interface LearningWidgetProps {
  maxItems?: number;
}

const countryToFlag = (country?: string) => {
  if (!country) return "🌍";
  const normalized = country
    .replace(/[^\p{Letter}\p{Separator}]/gu, "")
    .split(" ")
    .slice(0, 2)
    .map(token => token[0]?.toUpperCase() || "");
  if (normalized.length < 2) normalized.push("A");
  const code = normalized.join("").slice(0, 2).padEnd(2, "A");
  return String.fromCodePoint(
    0x1f1e6 + code.charCodeAt(0) - 65,
    0x1f1e6 + code.charCodeAt(1) - 65
  );
};

const buildImpactLabel = (project: ReturnType<typeof useProjects>['projects'][number]) => {
  if (!project) return "Réseau UDC";
  if (project.beneficiaries) {
    return `${project.beneficiaries.toLocaleString()} bénéficiaires`;
  }
  if (project.budget) {
    return `${(project.budget / 1_000_000).toFixed(1)}M $ investi`;
  }
  return "Impact en cours de mesure";
};

export const LearningWidget = ({ maxItems = 3 }: LearningWidgetProps) => {
  const { projects, loading } = useProjects();
  const displayedProjects = useMemo(() => projects.slice(0, maxItems), [projects, maxItems]);

  return (
    <Card className="premium-card h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-warning/10">
              <Lightbulb className="h-5 w-5 text-warning" />
            </div>
            Ce qui marche ailleurs
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs" asChild>
            <Link to="/projects">
              Voir tous
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Projets inspirants partagés par le réseau
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        {loading && (
          <div className="flex items-center justify-center h-[280px]">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        )}
        {!loading && displayedProjects.length === 0 && (
          <div className="flex items-center justify-center h-[280px] text-sm text-muted-foreground">
            Pas encore assez de projets partagés. Créez-en un dans l'onglet Collaboration.
          </div>
        )}
        {!loading && displayedProjects.length > 0 && (
          <ScrollArea className="h-[280px]">
            <div className="space-y-3 pr-2">
              {displayedProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="group p-3 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/50 hover:border-primary/20 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{countryToFlag(project.agencies?.country)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                          {project.title}
                        </h4>
                        <Sparkles className="h-3 w-3 text-warning opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3" />
                        <span>{project.agencies?.country || 'Réseau UDC'}</span>
                        <span className="text-border">•</span>
                        <Users className="h-3 w-3" />
                        <span className="font-medium text-success">{buildImpactLabel(project)}</span>
                      </div>

                      {project.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                          {project.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1">
                        <Badge 
                          variant="outline" 
                          className="text-[10px] px-1.5 py-0 bg-background/50"
                        >
                          {project.status}
                        </Badge>
                        {project.tags?.slice(0, 2).map((tag, i) => (
                          <Badge 
                            key={`${project.id}-${tag}-${i}`} 
                            variant="outline" 
                            className="text-[10px] px-1.5 py-0 bg-background/50"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      asChild
                    >
                      <Link to={`/projects/${project.id}`}>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        )}

        <div className="mt-3 pt-3 border-t border-border/50">
          <Button 
            variant="outline" 
            className="w-full text-xs h-8" 
            asChild
          >
            <Link to="/practices">
              <Lightbulb className="h-3.5 w-3.5 mr-2" />
              Explorer toutes les bonnes pratiques
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
