
import { useEffect, useState } from "react";
import { WelcomeWidget } from "../onboarding/WelcomeWidget";
import { ModernDashboard } from "./ModernDashboard";
import { ConfigurableDashboard } from "./ConfigurableDashboard";
import { VirtualAssistant } from "./VirtualAssistant";
import { SmartOnboarding } from "../onboarding/SmartOnboarding";

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
  
  // Si l'onboarding n'est pas terminé, afficher l'onboarding intelligent
  if (!onboardingCompleted) {
    return <SmartOnboarding />;
  }
  
  // Sinon, afficher le dashboard intelligent configuré avec l'assistant virtuel
  return (
    <div className="relative">
      <ConfigurableDashboard />
      <VirtualAssistant />
    </div>
  );
}
