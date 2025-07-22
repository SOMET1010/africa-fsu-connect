import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { FloatingMapButton } from "@/components/shared/FloatingMapButton";
import ImprovedMobileBottomNav from "@/components/navigation/ImprovedMobileBottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";
import { PageTransition } from "@/components/ui/page-transition";
import { ModernSidebar } from "./ModernSidebar";
import ModernHeader from "./ModernHeader";

interface AppShellProps {
  children: ReactNode;
  hideFooter?: boolean;
}

export default function AppShell({ children, hideFooter = false }: AppShellProps) {
  const { user } = useAuth();
  const location = useLocation();
  
  // Pages où la sidebar doit être ouverte par défaut
  const sidebarOpenPages = ['/submit', '/dashboard', '/indicators', '/organizations'];
  const shouldSidebarBeOpen = sidebarOpenPages.includes(location.pathname);

  return (
    <SidebarProvider defaultCollapsed={!shouldSidebarBeOpen}>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex w-full">
        {user && <ModernSidebar />}
        
        <div className="flex flex-col flex-1 min-w-0">
          <ModernHeader />
          <main className="flex-1 relative">
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
      </div>
    </SidebarProvider>
  );
}
