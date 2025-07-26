
import { useEffect, useState } from "react";
import { UserFirstDashboard } from "./UserFirstDashboard";
import { VirtualAssistant } from "./VirtualAssistant";
import { SimpleOnboarding } from "../onboarding/SimpleOnboarding";

export function AdaptiveDashboard() {
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  
  useEffect(() => {
    const completed = localStorage.getItem('onboardingCompleted');
    setOnboardingCompleted(completed === 'true');
  }, []);
  
  // Afficher un loading pendant qu'on vérifie l'état de l'onboarding
  if (onboardingCompleted === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  
  // Si l'onboarding n'est pas terminé, afficher l'onboarding simplifié
  if (!onboardingCompleted) {
    return <SimpleOnboarding />;
  }
  
  // Sinon, afficher le dashboard simplifié "Users First"
  return (
    <div className="relative">
      <UserFirstDashboard />
      <VirtualAssistant />
    </div>
  );
}
