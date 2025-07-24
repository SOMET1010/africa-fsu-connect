
import { useEffect, useState } from "react";
import { WelcomeWidget } from "../onboarding/WelcomeWidget";
import { ModernDashboard } from "./ModernDashboard";
import { VirtualAssistant } from "./VirtualAssistant";
import { SmartOnboarding } from "../onboarding/SmartOnboarding";

export function AdaptiveDashboard() {
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  
  useEffect(() => {
    const completed = localStorage.getItem('onboardingCompleted');
    console.log('🔍 DEBUG: onboardingCompleted from localStorage:', completed);
    setOnboardingCompleted(completed === 'true');
  }, []);
  
  // Afficher un loading pendant qu'on vérifie l'état de l'onboarding
  if (onboardingCompleted === null) {
    console.log('🔍 DEBUG: Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  
  // Si l'onboarding n'est pas terminé, afficher l'onboarding intelligent
  if (!onboardingCompleted) {
    console.log('🔍 DEBUG: Showing SmartOnboarding');
    return <SmartOnboarding />;
  }
  
  // Sinon, afficher le dashboard moderne avec l'assistant virtuel
  console.log('🔍 DEBUG: Showing ModernDashboard');
  return (
    <div className="relative">
      <ModernDashboard />
      <VirtualAssistant />
    </div>
  );
}
