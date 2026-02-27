import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatedPage } from '@/components/ui/animated-page';
import { SmartSuggestions } from '@/components/intelligence/SmartSuggestions';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { useContextualIntelligence } from '@/hooks/useContextualIntelligence';
import { useAccessibilityPreferences } from '@/hooks/useAccessibilityPreferences';
import { allowSmartSuggestions } from '@/config/blueprintGuards';

interface IntelligentLayoutProps {
  children: React.ReactNode;
}

interface IntelligentLayoutInnerProps {
  children: React.ReactNode;
}

const IntelligentLayoutInner = ({ children }: IntelligentLayoutInnerProps) => {
  const location = useLocation();
  const { trackActivity } = useContextualIntelligence();
  const { animationsEnabled } = useAccessibilityPreferences();

  // ✅ C-LOCK: Utilise blueprintGuards.ts comme source unique de vérité
  const shouldShowSuggestions = allowSmartSuggestions(location.pathname);

  // Track page visits for contextual intelligence
  useEffect(() => {
    trackActivity({
      page: location.pathname,
      action: 'page_visit',
      metadata: { timestamp: Date.now() }
    });
  }, [location.pathname]); // Removed trackActivity from dependencies to avoid infinite loop

  return (
    <div className="min-h-screen bg-background">
      {/* Content with conditional animations - no main element as it's handled by AppShell */}
      <div className="relative">
        {animationsEnabled ? (
          <AnimatedPage>
            {children}
          </AnimatedPage>
        ) : (
          children
        )}
      </div>

      {/* 
        ╔══════════════════════════════════════════════════════════════════╗
        ║  NEXUS BLUEPRINT - SMART SUGGESTIONS GARDE-FOU                   ║
        ║                                                                  ║
        ║  Les suggestions intelligentes ne s'affichent QUE sur :          ║
        ║  - /advanced/* (Mode Avancé)                                     ║
        ║  - /admin/* (Administration)                                     ║
        ║                                                                  ║
        ║  JAMAIS sur / ou /network (couche politique Layer 1)             ║
        ║  Voir blueprintGuards.ts pour les règles centralisées            ║
        ╚══════════════════════════════════════════════════════════════════╝
      */}
      {shouldShowSuggestions && (
        <div className="fixed bottom-4 right-4 w-80 max-w-[calc(100vw-2rem)] z-40">
          <SmartSuggestions compact maxSuggestions={2} />
        </div>
      )}
    </div>
  );
};

export const IntelligentLayout = ({ children }: IntelligentLayoutProps) => {
  return (
    <UserPreferencesProvider>
      <IntelligentLayoutInner>
        {children}
      </IntelligentLayoutInner>
    </UserPreferencesProvider>
  );
};
