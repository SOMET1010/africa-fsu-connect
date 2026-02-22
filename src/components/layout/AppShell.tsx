import { ReactNode } from "react";
import ModernHeader from "./ModernHeader";
import Footer from "./Footer";
import { FloatingMapButton } from "@/components/shared/FloatingMapButton";
import ImprovedMobileBottomNav from "@/components/navigation/ImprovedMobileBottomNav";
import { SutaChatbot } from "@/components/assistant/SutaChatbot";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { PageTransition } from "@/components/ui/page-transition";
import { SkipLinks } from "@/components/ui/skip-links";
import { useAccessibility } from "@/hooks/useAccessibility";

interface AppShellProps {
  children: ReactNode;
  hideFooter?: boolean;
}

export default function AppShell({ children, hideFooter = false }: AppShellProps) {
  const { user } = useAuth();
  const location = useLocation();
  const { manageFocus } = useAccessibility({
    enableSkipLinks: true,
    enableFocusManagement: true
  });
  
  // Special handling for auth page
  if (location.pathname === '/auth') {
    return (
      <div className="min-h-screen">
        <PageTransition variant="fade" duration="normal">
          {children}
        </PageTransition>
      </div>
    );
  }
  
  // Pages où la sidebar doit être ouverte par défaut
  const sidebarOpenPages = ['/submit', '/dashboard', '/indicators', '/organizations'];
  const shouldSidebarBeOpen = sidebarOpenPages.includes(location.pathname);

  // Skip links configuration
  const skipLinks = [
    { href: "#main-content", label: "Aller au contenu principal" },
    { href: "#app-navigation", label: "Aller à la navigation" }
  ];

  return (
    <>
      {/* Skip Links pour l'accessibilité */}
      <SkipLinks links={skipLinks} />
      
      <div className="min-h-screen bg-background text-foreground flex w-full relative">
        {/* Clean background - no decorative effects */}
        <div className="flex flex-col flex-1 min-w-0">
            <div id="app-navigation">
              <ModernHeader />
            </div>
          <main id="main-content" className="flex-1 relative" tabIndex={-1}>
            <PageTransition variant="fade" duration="normal">
              {children}
            </PageTransition>
          </main>
          {!hideFooter && <Footer />}
        </div>
        
        {/* Navigation mobile et bouton flottant - uniquement pour les utilisateurs connectés */}
        {user && (
          <>
            <ImprovedMobileBottomNav />
            <FloatingMapButton />
          </>
        )}
        
        {/* Chatbot SUTA - Global */}
        <SutaChatbot />
      </div>
    </>
  );
}
