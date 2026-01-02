import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Globe, Users, Sparkles, Network, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import nexusHeroImage from "@/assets/nexus-hero-africa.png";
import { cn } from "@/lib/utils";

interface NexusHeroProps {
  variant?: "landing" | "section" | "minimal";
  title?: string;
  subtitle?: string;
  description?: string;
  showStats?: boolean;
  fullscreen?: boolean;
  parallax?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const defaultContent = {
  landing: {
    title: "54 pays construisent ensemble",
    titleAccent: "l'avenir du Service Universel en Afrique",
    description: "Une plateforme panafricaine de coopération, de projets et de bonnes pratiques pour l'inclusion numérique.",
  },
  section: {
    title: "Réseau NEXUS",
    titleAccent: "Afrique connectée",
    description: "Plateforme de coopération des Fonds de Service Universel africains.",
  },
  minimal: {
    title: "NEXUS",
    titleAccent: "Coopération panafricaine",
    description: "",
  },
};

export function NexusHero({
  variant = "landing",
  title,
  subtitle,
  description,
  showStats = true,
  fullscreen = false,
  parallax = false,
  className,
  children,
}: NexusHeroProps) {
  const content = defaultContent[variant];
  const isLanding = variant === "landing";
  const isMinimal = variant === "minimal";
  
  // Parallax scroll effect
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    if (!parallax) return;
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [parallax]);

  return (
    <div className={cn(
      "relative overflow-hidden",
      fullscreen ? "min-h-screen" : isLanding ? "min-h-[85vh]" : isMinimal ? "min-h-[40vh]" : "min-h-[60vh]",
      "flex items-center",
      className
    )}>
      {/* Background Image with Parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={nexusHeroImage}
          alt="Carte de l'Afrique connectée"
          className="w-full h-[120%] object-cover object-center"
          style={{
            transform: parallax ? `translateY(${scrollY * 0.3}px)` : undefined,
            willChange: parallax ? 'transform' : undefined,
          }}
        />
        
        {/* Gradient overlay - bleu nuit → or africain */}
        <div className="absolute inset-0 bg-gradient-to-r from-nx-night/90 via-nx-night/70 to-nx-gold/30" />
        
        {/* Additional vignette for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-nx-night/60 via-transparent to-nx-night/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn(
          "max-w-3xl",
          isLanding ? "py-20" : "py-12"
        )}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge 
              className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-md border-white/20 text-white font-medium"
            >
              <Network className="h-4 w-4 mr-2" />
              Plateforme panafricaine
            </Badge>
          </motion.div>

          {/* Title - Line 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <h1 className={cn(
              "font-bold text-white leading-tight",
              isLanding ? "text-4xl md:text-5xl lg:text-6xl" : "text-3xl md:text-4xl"
            )}>
              {title || content.title}
            </h1>
          </motion.div>
          
          {/* Title - Line 2 (Gold accent) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            <h1 className={cn(
              "font-bold text-nx-gold leading-tight mt-2",
              isLanding ? "text-4xl md:text-5xl lg:text-6xl" : "text-3xl md:text-4xl"
            )}>
              {subtitle || content.titleAccent}
            </h1>
          </motion.div>

          {/* Description */}
          {(description || content.description) && !isMinimal && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className={cn(
                "text-white/80 mt-6 max-w-2xl",
                isLanding ? "text-lg md:text-xl" : "text-base md:text-lg"
              )}
            >
              {description || content.description}
            </motion.p>
          )}

          {/* CTAs - landing only */}
          {isLanding && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mt-8"
            >
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-nx-night hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Link to="/network">
                  Explorer le réseau
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <Link to="/auth">
                  Rejoindre
                </Link>
              </Button>
            </motion.div>
          )}

          {/* Stats - optional */}
          {showStats && isLanding && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Globe className="h-6 w-6 text-nx-gold" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">54</div>
                  <div className="text-sm text-white/70">pays membres</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-nx-cyan" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">100+</div>
                  <div className="text-sm text-white/70">projets partagés</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Users className="h-6 w-6 text-nx-coop-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-sm text-white/70">membres actifs</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Custom children */}
          {children}
        </div>
      </div>
      
      {/* Scroll Indicator - fullscreen only */}
      {fullscreen && isLanding && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/70"
        >
          <span className="text-xs font-medium mb-2">Découvrir</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
