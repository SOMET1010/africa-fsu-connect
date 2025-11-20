import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { Play, CheckCircle2, Clock, BarChart, Globe, TrendingUp, Shield, ExternalLink } from "lucide-react";

interface DemoModule {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
  duration: number;
  difficulty: "Facile" | "Moyen" | "Avancé";
  route: string;
  demoSteps: Array<{ element: string; title: string; description: string; }>;
}

export function InteractiveDemoSection() {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const navigate = useNavigate();
  const { enableDemoMode } = useDemoMode();

  const demoModules: DemoModule[] = [
    {
      id: "dashboard",
      title: "Tableau de Bord Intelligent",
      description: "Découvrez comment obtenir une vue d'ensemble complète de vos opérations télécoms en temps réel.",
      icon: BarChart,
      features: ["Métriques temps réel", "Widgets personnalisables", "Alertes intelligentes", "Rapports automatisés"],
      duration: 3,
      difficulty: "Facile",
      route: "/dashboard",
      demoSteps: [
        { element: '#stats-widget', title: 'Métriques', description: 'KPIs en temps réel' },
        { element: '#quick-actions', title: 'Actions rapides', description: 'Accès aux fonctionnalités' }
      ]
    },
    {
      id: "organizations",
      title: "Gestion des Organisations",
      description: "Gérez efficacement toutes les agences de régulation télécoms africaines.",
      icon: Globe,
      features: ["Carte interactive", "Synchronisation auto", "Gestion des agences", "API"],
      duration: 5,
      difficulty: "Moyen",
      route: "/organizations",
      demoSteps: [
        { element: '.leaflet-container', title: 'Carte', description: 'Visualisation géographique' }
      ]
    },
    {
      id: "projects",
      title: "Suivi de Projets",
      description: "Pilotez l'ensemble de vos projets d'infrastructure télécoms.",
      icon: TrendingUp,
      features: ["Planification", "Suivi KPIs", "Collaboration", "Rapports"],
      duration: 4,
      difficulty: "Facile",
      route: "/projects",
      demoSteps: [
        { element: '[data-testid="project-card"]', title: 'Projets', description: 'Gestion de projets' }
      ]
    },
    {
      id: "security",
      title: "Sécurité Enterprise",
      description: "Infrastructure de sécurité de niveau bancaire.",
      icon: Shield,
      features: ["MFA", "Chiffrement", "Audit trail", "Conformité"],
      duration: 6,
      difficulty: "Avancé",
      route: "/security",
      demoSteps: [
        { element: '[data-testid="security-overview"]', title: 'Sécurité', description: 'Vue d\'ensemble' }
      ]
    }
  ];

  const launchDemo = (moduleId: string) => {
    const demo = demoModules.find(d => d.id === moduleId);
    if (!demo) return;
    enableDemoMode(demo.id, demo.demoSteps);
    navigate(demo.route);
  };

  const selectedModule = demoModules.find(m => m.id === selectedDemo);

  return (
    <div className="space-y-8 presentation-section">
      <div className="text-center space-y-4">
        <Badge variant="secondary">Démonstration Interactive</Badge>
        <h2 className="text-4xl font-bold">Explorez les Modules en Action</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Découvrez la plateforme SUTEL à travers des démonstrations guidées et interactives.
        </p>
      </div>

      {!selectedDemo ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demoModules.map((module) => (
            <Card key={module.id} className="p-6 hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedDemo(module.id)}>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <module.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{module.duration} min</span>
                    <Badge>{module.difficulty}</Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <Button variant="outline" onClick={() => setSelectedDemo(null)}>← Retour</Button>
          <Card className="p-8">
            <div className="flex items-start gap-6 mb-6">
              <div className="p-4 rounded-lg bg-primary/10">
                {selectedModule && (() => {
                  const IconComponent = selectedModule.icon;
                  return <IconComponent className="h-12 w-12 text-primary" />;
                })()}
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-2">{selectedModule!.title}</h3>
                <p className="text-muted-foreground mb-4">{selectedModule!.description}</p>
                <div className="space-y-2">
                  {selectedModule!.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /><span>{f}</span></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => launchDemo(selectedModule!.id)} size="lg">
                <Play className="h-4 w-4 mr-2" />Essayer maintenant
              </Button>
              <Button variant="outline" onClick={() => navigate(selectedModule!.route)} size="lg">
                <ExternalLink className="h-4 w-4 mr-2" />Ouvrir
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
