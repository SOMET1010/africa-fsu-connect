
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { FloatingMapButton } from "@/components/shared/FloatingMapButton";
import ImprovedMobileBottomNav from "@/components/navigation/ImprovedMobileBottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SimplifiedSidebar } from "./SimplifiedSidebar";
import { useLocation } from "react-router-dom";

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
      <div className="min-h-screen bg-background flex w-full">
        {user && <SimplifiedSidebar />}
        
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1">
            {children}
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
