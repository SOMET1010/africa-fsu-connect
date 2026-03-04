import { Rocket, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

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
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="space-y-4"
        >
            <div className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <h2 className="text-lg font-semibold text-foreground">
                    Projets inspirants du réseau
                </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projects.slice(0, 3).map((project) => (
                    <div
                        key={project.id}
                        className="group relative p-5 rounded-2xl bg-card border border-border shadow-sm hover:border-primary/30 transition-all duration-300"
                    >
                        <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative space-y-3">
                            <div className="flex items-start justify-between">
                                <span className="text-2xl">{project.themeIcon}</span>
                                <Badge className="text-xs bg-muted text-muted-foreground border-border">
                                    {project.countryFlag} {project.country}
                                </Badge>
                            </div>

                            <div>
                                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {project.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex-1 gap-1 text-muted-foreground hover:text-foreground hover:bg-muted"
                                    onClick={() => onViewProject?.(project.id)}
                                >
                                    S'inspirer
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                                    onClick={() => onContactCountry?.(project.country)}
                                >
                                    <MessageCircle className="h-3.5 w-3.5" />
                                    Contacter
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
