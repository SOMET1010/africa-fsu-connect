
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Target, 
  Lightbulb, 
  ArrowRight, 
  CheckCircle,
  Sparkles,
  MessageSquare,
  Calendar,
  FileText
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  component: React.ComponentType<{ onNext: (data?: any) => void }>;
}

interface UserPreferences {
  experience: 'beginner' | 'intermediate' | 'expert';
  primaryGoals: string[];
  workStyle: 'individual' | 'collaborative' | 'management';
  interests: string[];
  challenges: string;
}

const WelcomeStep = ({ onNext }: { onNext: (data?: any) => void }) => {
  const { profile } = useAuth();
  
  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Bienvenue {profile?.first_name || 'sur FSU Afrique'} ! 🎉
        </h2>
        <p className="text-muted-foreground text-lg">
          Configurons votre espace de travail pour une expérience optimale
        </p>
      </div>
      
      <div className="bg-gradient-to-r from-primary/10 to-blue-50 rounded-lg p-6">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <Target className="h-8 w-8 text-primary" />
          <Lightbulb className="h-8 w-8 text-yellow-500" />
          <Sparkles className="h-8 w-8 text-purple-500" />
        </div>
        <p className="text-sm text-muted-foreground">
          Cette configuration ne prendra que 2 minutes et personnalisera complètement votre expérience
        </p>
      </div>
      
      <Button onClick={() => onNext()} className="w-full" size="lg">
        Commencer la configuration
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

const ExperienceStep = ({ onNext }: { onNext: (data?: any) => void }) => {
  const [experience, setExperience] = useState<string>('');
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Quel est votre niveau d'expérience ?</h3>
        <p className="text-muted-foreground">
          Cela nous aide à adapter l'interface à vos besoins
        </p>
      </div>
      
      <RadioGroup value={experience} onValueChange={setExperience}>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
            <RadioGroupItem value="beginner" id="beginner" />
            <Label htmlFor="beginner" className="flex-1 cursor-pointer">
              <div className="font-medium">Débutant</div>
              <div className="text-sm text-muted-foreground">
                Nouveau sur ce type de plateforme, j'ai besoin de guidance
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
            <RadioGroupItem value="intermediate" id="intermediate" />
            <Label htmlFor="intermediate" className="flex-1 cursor-pointer">
              <div className="font-medium">Intermédiaire</div>
              <div className="text-sm text-muted-foreground">
                J'ai de l'expérience mais j'apprécie les suggestions
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
            <RadioGroupItem value="expert" id="expert" />
            <Label htmlFor="expert" className="flex-1 cursor-pointer">
              <div className="font-medium">Expert</div>
              <div className="text-sm text-muted-foreground">
                Je préfère une interface complète et des raccourcis avancés
              </div>
            </Label>
          </div>
        </div>
      </RadioGroup>
      
      <Button 
        onClick={() => onNext({ experience })} 
        disabled={!experience}
        className="w-full"
      >
        Continuer
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

const GoalsStep = ({ onNext }: { onNext: (data?: any) => void }) => {
  const [goals, setGoals] = useState<string[]>([]);
  
  const availableGoals = [
    { id: 'projects', label: 'Gérer des projets', icon: FileText },
    { id: 'collaboration', label: 'Collaborer avec l\'équipe', icon: MessageSquare },
    { id: 'events', label: 'Organiser des événements', icon: Calendar },
    { id: 'resources', label: 'Partager des ressources', icon: FileText },
    { id: 'networking', label: 'Développer mon réseau', icon: User },
    { id: 'learning', label: 'Apprendre et me former', icon: Lightbulb }
  ];
  
  const toggleGoal = (goalId: string) => {
    setGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(g => g !== goalId)
        : [...prev, goalId]
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Quels sont vos objectifs principaux ?</h3>
        <p className="text-muted-foreground">
          Sélectionnez tout ce qui vous intéresse (minimum 2)
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {availableGoals.map((goal) => {
          const Icon = goal.icon;
          const isSelected = goals.includes(goal.id);
          
          return (
            <div
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'border-primary bg-primary/5 shadow-sm' 
                  : 'border-border hover:border-primary/30 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {goal.label}
                </span>
                {isSelected && <CheckCircle className="h-4 w-4 text-primary ml-auto" />}
              </div>
            </div>
          );
        })}
      </div>
      
      <Button 
        onClick={() => onNext({ primaryGoals: goals })} 
        disabled={goals.length < 2}
        className="w-full"
      >
        Continuer ({goals.length} sélectionnés)
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

const WorkStyleStep = ({ onNext }: { onNext: (data?: any) => void }) => {
  const [workStyle, setWorkStyle] = useState<string>('');
  const [challenges, setChallenges] = useState('');
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Comment préférez-vous travailler ?</h3>
        <p className="text-muted-foreground">
          Cela nous aide à organiser votre espace de travail
        </p>
      </div>
      
      <RadioGroup value={workStyle} onValueChange={setWorkStyle}>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
            <RadioGroupItem value="individual" id="individual" />
            <Label htmlFor="individual" className="flex-1 cursor-pointer">
              <div className="font-medium">Travail individuel</div>
              <div className="text-sm text-muted-foreground">
                Je préfère me concentrer sur mes tâches personnelles
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
            <RadioGroupItem value="collaborative" id="collaborative" />
            <Label htmlFor="collaborative" className="flex-1 cursor-pointer">
              <div className="font-medium">Collaboration active</div>
              <div className="text-sm text-muted-foreground">
                J'aime travailler en équipe et échanger régulièrement
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
            <RadioGroupItem value="management" id="management" />
            <Label htmlFor="management" className="flex-1 cursor-pointer">
              <div className="font-medium">Coordination d'équipe</div>
              <div className="text-sm text-muted-foreground">
                Je coordonne des équipes et supervise des projets
              </div>
            </Label>
          </div>
        </div>
      </RadioGroup>
      
      <div className="space-y-2">
        <Label htmlFor="challenges">
          Quels sont vos principaux défis actuels ? (optionnel)
        </Label>
        <Textarea
          id="challenges"
          placeholder="Ex: Coordination équipe, suivi projets, partage d'informations..."
          value={challenges}
          onChange={(e) => setChallenges(e.target.value)}
          className="min-h-[80px]"
        />
      </div>
      
      <Button 
        onClick={() => onNext({ workStyle, challenges })} 
        disabled={!workStyle}
        className="w-full"
      >
        Finaliser ma configuration
        <CheckCircle className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export function SmartOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({});
  const [isCompleting, setIsCompleting] = useState(false);
  const navigate = useNavigate();
  
  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Bienvenue',
      description: 'Préparons votre espace',
      icon: Sparkles,
      component: WelcomeStep
    },
    {
      id: 'experience',
      title: 'Expérience',
      description: 'Votre niveau d\'expertise',
      icon: User,
      component: ExperienceStep
    },
    {
      id: 'goals',
      title: 'Objectifs',
      description: 'Vos priorités',
      icon: Target,
      component: GoalsStep
    },
    {
      id: 'workstyle',
      title: 'Style de travail',
      description: 'Vos préférences',
      icon: Lightbulb,
      component: WorkStyleStep
    }
  ];
  
  const handleNext = async (stepData?: any) => {
    if (stepData) {
      setPreferences(prev => ({ ...prev, ...stepData }));
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      await completeOnboarding();
    }
  };
  
  const completeOnboarding = async () => {
    setIsCompleting(true);
    
    try {
      // Sauvegarder les préférences utilisateur
      localStorage.setItem('userOnboardingPreferences', JSON.stringify({
        ...preferences,
        completedAt: new Date().toISOString()
      }));
      
      // Marquer l'onboarding comme terminé
      localStorage.setItem('onboardingCompleted', 'true');
      
      // Rediriger vers le dashboard personnalisé
      window.location.reload(); // Forcer le rechargement pour appliquer les changements
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsCompleting(false);
    }
  };
  
  const progress = ((currentStep + 1) / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep].component;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold">FSU</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Étape {currentStep + 1} sur {steps.length}</span>
              <span>{Math.round(progress)}% terminé</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="flex justify-center space-x-2 mt-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div
                  key={step.id}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : isCompleted 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium hidden sm:inline">
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </CardHeader>
        
        <CardContent className="px-6 pb-6">
          {isCompleting ? (
            <div className="text-center space-y-4">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              <p className="text-muted-foreground">
                Configuration de votre espace personnalisé...
              </p>
            </div>
          ) : (
            <CurrentStepComponent onNext={handleNext} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
