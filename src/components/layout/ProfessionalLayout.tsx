
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar, SidebarContent, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import Header from "./Header";
import Footer from "./Footer";
import AppNavigation from "@/components/navigation/AppNavigation";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { FloatingMapButton } from "@/components/shared/FloatingMapButton";
import ImprovedMobileBottomNav from "@/components/navigation/ImprovedMobileBottomNav";

interface ProfessionalLayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
  hideSidebar?: boolean;
}

export const ProfessionalLayout = ({
  children,
  hideFooter = false,
  hideSidebar = false,
}: ProfessionalLayoutProps) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // Si l'utilisateur n'est pas connecté ou si nous sommes sur mobile, on n'affiche pas la sidebar
  const shouldShowSidebar = user && !isMobile && !hideSidebar;

  return (
    <SidebarProvider defaultCollapsed={true}>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <div className="flex flex-1 w-full">
          {shouldShowSidebar && <SideNavigation />}
          
          <main className={cn(
            "flex-1 transition-all duration-300", 
            "min-h-[calc(100vh-4rem)]"
          )}>
            <div className="container mx-auto px-4 py-6">
              {children}
            </div>
          </main>
        </div>
        
        {!hideFooter && <Footer />}
        
        {/* Éléments de navigation mobiles - uniquement pour les utilisateurs connectés */}
        {user && isMobile && (
          <>
            <ImprovedMobileBottomNav />
            <FloatingMapButton />
          </>
        )}
      </div>
    </SidebarProvider>
  );
};

const SideNavigation = () => {
  const { collapsed } = useSidebar();
  
  return (
    <Sidebar
      className={cn(
        "transition-all duration-300 border-r border-border h-auto",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <SidebarContent>
        <AppNavigation />
      </SidebarContent>
    </Sidebar>
  );
};

export default ProfessionalLayout;
