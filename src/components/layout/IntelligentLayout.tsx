import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatedPage } from '@/components/ui/animated-page';
import { SmartSuggestions } from '@/components/intelligence/SmartSuggestions';
import { CollaborationPresence } from '@/components/collaboration/CollaborationPresence';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { useContextualIntelligence } from '@/hooks/useContextualIntelligence';
import { useAccessibilityPreferences } from '@/hooks/useAccessibilityPreferences';

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

  // ✅ Afficher les suggestions uniquement dans la couche opérationnelle (Advanced/Admin)
  const shouldShowSuggestions = 
    location.pathname.startsWith('/advanced') || 
    location.pathname.startsWith('/admin');

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
      {/* Collaboration presence indicator */}
      <div className="fixed top-4 right-4 z-50">
        <CollaborationPresence 
          roomId={location.pathname} 
          showDetails={false}
        />
      </div>

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

      {/* Smart suggestions sidebar - UNIQUEMENT sur /advanced et /admin */}
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