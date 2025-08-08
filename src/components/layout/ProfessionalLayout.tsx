
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar, SidebarContent, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import ModernHeader from "./ModernHeader";
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

const MainContent = ({ children, hideFooter, shouldShowSidebar }: {
  children: ReactNode;
  hideFooter: boolean;
  shouldShowSidebar: boolean;
}) => {
  const { collapsed } = useSidebar();
  
  return (
    <div className={cn(
      "flex-1 flex flex-col min-h-screen transition-all duration-300",
      shouldShowSidebar ? (collapsed ? "ml-16" : "ml-64") : "ml-0"
    )}>
      <ModernHeader />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
      
      {!hideFooter && <Footer />}
    </div>
  );
};

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
      <div className="min-h-screen bg-background flex w-full">
        {shouldShowSidebar && <SideNavigation />}
        
        <MainContent 
          children={children}
          hideFooter={hideFooter}
          shouldShowSidebar={shouldShowSidebar}
        />
        
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
        "fixed left-0 top-0 h-screen transition-all duration-300 border-r border-border",
        "z-sidebar bg-sidebar shadow-lg",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <SidebarContent className="h-full">
        <AppNavigation />
      </SidebarContent>
    </Sidebar>
  );
};

export default ProfessionalLayout;
