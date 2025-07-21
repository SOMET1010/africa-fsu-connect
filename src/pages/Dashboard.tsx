
import { AdaptiveDashboard } from "@/components/dashboard/AdaptiveDashboard";
import { WelcomeWidget } from "@/components/onboarding/WelcomeWidget";
import { QuickActionsCard } from "@/components/dashboard/QuickActionsCard";
import { AnimatedPage } from "@/components/ui/animated-page";
import { useGlobalShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Dashboard() {
  const { profile } = useAuth();
  const isMobile = useIsMobile();
  
  // Enable global keyboard shortcuts
  useGlobalShortcuts();

  const isNewUser = !profile?.first_name || !profile?.last_name || !profile?.organization;

  return (
    <AnimatedPage variant="fade" className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Section d'accueil pour les nouveaux utilisateurs */}
      {isNewUser && (
        <div className="mb-6">
          <WelcomeWidget />
        </div>
      )}

      {/* Layout adaptatif selon l'écran */}
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-4'}`}>
        {/* Actions rapides - prioritaire sur mobile */}
        {!isMobile && (
          <div className="lg:col-span-1">
            <QuickActionsCard />
          </div>
        )}

        {/* Tableau de bord principal */}
        <div className={isMobile ? 'col-span-1' : 'lg:col-span-3'}>
          <AdaptiveDashboard />
        </div>

        {/* Actions rapides sur mobile - en bas */}
        {isMobile && (
          <div className="col-span-1">
            <QuickActionsCard />
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
