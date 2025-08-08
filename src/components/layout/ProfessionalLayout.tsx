
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ModernHeader from "./ModernHeader";
import Footer from "./Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { FloatingMapButton } from "@/components/shared/FloatingMapButton";
import ImprovedMobileBottomNav from "@/components/navigation/ImprovedMobileBottomNav";

interface ProfessionalLayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

const MainContent = ({ children, hideFooter }: {
  children: ReactNode;
  hideFooter: boolean;
}) => {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
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
}: ProfessionalLayoutProps) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background flex w-full">
      <MainContent 
        children={children}
        hideFooter={hideFooter}
      />
      
      {/* Éléments de navigation mobiles - uniquement pour les utilisateurs connectés */}
      {user && isMobile && (
        <>
          <ImprovedMobileBottomNav />
          <FloatingMapButton />
        </>
      )}
    </div>
  );
};

export default ProfessionalLayout;
