import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { UserPreferencesProvider } from "./contexts/UserPreferencesContext";
import { IntelligentLayout } from "./components/layout/IntelligentLayout";
import AppShell from "./components/layout/AppShell";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Skeleton } from "@/components/ui/skeleton";
import { useCriticalPreloader } from "./hooks/usePreloader";

// Eager loaded components (critical for initial render)
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Lazy loaded components with route-based splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Indicators = lazy(() => import("./pages/Indicators"));
const Organizations = lazy(() => import("./pages/Organizations"));
const Projects = lazy(() => import("./pages/Projects"));
const Resources = lazy(() => import("./pages/Resources"));
const Forum = lazy(() => import("./pages/Forum"));
const Submit = lazy(() => import("./pages/Submit"));
const Events = lazy(() => import("./pages/Events"));
const Profile = lazy(() => import("./pages/Profile"));
const Preferences = lazy(() => import("./pages/Preferences"));
const AdvancedPreferences = lazy(() => import("./pages/AdvancedPreferences"));
const Security = lazy(() => import("./pages/Security"));
const Map = lazy(() => import("./pages/Map"));
const Analytics = lazy(() => import("./pages/Analytics"));

// Admin components (separate chunk)
const Admin = lazy(() => import("./pages/Admin"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminForum = lazy(() => import("./pages/AdminForum"));

// Loading fallback component
const PageLoadingFallback = () => (
  <div className="flex flex-col space-y-3 p-6">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  </div>
);

const queryClient = new QueryClient();

const AppContent = () => {
  useCriticalPreloader();
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<AppShell><Index /></AppShell>} />
      <Route path="/auth" element={<AppShell hideFooter><Auth /></AppShell>} />
      
      {/* Protected routes with Suspense */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppShell>
            <Suspense fallback={<PageLoadingFallback />}>
              <Dashboard />
            </Suspense>
          </AppShell>
        </ProtectedRoute>
      } />
      <Route path="/indicators" element={
        <ProtectedRoute>
          <AppShell>
            <Suspense fallback={<PageLoadingFallback />}>
              <Indicators />
            </Suspense>
          </AppShell>
        </ProtectedRoute>
      } />
      <Route path="/map" element={
        <ProtectedRoute>
          <AppShell>
            <Suspense fallback={<PageLoadingFallback />}>
              <Map />
            </Suspense>
          </AppShell>
        </ProtectedRoute>
      } />
      <Route path="/organizations" element={
        <ProtectedRoute>
          <AppShell>
            <Suspense fallback={<PageLoadingFallback />}>
              <Organizations />
            </Suspense>
          </AppShell>
        </ProtectedRoute>
      } />
      <Route path="/projects" element={
        <ProtectedRoute>
          <AppShell>
            <Suspense fallback={<PageLoadingFallback />}>
              <Projects />
            </Suspense>
          </AppShell>
        </ProtectedRoute>
      } />
      <Route path="/docs" element={
        <ProtectedRoute>
          <AppShell>
            <Suspense fallback={<PageLoadingFallback />}>
              <Resources />
            </Suspense>
          </AppShell>
        </ProtectedRoute>
      } />
      <Route path="/forum" element={
        <ProtectedRoute>
          <AppShell>
            <Suspense fallback={<PageLoadingFallback />}>
              <Forum />
            </Suspense>
          </AppShell>
        </ProtectedRoute>
      } />
      <Route path="/submit" element={
        <ProtectedRoute>
          <AppShell>
            <Suspense fallback={<PageLoadingFallback />}>
              <Submit />
            </Suspense>
          </AppShell>
        </ProtectedRoute>
      } />
      <Route path="/events" element={
        <ProtectedRoute>
          <AppShell>
            <Suspense fallback={<PageLoadingFallback />}>
              <Events />
            </Suspense>
          </AppShell>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <AppShell>
            <Suspense fallback={<PageLoadingFallback />}>
              <Profile />
            </Suspense>
          </AppShell>
        </ProtectedRoute>
      } />
      <Route path="/preferences" element={
        <ProtectedRoute>
          <AppShell>
            <Suspense fallback={<PageLoadingFallback />}>
              <Preferences />
            </Suspense>
          </AppShell>
        </ProtectedRoute>
      } />
      <Route path="/preferences/advanced" element={
        <ProtectedRoute>
          <AppShell>
            <Suspense fallback={<PageLoadingFallback />}>
              <AdvancedPreferences />
            </Suspense>
          </AppShell>
        </ProtectedRoute>
      } />
      <Route path="/security" element={
        <ProtectedRoute>
          <AppShell>
            <Suspense fallback={<PageLoadingFallback />}>
              <Security />
            </Suspense>
          </AppShell>
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute>
          <AppShell>
            <Suspense fallback={<PageLoadingFallback />}>
              <Analytics />
            </Suspense>
          </AppShell>
        </ProtectedRoute>
      } />
      
      {/* Admin routes with separate chunk */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRoles={['super_admin', 'admin_pays', 'editeur']}>
          <AppShell>
            <Suspense fallback={<PageLoadingFallback />}>
              <Admin />
            </Suspense>
          </AppShell>
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute requiredRoles={['super_admin', 'admin_pays', 'editeur']}>
          <AppShell>
            <Suspense fallback={<PageLoadingFallback />}>
              <AdminUsers />
            </Suspense>
          </AppShell>
        </ProtectedRoute>
      } />
      <Route path="/admin/forum" element={
        <ProtectedRoute requiredRoles={['super_admin', 'admin_pays', 'editeur']}>
          <AppShell>
            <Suspense fallback={<PageLoadingFallback />}>
              <AdminForum />
            </Suspense>
          </AppShell>
        </ProtectedRoute>
      } />
      
      {/* Catch-all route */}
      <Route path="*" element={<AppShell><NotFound /></AppShell>} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <UserPreferencesProvider>
            <IntelligentLayout>
              <AppContent />
            </IntelligentLayout>
          </UserPreferencesProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;