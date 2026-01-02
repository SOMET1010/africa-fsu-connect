import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { logger } from "@/utils/logger";
import { Button } from "@/components/ui/button";
import { NexusLogo } from "@/components/shared/NexusLogo";
import { ArrowLeft, Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    logger.error('404 - route not found', undefined, { url: location.pathname });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--nx-deep))] via-[hsl(var(--nx-night))] to-[hsl(var(--nx-deep))] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[hsl(var(--nx-gold))]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-[hsl(var(--nx-cyan))]/10 rounded-full blur-3xl animate-pulse" />
      
      <div className="relative z-10 text-center max-w-md">
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
        <h2 className="text-2xl font-semibold text-white mb-4 font-poppins">
          Page introuvable
        </h2>
        <p className="text-white/70 mb-8 font-inter">
          La page que vous recherchez n'existe pas ou a été déplacée.
          <br />
          <span className="text-white/50 text-sm">URL: {location.pathname}</span>
        </p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            asChild
            className="bg-gradient-to-r from-[hsl(var(--nx-gold))] to-[hsl(var(--nx-gold))]/80 text-[hsl(var(--nx-night))] hover:from-[hsl(var(--nx-gold))]/90 hover:to-[hsl(var(--nx-gold))]/70 shadow-lg shadow-[hsl(var(--nx-gold))]/20 font-semibold"
          >
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>
          
          <Button 
            asChild
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10 hover:border-white/30"
          >
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tableau de bord
            </Link>
          </Button>
        </div>
        
        {/* Footer */}
        <p className="mt-12 text-white/40 text-sm">
          NEXUS • Plateforme panafricaine du Service Universel
        </p>
      </div>
    </div>
  );
};

export default NotFound;
