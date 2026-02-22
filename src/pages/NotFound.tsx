import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { logger } from "@/utils/logger";
import { Button } from "@/components/ui/button";
import { NexusLogo } from "@/components/shared/NexusLogo";
import { ArrowLeft, Home, LayoutDashboard, Settings, BookOpen, MessageSquare, Calendar, MapPin, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const SUGGESTED_ROUTES = [
  { path: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard, auth: true },
  { path: "/", label: "Accueil", icon: Home, auth: false },
  { path: "/about", label: "À propos", icon: BookOpen, auth: false },
  { path: "/events", label: "Événements", icon: Calendar, auth: false },
  { path: "/contact", label: "Contact", icon: MessageSquare, auth: false },
  { path: "/map", label: "Carte", icon: MapPin, auth: true },
  { path: "/admin", label: "Administration", icon: Settings, auth: true, roles: ["super_admin", "admin_pays", "editeur"] },
  { path: "/admin/content", label: "Gestion du contenu", icon: Settings, auth: true, roles: ["super_admin", "admin_pays", "editeur"] },
  { path: "/security", label: "Sécurité", icon: Shield, auth: true },
];

// Map common mistyped paths to correct ones
const REDIRECT_MAP: Record<string, string> = {
  "/content": "/admin/content",
  "/homepage-editor": "/admin/homepage-editor",
  "/users": "/admin/users",
  "/platform-config": "/admin/platform-config",
  "/focal-points": "/admin/focal-points",
  "/resources": "/admin/resources",
  "/forum-admin": "/admin/forum",
  "/translations": "/admin/translations",
};

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const isAuthenticated = !!user;
  const userRole = profile?.role;

  // Auto-redirect for known mistyped paths
  useEffect(() => {
    const redirect = REDIRECT_MAP[location.pathname];
    if (redirect) {
      navigate(redirect, { replace: true });
      return;
    }
    logger.error('404 - route not found', undefined, { url: location.pathname });
  }, [location.pathname, navigate]);

  const suggestions = useMemo(() => {
    return SUGGESTED_ROUTES.filter((route) => {
      if (route.auth && !isAuthenticated) return false;
      if (route.roles && (!userRole || !route.roles.includes(userRole))) return false;
      return route.path !== location.pathname;
    }).slice(0, 6);
  }, [isAuthenticated, userRole, location.pathname]);

  // If redirecting, show nothing
  if (REDIRECT_MAP[location.pathname]) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--nx-deep))] via-[hsl(var(--nx-night))] to-[hsl(var(--nx-deep))] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[hsl(var(--nx-gold))]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-[hsl(var(--nx-cyan))]/10 rounded-full blur-3xl animate-pulse" />
      
      <div className="relative z-10 text-center max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
            <NexusLogo size="md" variant="icon" />
          </div>
        </div>
        
        {/* 404 */}
        <div className="mb-6">
          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--nx-gold))] to-[hsl(var(--nx-cyan))] font-poppins">
            404
          </h1>
        </div>
        
        {/* Message */}
        <h2 className="text-2xl font-semibold text-white mb-3 font-poppins">
          Page introuvable
        </h2>
        <p className="text-white/70 mb-8 font-inter">
          La page <span className="font-mono text-white/50 text-sm bg-white/5 px-2 py-0.5 rounded">{location.pathname}</span> n'existe pas ou a été déplacée.
        </p>
        
        {/* Primary actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Button 
            asChild
            className="bg-gradient-to-r from-[hsl(var(--nx-gold))] to-[hsl(var(--nx-gold))]/80 text-[hsl(var(--nx-night))] hover:from-[hsl(var(--nx-gold))]/90 hover:to-[hsl(var(--nx-gold))]/70 shadow-lg shadow-[hsl(var(--nx-gold))]/20 font-semibold"
          >
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>
          
          {isAuthenticated && (
            <Button 
              asChild
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 hover:border-white/30"
            >
              <Link to="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Tableau de bord
              </Link>
            </Button>
          )}

          <Button 
            variant="ghost" 
            className="text-white/60 hover:text-white hover:bg-white/10"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Page précédente
          </Button>
        </div>

        {/* Suggested pages */}
        {suggestions.length > 0 && (
          <div className="border-t border-white/10 pt-6">
            <p className="text-white/50 text-sm mb-4">Pages suggérées</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {suggestions.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-colors text-sm text-white/70 hover:text-white"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--nx-gold))]/70" />
                  <span className="truncate">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Footer */}
        <p className="mt-10 text-white/40 text-sm">
          NEXUS • Plateforme panafricaine du Service Universel
        </p>
      </div>
    </div>
  );
};

export default NotFound;
