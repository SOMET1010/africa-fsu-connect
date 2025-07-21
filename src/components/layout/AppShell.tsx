
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SimplifiedSidebar } from "./SimplifiedSidebar";
import { AppHeader } from "./AppHeader";
import Footer from "./Footer";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { GlobalLoadingIndicator } from "@/components/ui/loading";
import ImprovedMobileBottomNav from "@/components/navigation/ImprovedMobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppShellProps {
  children: ReactNode;
  hideFooter?: boolean;
}

const AppShell = ({ children, hideFooter = false }: AppShellProps) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  // Pour les pages publiques (pas de sidebar)
  if (!user) {
    return (
      <LoadingProvider>
        <div className="min-h-screen bg-background flex flex-col">
          <GlobalLoadingIndicator />
          <AppHeader showSidebar={false} />
          <main className="flex-1">{children}</main>
          {!hideFooter && <Footer />}
        </div>
      </LoadingProvider>
    );
  }

  // Pour les pages authentifiées (avec sidebar)
  return (
    <LoadingProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <GlobalLoadingIndicator />
          {!isMobile && <SimplifiedSidebar />}
          <div className="flex-1 flex flex-col min-h-screen">
            <AppHeader showSidebar={!isMobile} />
            <main className={`flex-1 overflow-auto ${isMobile ? 'p-4 pb-24' : 'p-6'}`}>
              {children}
            </main>
            {!hideFooter && !isMobile && <Footer />}
          </div>
          {isMobile && <ImprovedMobileBottomNav />}
        </div>
      </SidebarProvider>
    </LoadingProvider>
  );
};

export default AppShell;
