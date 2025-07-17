import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import Footer from "./Footer";
import { useAuth } from "@/contexts/AuthContext";

interface AppShellProps {
  children: ReactNode;
  hideFooter?: boolean;
}

const AppShell = ({ children, hideFooter = false }: AppShellProps) => {
  const { user } = useAuth();
  
  // Pour les pages publiques (pas de sidebar)
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader showSidebar={false} />
        <main className="flex-1">{children}</main>
        {!hideFooter && <Footer />}
      </div>
    );
  }

  // Pour les pages authentifiées (avec sidebar)
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader showSidebar={true} />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
          {!hideFooter && <Footer />}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppShell;