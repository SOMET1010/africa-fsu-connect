import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Clock, 
  CheckCircle, 
  Download,
  Users,
  Building,
  Shield,
  TrendingUp,
  Map,
  FileText
} from 'lucide-react';

interface DemoStep {
  id: string;
  title: string;
  duration: number; // en minutes
  description: string;
  route: string;
  actions: string[];
  keyPoints: string[];
  assistantMessage: string;
  icon: any;
}

const demoSteps: DemoStep[] = [
  {
    id: 'introduction',
    title: 'Introduction et Dashboard',
    duration: 3,
    route: '/',
    description: 'Présentation de Marie Diallo et découverte du tableau de bord personnalisé',
    actions: [
      'Se connecter en tant que Marie Diallo',
      'Explorer les missions quotidiennes',
      'Montrer les raccourcis workspace',
      'Présenter les recommandations intelligentes'
    ],
    keyPoints: [
      'Interface adaptative basée sur le profil utilisateur',
      'Missions personnalisées selon l\'expérience',
      'Accès rapide aux sections principales'
    ],
    assistantMessage: 'Commencez par présenter Marie comme représentante du Cameroun, soulignez son expertise de niveau intermédiaire.',
    icon: Users
  },
  {
    id: 'organizations',
    title: 'Exploration des Organisations',
    duration: 4,
    route: '/organizations',
    description: 'Découverte de l\'écosystème des agences de régulation africaines',
    actions: [
      'Naviguer vers la carte interactive',
      'Sélectionner la région Afrique Centrale',
      'Explorer les détails de l\'ART Cameroun',
      'Montrer les statuts de synchronisation'
    ],
    keyPoints: [
      '47 agences actives dans 34 pays',
      'Visualisation géographique du réseau',
      'Synchronisation temps réel des données',
      'Profils détaillés des agences partenaires'
    ],
    assistantMessage: 'Insistez sur la dimension panafricaine et la collaboration régionale.',
    icon: Building
  },
  {
    id: 'projects',
    title: 'Projets Collaboratifs',
    duration: 5,
    route: '/projects',
    description: 'Création et gestion d\'un projet de connectivité rurale',
    actions: [
      'Créer un nouveau projet "Connectivité Rurale 2024"',
      'Définir le budget et les bénéficiaires',
      'Assigner l\'ART Cameroun comme agence responsable',
      'Configurer les indicateurs de suivi'
    ],
    keyPoints: [
      'Gestion collaborative multi-agences',
      'Suivi budgétaire en temps réel',
      'Indicateurs d\'impact mesurables',
      'Workflows d\'approbation'
    ],
    assistantMessage: 'Mettez l\'accent sur la collaboration entre agences et le suivi des résultats.',
    icon: TrendingUp
  },
  {
    id: 'security',
    title: 'Sécurité et Conformité',
    duration: 3,
    route: '/security',
    description: 'Démonstration des fonctionnalités de sécurité avancées',
    actions: [
      'Consulter le tableau de bord sécurité',
      'Vérifier les sessions actives',
      'Examiner les logs d\'audit',
      'Configurer l\'authentification biométrique'
    ],
    keyPoints: [
      'Chiffrement de bout en bout',
      'Authentification multi-facteurs',
      'Conformité RGPD et standards africains',
      'Détection d\'anomalies par IA'
    ],
    assistantMessage: 'Rassurez sur la sécurité des données sensibles des télécommunications.',
    icon: Shield
  },
  {
    id: 'intelligence',
    title: 'Intelligence Collaborative',
    duration: 4,
    route: '/analytics',
    description: 'Exploitation des données pour l\'amélioration des services',
    actions: [
      'Analyser les tendances régionales',
      'Comparer les performances entre pays',
      'Générer des recommandations IA',
      'Planifier les actions d\'amélioration'
    ],
    keyPoints: [
      'Analytics temps réel multi-pays',
      'Benchmarking automatisé',
      'Suggestions intelligentes',
      'Rapports personnalisés'
    ],
    assistantMessage: 'Montrez comment l\'IA aide à prendre de meilleures décisions politiques.',
    icon: Map
  },
  {
    id: 'impact',
    title: 'Mesure d\'Impact',
    duration: 3,
    route: '/indicators',
    description: 'Évaluation des résultats et planification stratégique',
    actions: [
      'Consulter les indicateurs de service universel',
      'Analyser l\'évolution de la couverture mobile',
      'Comparer avec les standards internationaux',
      'Exporter le rapport annuel'
    ],
    keyPoints: [
      '15M+ de bénéficiaires touchés',
      'Amélioration de 40% de la couverture',
      'Conformité aux objectifs ODD',
      'Impact économique quantifié'
    ],
    assistantMessage: 'Concluez sur les résultats concrets et l\'impact sur les populations.',
    icon: FileText
  }
];

export function InteractiveDemoGuide() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);

  const totalDuration = demoSteps.reduce((acc, step) => acc + step.duration, 0);
  const progress = ((currentStep + 1) / demoSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      if (!completedSteps.includes(demoSteps[currentStep].id)) {
        setCompletedSteps([...completedSteps, demoSteps[currentStep].id]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };

  const currentStepData = demoSteps[currentStep];
  const IconComponent = currentStepData.icon;

  const exportToPDF = () => {
    // Logique d'export PDF à implémenter
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* En-tête de contrôle */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Guide de Démonstration Interactive</h1>
            <p className="text-muted-foreground">Plateforme SUTEL - Scénario Marie Diallo</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportToPDF} size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {totalDuration} min
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button
            variant={isPlaying ? "destructive" : "default"}
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentStep === demoSteps.length - 1}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
          
          <div className="flex-1">
            <Progress value={progress} className="h-2" />
          </div>
          
          <span className="text-sm text-muted-foreground">
            {currentStep + 1}/{demoSteps.length}
          </span>
        </div>

        {/* Timeline des étapes */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {demoSteps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(index)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm whitespace-nowrap transition-colors ${
                index === currentStep
                  ? 'bg-primary text-primary-foreground'
                  : completedSteps.includes(step.id)
                  ? 'bg-success/10 text-success'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {completedSteps.includes(step.id) ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <step.icon className="w-4 h-4" />
              )}
              {step.title}
            </button>
          ))}
        </div>
      </Card>

      {/* Contenu de l'étape actuelle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Détails de l'étape */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <IconComponent className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{currentStepData.title}</h2>
              <p className="text-sm text-muted-foreground">
                Étape {currentStep + 1} • {currentStepData.duration} minutes • Route: {currentStepData.route}
              </p>
            </div>
          </div>

          <p className="text-foreground mb-6">{currentStepData.description}</p>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-foreground mb-2">Actions à réaliser :</h3>
              <ul className="space-y-2">
                {currentStepData.actions.map((action, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium mt-0.5">
                      {index + 1}
                    </span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium text-foreground mb-2">Points clés à souligner :</h3>
              <ul className="space-y-1">
                {currentStepData.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Assistant et navigation */}
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Message de l'assistant
            </h3>
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              {currentStepData.assistantMessage}
            </p>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium text-foreground mb-3">Contexte Marie Diallo</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pays :</span>
                <span className="font-medium">Cameroun</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Organisation :</span>
                <span className="font-medium">ART Cameroun</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rôle :</span>
                <span className="font-medium">Analyste Senior</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expérience :</span>
                <span className="font-medium">Intermédiaire</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium text-foreground mb-3">Progression</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Étapes complétées :</span>
                <span className="font-medium">{completedSteps.length}/{demoSteps.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Temps estimé restant :</span>
                <span className="font-medium">
                  {demoSteps.slice(currentStep).reduce((acc, step) => acc + step.duration, 0)} min
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}