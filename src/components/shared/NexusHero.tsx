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
    description: "Une plateforme de coopération, de projets et de partage au service de l'inclusion numérique africaine.",
  },
  section: {
    title: "Réseau NEXUS — Afrique connectée",
    description: "Plateforme de coopération des Fonds de Service Universel africains.",
  },
  minimal: {
    title: "NEXUS — Coopération panafricaine",
    description: "",
  },
};

// Abstract African geometric pattern (Adinkra/Kente inspired)
const africanPatternSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="120" viewBox="0 0 80 120">
  <defs>
    <linearGradient id="patternGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#D4AF37;stop-opacity:0.6"/>
      <stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:0.3"/>
    </linearGradient>
  </defs>
  <g fill="none" stroke="url(#patternGrad)" stroke-width="0.5">
    <path d="M0,20 L20,0 L40,20 L20,40 Z"/>
    <path d="M40,20 L60,0 L80,20 L60,40 Z"/>
    <path d="M20,40 L40,20 L60,40 L40,60 Z"/>
    <path d="M0,60 L20,40 L40,60 L20,80 Z"/>
    <path d="M40,60 L60,40 L80,60 L60,80 Z"/>
    <path d="M20,80 L40,60 L60,80 L40,100 Z"/>
    <path d="M0,100 L20,80 L40,100 L20,120 Z"/>
    <path d="M40,100 L60,80 L80,100 L60,120 Z"/>
    <circle cx="20" cy="20" r="3"/>
    <circle cx="60" cy="20" r="3"/>
    <circle cx="40" cy="40" r="3"/>
    <circle cx="20" cy="60" r="3"/>
    <circle cx="60" cy="60" r="3"/>
    <circle cx="40" cy="80" r="3"/>
    <circle cx="20" cy="100" r="3"/>
    <circle cx="60" cy="100" r="3"/>
  </g>
</svg>`;

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
        
        {/* Radial overlay for text readability (left side) */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 20% 50%, rgba(11,19,43,0.75) 0%, rgba(11,19,43,0.35) 50%, transparent 70%)'
          }}
        />
      </div>
      
      {/* ===== African Geometric Pattern - Left Edge ===== */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-24 md:w-32 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(africanPatternSVG)}")`,
          backgroundRepeat: 'repeat-y',
          backgroundSize: '100% auto'
        }}
      />
      
      {/* ===== African Geometric Pattern - Right Edge ===== */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-24 md:w-32 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(africanPatternSVG)}")`,
          backgroundRepeat: 'repeat-y',
          backgroundSize: '100% auto',
          transform: 'scaleX(-1)'
        }}
      />

      {/* ===== LAYER 4: Content (No Parallax - Stable) ===== */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn(
          "max-w-3xl",
          isLanding ? "py-24" : "py-12"
        )}>
          {/* Badge - Premium glass style */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Badge 
              className="mb-8 px-5 py-2.5 bg-white/[0.08] backdrop-blur-lg border border-nx-gold/25 shadow-lg shadow-black/20 text-white/90 font-medium text-sm hover:bg-white/[0.12] transition-all duration-300"
            >
              <Globe className="h-4 w-4 mr-2 text-nx-gold/80" />
              Réseau panafricain SUTEL
            </Badge>
          </motion.div>

          {/* Title - Line 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <h1 
              className={cn(
                "font-bold text-white leading-[1.1] tracking-tight",
                isLanding ? "text-4xl md:text-5xl lg:text-6xl xl:text-7xl" : "text-3xl md:text-4xl"
              )}
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
            >
              {title || content.title}
            </h1>
          </motion.div>
          
          {/* Title - Line 2 (with "Service Universel" gold accent) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <h1 
              className={cn(
                "font-bold text-white leading-[1.1] tracking-tight mt-2",
                isLanding ? "text-4xl md:text-5xl lg:text-6xl xl:text-7xl" : "text-3xl md:text-4xl"
              )}
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
            >
              {subtitle || (
                <>
                  l'avenir du{" "}
                  <span 
                    className="text-nx-gold"
                    style={{ textShadow: '0 2px 18px rgba(0,0,0,0.45), 0 0 40px rgba(212,175,55,0.2)' }}
                  >
                    Service Universel
                  </span>
                  {" "}en Afrique
                </>
              )}
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
              className="mt-10"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="group bg-gradient-to-r from-white via-white to-white/95 text-nx-night hover:from-white/95 hover:to-white shadow-xl shadow-black/25 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300 font-semibold px-8 py-6"
                >
                  <Link to="/network">
                    Découvrir le réseau
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="border border-white/40 bg-white/[0.08] backdrop-blur-md text-white hover:bg-white/15 hover:border-white/60 transition-all duration-300 font-medium px-8 py-6"
                >
                  <Link to="/auth">
                    Rejoindre
                  </Link>
                </Button>
              </div>
              
              {/* Micro-text under CTAs */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="text-white/50 text-xs mt-4 text-center sm:text-left"
              >
                Accès public aux ressources • Mode avancé réservé aux membres
              </motion.p>
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
