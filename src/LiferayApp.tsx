import { createContext, useContext, useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { IntelligentLayout } from "./components/layout/IntelligentLayout";
import AppShell from "./components/layout/AppShell";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Organizations from "./pages/Organizations";
import Projects from "./pages/Projects";
import Resources from "./pages/Resources";
import Forum from "./pages/Forum";
import Submit from "./pages/Submit";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import AdminUsers from "./pages/AdminUsers";
import AdminForum from "./pages/AdminForum";
import Security from "./pages/Security";
import NotFound from "./pages/NotFound";
import Preferences from "./pages/Preferences";
import Map from "./pages/Map";
import { LiferayAuthProvider } from "./contexts/LiferayAuthContext";
import { LiferayWrapper } from "./components/layout/LiferayWrapper";

// Liferay Context
interface LiferayContextType {
  namespace: string;
  currentUrl: string;
  userId: string;
}

const LiferayContext = createContext<LiferayContextType | null>(null);

export const useLiferay = () => {
  const context = useContext(LiferayContext);
  if (!context) {
    throw new Error('useLiferay must be used within a LiferayProvider');
  }
  return context;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Adapter pour le contexte Liferay
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

interface LiferayAppProps {
  namespace: string;
  currentUrl: string;
  userId: string;
}

const LiferayApp = ({ namespace, currentUrl, userId }: LiferayAppProps) => {
  const [isLiferayReady, setIsLiferayReady] = useState(false);

  useEffect(() => {
    // Attendre que Liferay soit prêt
    if (window.Liferay && window.Liferay.ready) {
      window.Liferay.ready(() => {
        setIsLiferayReady(true);
      });
    } else {
      setIsLiferayReady(true);
    }
  }, []);

  if (!isLiferayReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <LiferayContext.Provider value={{ namespace, currentUrl, userId }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LiferayWrapper>
            <div className={`liferay-portlet-${namespace}`}>
              <Toaster />
              <Sonner />
              <HashRouter basename={`/web/guest/-/${namespace}`}>
                <LiferayAuthProvider>
                  <IntelligentLayout>
                    {/* Routes publiques */}
                    <Route path="/" element={<AppShell><Index /></AppShell>} />
                    <Route path="/auth" element={<AppShell hideFooter><Auth /></AppShell>} />
                    
                    {/* Routes protégées */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <AppShell><Dashboard /></AppShell>
                      </ProtectedRoute>
                    } />
                    <Route path="/map" element={
                      <ProtectedRoute>
                        <AppShell><Map /></AppShell>
                      </ProtectedRoute>
                    } />
                    <Route path="/organizations" element={
                      <ProtectedRoute>
                        <AppShell><Organizations /></AppShell>
                      </ProtectedRoute>
                    } />
                    <Route path="/projects" element={
                      <ProtectedRoute>
                        <AppShell><Projects /></AppShell>
                      </ProtectedRoute>
                    } />
                    <Route path="/docs" element={
                      <ProtectedRoute>
                        <AppShell><Resources /></AppShell>
                      </ProtectedRoute>
                    } />
                    <Route path="/forum" element={
                      <ProtectedRoute>
                        <AppShell><Forum /></AppShell>
                      </ProtectedRoute>
                    } />
                    <Route path="/submit" element={
                      <ProtectedRoute>
                        <AppShell><Submit /></AppShell>
                      </ProtectedRoute>
                    } />
                    <Route path="/events" element={
                      <ProtectedRoute>
                        <AppShell><Events /></AppShell>
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <AppShell><Profile /></AppShell>
                      </ProtectedRoute>
                    } />
                    <Route path="/preferences" element={
                      <ProtectedRoute>
                        <AppShell><Preferences /></AppShell>
                      </ProtectedRoute>
                    } />
                    <Route path="/security" element={
                      <ProtectedRoute>
                        <AppShell><Security /></AppShell>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                      <ProtectedRoute requiredRoles={['super_admin', 'admin_pays', 'editeur']}>
                        <AppShell><Admin /></AppShell>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/users" element={
                      <ProtectedRoute requiredRoles={['super_admin', 'admin_pays', 'editeur']}>
                        <AppShell><AdminUsers /></AppShell>
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/forum" element={
                      <ProtectedRoute requiredRoles={['super_admin', 'admin_pays', 'editeur']}>
                        <AppShell><AdminForum /></AppShell>
                      </ProtectedRoute>
                    } />
                    
                    {/* Route par défaut */}
                    <Route path="*" element={<AppShell><NotFound /></AppShell>} />
                  </Routes>
                </IntelligentLayout>
              </LiferayAuthProvider>
            </HashRouter>
          </div>
        </LiferayWrapper>
      </QueryClientProvider>
    </LiferayContext.Provider>
  );
};

export default LiferayApp;
