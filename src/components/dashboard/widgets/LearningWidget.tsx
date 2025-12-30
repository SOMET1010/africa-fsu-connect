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

interface InspiringProject {
  id: string;
  title: string;
  country: string;
  countryFlag: string;
  impact: string;
  tags: string[];
  description?: string;
}

interface LearningWidgetProps {
  maxItems?: number;
}

// Sample inspiring projects from the network
const inspiringProjects: InspiringProject[] = [
  {
    id: "1",
    title: "Villages Connectés",
    country: "Côte d'Ivoire",
    countryFlag: "🇨🇮",
    impact: "1.2M bénéficiaires",
    tags: ["Connectivité rurale", "Modèle réplicable"],
    description: "Déploiement fibre optique dans 500 villages ruraux"
  },
  {
    id: "2",
    title: "Smart Schools Initiative",
    country: "Sénégal",
    countryFlag: "🇸🇳",
    impact: "850K élèves",
    tags: ["Éducation numérique", "Partenariat public-privé"],
    description: "Équipement numérique de 2000 écoles primaires"
  },
  {
    id: "3",
    title: "Rural Connect Kenya",
    country: "Kenya",
    countryFlag: "🇰🇪",
    impact: "2.1M personnes",
    tags: ["Dernier kilomètre", "Innovation"],
    description: "Réseau mobile communautaire en zones reculées"
  },
  {
    id: "4",
    title: "Digital Health Hubs",
    country: "Rwanda",
    countryFlag: "🇷🇼",
    impact: "450K patients",
    tags: ["Télémédecine", "Santé rurale"],
    description: "Centres de santé connectés en zones rurales"
  },
  {
    id: "5",
    title: "Agri-Connect",
    country: "Ghana",
    countryFlag: "🇬🇭",
    impact: "320K agriculteurs",
    tags: ["Agriculture numérique", "Formation"],
    description: "Plateforme mobile pour agriculteurs ruraux"
  }
];

export const LearningWidget = ({ maxItems = 3 }: LearningWidgetProps) => {
  const displayedProjects = inspiringProjects.slice(0, maxItems);

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
        <ScrollArea className="h-[280px]">
          <div className="space-y-3 pr-2">
            {displayedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group p-3 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/50 hover:border-primary/20 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{project.countryFlag}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                        {project.title}
                      </h4>
                      <Sparkles className="h-3 w-3 text-warning opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" />
                      <span>{project.country}</span>
                      <span className="text-border">•</span>
                      <Users className="h-3 w-3" />
                      <span className="font-medium text-success">{project.impact}</span>
                    </div>

                    {project.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                        {project.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {project.tags.map((tag, i) => (
                        <Badge 
                          key={i} 
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
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-3 pt-3 border-t border-border/50">
          <Button 
            variant="outline" 
            className="w-full text-xs h-8" 
            asChild
          >
            <Link to="/projects?filter=inspiring">
              <Lightbulb className="h-3.5 w-3.5 mr-2" />
              Explorer toutes les bonnes pratiques
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
