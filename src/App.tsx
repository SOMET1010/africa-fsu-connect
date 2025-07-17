import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AppShell from "./components/layout/AppShell";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Resources from "./pages/Resources";
import Forum from "./pages/Forum";
import Submit from "./pages/Submit";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import AdminUsers from "./pages/AdminUsers";
import AdminForum from "./pages/AdminForum";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<AppShell><Index /></AppShell>} />
            <Route path="/auth" element={<AppShell hideFooter><Auth /></AppShell>} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppShell><Dashboard /></AppShell>
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
            
            {/* Catch-all route */}
            <Route path="*" element={<AppShell><NotFound /></AppShell>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
