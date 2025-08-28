import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw,
  Monitor,
  BarChart3,
  Building2,
  Rocket,
  BookOpen,
  Shield,
  Users,
  CheckCircle
} from "lucide-react";

interface DemoModule {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
  duration: number;
  difficulty: "Débutant" | "Intermédiaire" | "Avancé";
  route: string;
}

export function InteractiveDemoSection() {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const demoModules: DemoModule[] = [
    {
      id: "dashboard",
      title: "Tableau de Bord Intelligent",
      description: "Découvrez comment obtenir une vue d'ensemble complète de vos opérations en temps réel",
      icon: BarChart3,
      features: [
        "Métriques temps réel",
        "Alertes intelligentes", 
        "Rapports automatisés",
        "Tableaux de bord personnalisables"
      ],
      duration: 3,
      difficulty: "Débutant",
      route: "/dashboard"
    },
    {
      id: "organizations",
      title: "Gestion des Organisations",
      description: "Gérez efficacement vos agences et partenaires avec des outils de collaboration avancés",
      icon: Building2,
      features: [
        "Cartographie interactive",
        "Synchronisation automatique",
        "Gestion des conflits",
        "API d'intégration"
      ],
      duration: 5,
      difficulty: "Intermédiaire",
      route: "/organizations"
    },
    {
      id: "projects",
      title: "Suivi de Projets",
      description: "Pilotez vos projets télécoms de A à Z avec des outils de gestion avancés",
      icon: Rocket,
      features: [
        "Planification automatique",
        "Suivi des KPIs",
        "Gestion budgétaire",
        "Rapports d'avancement"
      ],
      duration: 4,
      difficulty: "Intermédiaire",
      route: "/projects"
    },
    {
      id: "security",
      title: "Sécurité Enterprise",
      description: "Découvrez notre infrastructure de sécurité de niveau bancaire",
      icon: Shield,
      features: [
        "Authentification multi-facteurs",
        "Chiffrement bout en bout",
        "Audit trails complets",
        "Conformité internationale"
      ],
      duration: 6,
      difficulty: "Avancé",
      route: "/security"
    }
  ];

  const selectedModule = demoModules.find(m => m.id === selectedDemo);
  const demoSteps = selectedModule ? [
    `Introduction à ${selectedModule.title}`,
    "Configuration initiale",
    "Fonctionnalités principales",
    "Cas d'usage pratiques",
    "Intégration avec autres modules",
    "Bonnes pratiques"
  ] : [];

  const startDemo = (moduleId: string) => {
    setSelectedDemo(moduleId);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsPlaying(false);
    }
  };

  // Auto-advance steps
  useEffect(() => {
    if (isPlaying && selectedDemo) {
      const timer = setTimeout(nextStep, 3000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, selectedDemo]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Débutant": return "bg-green-100 text-green-800";
      case "Intermédiaire": return "bg-yellow-100 text-yellow-800";
      case "Avancé": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          Démonstration Interactive
        </motion.h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explorez nos modules clés avec des démonstrations guidées et interactives
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des modules */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xl font-bold mb-4">Modules Disponibles</h3>
          
          {demoModules.map((module, index) => {
            const Icon = module.icon;
            const isSelected = selectedDemo === module.id;
            
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => startDemo(module.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-sm">{module.title}</h4>
                        <Badge className={`text-xs ${getDifficultyColor(module.difficulty)}`}>
                          {module.difficulty}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2">
                        {module.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Monitor className="h-3 w-3" />
                        <span>{module.duration} min</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Zone de démonstration */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedModule ? (
              <motion.div
                key={selectedDemo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* En-tête de la démo */}
                <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <selectedModule.icon className="h-6 w-6 text-purple-600" />
                      <h3 className="text-2xl font-bold">{selectedModule.title}</h3>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetDemo}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Reset
                      </Button>
                      
                      <Button
                        variant={isPlaying ? "secondary" : "default"}
                        size="sm"
                        onClick={togglePlayback}
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="h-4 w-4 mr-1" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Play
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">{selectedModule.description}</p>

                  {/* Barre de progression */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span>{currentStep + 1}/{demoSteps.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                </Card>

                {/* Contenu de la démo */}
                <Card className="p-6">
                  <div className="space-y-6">
                    {/* Étape actuelle */}
                    <div className="text-center space-y-4">
                      <Badge variant="outline" className="mb-2">
                        Étape {currentStep + 1}
                      </Badge>
                      <h4 className="text-xl font-bold">{demoSteps[currentStep]}</h4>
                      
                      {/* Simulation d'interface */}
                      <div className="bg-muted/50 rounded-lg p-8 text-center">
                        <motion.div
                          key={currentStep}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-4"
                        >
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center">
                            <selectedModule.icon className="h-8 w-8 text-white" />
                          </div>
                          <p className="text-lg font-medium">
                            {demoSteps[currentStep]}
                          </p>
                          <p className="text-muted-foreground">
                            Simulation interactive de l'interface utilisateur
                          </p>
                        </motion.div>
                      </div>
                    </div>

                    {/* Fonctionnalités mises en avant */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedModule.features.map((feature, index) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ 
                            opacity: index <= currentStep ? 1 : 0.3, 
                            x: 0 
                          }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 p-3 bg-background rounded-lg border"
                        >
                          <CheckCircle 
                            className={`h-4 w-4 ${
                              index <= currentStep ? 'text-green-600' : 'text-muted-foreground'
                            }`} 
                          />
                          <span className={index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}>
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Actions */}
                <div className="flex justify-center gap-4">
                  <Button variant="outline" asChild>
                    <a href={selectedModule.route}>
                      Tester en Réel
                    </a>
                  </Button>
                  <Button>
                    Demander une Formation
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Sélectionnez un Module</h3>
                <p className="text-muted-foreground">
                  Choisissez un module dans la liste pour commencer la démonstration
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}