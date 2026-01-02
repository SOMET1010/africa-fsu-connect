import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Globe, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import nexusHeroImage from "@/assets/nexus-hero-africa.png";
import { cn } from "@/lib/utils";
import { NexusAfricaMap } from "./NexusAfricaMap";

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
    description: "Une plateforme de coopération, de projets et de partage au service de l'inclusion numérique africaine.",
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
  showStats = false,
  fullscreen = true,
  parallax = true,
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
      fullscreen ? "min-h-screen" : isLanding ? "min-h-[90vh]" : isMinimal ? "min-h-[40vh]" : "min-h-[60vh]",
      "flex items-center",
      className
    )}>
      {/* ===== LAYER 1: Background Image with Strong Parallax ===== */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{
          transform: parallax ? `translateY(${scrollY * 0.4}px)` : undefined,
          willChange: parallax ? 'transform' : undefined,
        }}
      >
        <img
          src={nexusHeroImage}
          alt="Carte de l'Afrique connectée"
          className="w-full h-[130%] object-cover object-center"
        />
      </div>
      
      {/* ===== LAYER 2: Animated Network Map with Medium Parallax ===== */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: parallax ? `translateY(${scrollY * 0.2}px)` : undefined,
          willChange: parallax ? 'transform' : undefined,
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <NexusAfricaMap animated className="opacity-70" />
      </motion.div>

      {/* ===== LAYER 3: Gradient Overlays for Depth & Readability ===== */}
      <div className="absolute inset-0">
        {/* Main gradient - night to transparent */}
        <div className="absolute inset-0 bg-gradient-to-r from-nx-night/80 via-nx-night/50 to-transparent" />
        
        {/* Top/bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-nx-night/70 via-transparent to-nx-night/50" />
        
        {/* Subtle gold accent bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-nx-gold/10 via-transparent to-transparent" />
      </div>

      {/* ===== LAYER 4: Content (No Parallax - Stable) ===== */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn(
          "max-w-3xl",
          isLanding ? "py-24" : "py-12"
        )}>
          {/* Badge - Réseau panafricain */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Badge 
              className="mb-8 px-5 py-2.5 bg-white/10 backdrop-blur-md border-nx-gold/30 text-white font-medium text-sm"
            >
              <Globe className="h-4 w-4 mr-2 text-nx-gold" />
              Réseau panafricain SUTEL
            </Badge>
          </motion.div>

          {/* Title - Line 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <h1 className={cn(
              "font-bold text-white leading-[1.1] tracking-tight",
              isLanding ? "text-4xl md:text-5xl lg:text-6xl xl:text-7xl" : "text-3xl md:text-4xl"
            )}>
              {title || content.title}
            </h1>
          </motion.div>
          
          {/* Title - Line 2 (Gold accent) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <h1 className={cn(
              "font-bold text-nx-gold leading-[1.1] tracking-tight mt-2",
              isLanding ? "text-4xl md:text-5xl lg:text-6xl xl:text-7xl" : "text-3xl md:text-4xl"
            )}>
              {subtitle || content.titleAccent}
            </h1>
          </motion.div>

          {/* Description */}
          {(description || content.description) && !isMinimal && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className={cn(
                "text-white/80 mt-8 max-w-2xl leading-relaxed",
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
              transition={{ duration: 0.7, delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-4 mt-10"
            >
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-nx-night hover:bg-white/90 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transition-all duration-300 hover:scale-105 font-semibold px-8"
              >
                <Link to="/network">
                  Découvrir le réseau
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 px-8"
              >
                <Link to="/auth">
                  Rejoindre
                </Link>
              </Button>
            </motion.div>
          )}

          {/* Custom children */}
          {children}
        </div>
      </div>
      
      {/* Scroll Indicator - fullscreen landing only */}
      {(fullscreen || isLanding) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/60"
        >
          <span className="text-xs font-medium mb-2 tracking-wide uppercase">Découvrir</span>
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
