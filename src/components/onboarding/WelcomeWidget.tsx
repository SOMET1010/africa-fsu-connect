
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  User, 
  FileText, 
  Users, 
  MessageSquare,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  action: string;
  route: string;
  completed: boolean;
}

export function WelcomeWidget() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const onboardingSteps: OnboardingStep[] = [
    {
      id: "profile",
      title: "Complétez votre profil",
      description: "Ajoutez vos informations personnelles et professionnelles",
      icon: User,
      action: "Compléter",
      route: "/profile",
      completed: !!(profile?.first_name && profile?.last_name && profile?.organization)
    },
    {
      id: "organizations",
      title: "Explorez les organisations",
      description: "Découvrez les agences FSU et partenaires continentaux",
      icon: Users,
      action: "Explorer",
      route: "/organizations",
      completed: false
    },
    {
      id: "resources",
      title: "Consultez les ressources",
      description: "Accédez aux guides et meilleures pratiques",
      icon: FileText,
      action: "Consulter",
      route: "/docs",
      completed: false
    },
    {
      id: "forum",
      title: "Rejoignez les discussions",
      description: "Participez aux échanges de la communauté FSU",
      icon: MessageSquare,
      action: "Participer",
      route: "/forum",
      completed: false
    }
  ];

  const completedSteps = onboardingSteps.filter(step => step.completed).length;
  const progress = (completedSteps / onboardingSteps.length) * 100;

  const handleStepClick = (route: string) => {
    navigate(route);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <Card className="w-full bg-gradient-to-br from-primary/5 to-blue-50 border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FSU</span>
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">
                Bienvenue sur la Plateforme FSU Afrique
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Commencez votre collaboration dès maintenant
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDismiss}
            className="h-8 w-8 p-0 hover:bg-primary/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progression</span>
            <span className="font-medium text-foreground">
              {completedSteps}/{onboardingSteps.length} étapes
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid gap-3">
          {onboardingSteps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-sm ${
                  step.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-border hover:border-primary/30'
                }`}
                onClick={() => handleStepClick(step.route)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <IconComponent className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`font-medium text-sm ${
                      step.completed ? 'text-green-700' : 'text-foreground'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {step.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {step.completed ? (
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      Terminé
                    </Badge>
                  ) : (
                    <Button size="sm" variant="outline" className="text-xs">
                      {step.action}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {completedSteps === onboardingSteps.length && (
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-green-700 text-sm">
              Félicitations ! Vous avez terminé la configuration initiale.
            </p>
            <p className="text-xs text-green-600 mt-1">
              Vous êtes maintenant prêt à collaborer efficacement.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
