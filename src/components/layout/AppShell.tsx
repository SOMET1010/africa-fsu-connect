
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { FloatingMapButton } from "@/components/shared/FloatingMapButton";
import ImprovedMobileBottomNav from "@/components/navigation/ImprovedMobileBottomNav";
import { useAuth } from "@/contexts/AuthContext";

interface AppShellProps {
  children: ReactNode;
  hideFooter?: boolean;
}

export default function AppShell({ children, hideFooter = false }: AppShellProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && <Footer />}
      
      {/* Navigation mobile et bouton flottant - uniquement pour les utilisateurs connectés */}
      {user && (
        <>
          <ImprovedMobileBottomNav />
          <FloatingMapButton />
        </>
      )}
    </div>
  );
}
