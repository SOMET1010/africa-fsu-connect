import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Target, 
  ArrowRight, 
  CheckCircle,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UserPreferences {
  experience: 'beginner' | 'intermediate' | 'expert';
  primaryGoals: string[];
}

export function SimpleOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({});
  const [isCompleting, setIsCompleting] = useState(false);
  const { profile } = useAuth();

  const steps = [
    {
      id: 'experience',
      title: 'Votre niveau',
      description: 'Comment adapter l\'interface ?',
      icon: User
    },
    {
      id: 'goals',
      title: 'Vos objectifs',
      description: 'Que souhaitez-vous faire ?',
      icon: Target
    },
    {
      id: 'complete',
      title: 'Terminé',
      description: 'Configuration complète',
      icon: CheckCircle
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
      localStorage.setItem('userOnboardingPreferences', JSON.stringify({
        ...preferences,
        completedAt: new Date().toISOString()
      }));
      
      localStorage.setItem('onboardingCompleted', 'true');
      window.location.reload();
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ExperienceStep onNext={handleNext} />;
      case 1:
        return <GoalsStep onNext={handleNext} />;
      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  if (isCompleting) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Configuration en cours...</h3>
            <p className="text-muted-foreground">Personnalisation de votre espace</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          
          <CardTitle className="text-2xl">
            Bienvenue {profile?.first_name || ''} ! 👋
          </CardTitle>
          
          <div className="space-y-4 mt-6">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Étape {currentStep + 1} sur {steps.length}
            </p>
          </div>
        </CardHeader>
        
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  );
}

const ExperienceStep = ({ onNext }: { onNext: (data?: any) => void }) => {
  const [experience, setExperience] = useState<string>('');
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Quel est votre niveau ?</h3>
        <p className="text-muted-foreground">Pour adapter l'interface</p>
      </div>
      
      <RadioGroup value={experience} onValueChange={setExperience}>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
            <RadioGroupItem value="beginner" id="beginner" />
            <Label htmlFor="beginner" className="flex-1 cursor-pointer">
              <div className="font-medium">Débutant</div>
              <div className="text-sm text-muted-foreground">Interface simple avec guidance</div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
            <RadioGroupItem value="intermediate" id="intermediate" />
            <Label htmlFor="intermediate" className="flex-1 cursor-pointer">
              <div className="font-medium">Intermédiaire</div>
              <div className="text-sm text-muted-foreground">Interface standard avec suggestions</div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
            <RadioGroupItem value="expert" id="expert" />
            <Label htmlFor="expert" className="flex-1 cursor-pointer">
              <div className="font-medium">Expert</div>
              <div className="text-sm text-muted-foreground">Interface complète avec raccourcis</div>
            </Label>
          </div>
        </div>
      </RadioGroup>
      
      <Button 
        onClick={() => onNext({ experience })} 
        disabled={!experience}
        className="w-full"
        size="lg"
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
    { id: 'projects', label: 'Gérer des projets' },
    { id: 'collaboration', label: 'Collaborer en équipe' },
    { id: 'events', label: 'Organiser des événements' },
    { id: 'resources', label: 'Partager des ressources' }
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
        <h3 className="text-xl font-semibold">Vos objectifs ?</h3>
        <p className="text-muted-foreground">Sélectionnez vos priorités</p>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {availableGoals.map((goal) => {
          const isSelected = goals.includes(goal.id);
          
          return (
            <div
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                isSelected 
                  ? 'border-primary bg-primary/5 shadow-sm' 
                  : 'border-border hover:border-primary/30 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {goal.label}
                </span>
                {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
              </div>
            </div>
          );
        })}
      </div>
      
      <Button 
        onClick={() => onNext({ primaryGoals: goals })} 
        disabled={goals.length === 0}
        className="w-full"
        size="lg"
      >
        Terminer ({goals.length} sélectionnés)
        <CheckCircle className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};