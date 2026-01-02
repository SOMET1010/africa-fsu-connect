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
      
      <div className="min-h-screen bg-[hsl(var(--nx-night))] text-white flex w-full relative">
        {/* Noise texture overlay for cinematic effect */}
        <div 
          className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}
          aria-hidden="true"
        />
        
        {/* Ambient glow effects */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-[hsl(var(--nx-brand-900)/0.15)] blur-[120px]" />
          <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-[hsl(var(--nx-coop-600)/0.1)] blur-[100px]" />
        </div>
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
