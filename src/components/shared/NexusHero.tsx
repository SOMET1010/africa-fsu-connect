import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Globe, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import nexusHeroImage from "@/assets/nexus-hero-africa.png";
import { cn } from "@/lib/utils";
import { NexusAfricaMap } from "./NexusAfricaMap";
import { useDirection } from "@/hooks/useDirection";
import { useTranslation } from "@/hooks/useTranslation";

// --- Types & Constants ---

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

// --- Sub-components (Extracted for cleaner code) ---

// Abstract African geometric pattern (Adinkra/Kente inspired) - Memoized
const AfricanPattern = ({ className, style }: { className?: string; style?: React.CSSProperties }) => {
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="120" viewBox="0 0 80 120">
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
  
  return (
    <div 
      className={cn("absolute top-0 bottom-0 pointer-events-none", className)}
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svgString)}")`,
        backgroundRepeat: 'repeat-y',
        backgroundSize: '100% auto',
        ...style
      }}
    />
  );
};

// Noise texture overlay for premium cinematic feel (reduces gradient banding)
const NoiseOverlay = () => (
  <div 
    className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat',
    }}
  />
);

// --- Main Component ---

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
  const containerRef = useRef<HTMLDivElement>(null);
  const content = defaultContent[variant];
  const isLanding = variant === "landing";
  const isMinimal = variant === "minimal";
  const { isRTL } = useDirection();
  const { t } = useTranslation();
  
  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;
  const shouldAnimate = !prefersReducedMotion && parallax;

  // Framer Motion Scroll Hooks (GPU-native, no React re-renders)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Spring config for smooth, natural movement
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  
  // Transform values - calculated mathematically, not via state updates
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const mapY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const mapScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Smoothed values with spring physics
  const smoothBgY = useSpring(bgY, springConfig);
  const smoothMapY = useSpring(mapY, springConfig);
  const smoothMapScale = useSpring(mapScale, springConfig);

  return (
    <motion.div 
      ref={containerRef}
      className={cn(
        "relative overflow-hidden",
        fullscreen ? "min-h-screen" : isLanding ? "min-h-[90vh]" : isMinimal ? "min-h-[40vh]" : "min-h-[60vh]",
        "flex items-center",
        className
      )}
    >
      {/* ===== LAYER 0: Noise Texture (Premium Feel) ===== */}
      <NoiseOverlay />

      {/* ===== LAYER 1: Background Image with Strong Parallax ===== */}
      <motion.div 
        className="absolute inset-0 overflow-hidden"
        style={shouldAnimate ? { y: smoothBgY } : undefined}
      >
        <img
          src={nexusHeroImage}
          alt={t('home.hero.imageAlt')}
          className="w-full h-[130%] object-cover object-center"
        />
      </motion.div>
      
      {/* ===== LAYER 2: Animated Network Map with Medium Parallax ===== */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={shouldAnimate ? { y: smoothMapY, scale: smoothMapScale } : undefined}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <NexusAfricaMap animated={shouldAnimate} className="opacity-70" />
      </motion.div>

      {/* ===== LAYER 3: Gradient Overlays for Depth & Readability ===== */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Main gradient - night to transparent (RTL-aware) */}
        <div className={cn(
          "absolute inset-0",
          isRTL 
            ? "bg-gradient-to-l from-nx-night/80 via-nx-night/50 to-transparent" 
            : "bg-gradient-to-r from-nx-night/80 via-nx-night/50 to-transparent"
        )} />
        
        {/* Top/bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-nx-night/70 via-transparent to-nx-night/50" />
        
        {/* Subtle gold accent bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-nx-gold/10 via-transparent to-transparent" />
        
        {/* Radial overlay for text readability (RTL-aware positioning) */}
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at ${isRTL ? '80%' : '20%'} 50%, rgba(11,19,43,0.75) 0%, rgba(11,19,43,0.35) 50%, transparent 70%)`
          }}
        />
        
        {/* Golden light spot for warmth */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 70%, rgba(212,175,55,0.08) 0%, transparent 50%)'
          }}
        />
      </div>
      
      {/* ===== LAYER 4: African Patterns (RTL-aware) ===== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AfricanPattern className={cn("w-24 md:w-32 opacity-[0.04]", isRTL ? "right-0" : "left-0")} />
        <AfricanPattern 
          className={cn("w-24 md:w-32 opacity-[0.04]", isRTL ? "left-0" : "right-0")} 
          style={{ transform: 'scaleX(-1)' }} 
        />
      </div>

      {/* ===== LAYER 5: Content with Subtle Parallax ===== */}
      <motion.div 
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8"
        style={shouldAnimate ? { y: textY, opacity: textOpacity } : undefined}
      >
        <div className={cn(
          "max-w-3xl",
          isLanding ? "py-24" : "py-12",
          isRTL && "ltr:ml-0 rtl:mr-0 ltr:mr-auto rtl:ml-auto text-right"
        )}>
          {/* Badge - Premium glass style */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Badge 
              className={cn(
                "mb-8 px-5 py-2.5 bg-white/[0.08] backdrop-blur-lg border border-nx-gold/25 shadow-lg shadow-black/20 text-white/90 font-medium text-sm hover:bg-white/[0.12] transition-all duration-300",
                isRTL && "flex-row-reverse"
              )}
            >
              <Globe className={cn("h-4 w-4 text-nx-gold/80", isRTL ? "ml-2" : "mr-2")} />
              {t('home.hero.badge')}
            </Badge>
          </motion.div>

          {/* Title Group */}
          <div className="space-y-2">
            {/* Title - Line 1 */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className={cn(
                "font-bold text-white leading-[1.1] tracking-tight",
                isLanding ? "text-4xl md:text-5xl lg:text-6xl xl:text-7xl" : "text-3xl md:text-4xl"
              )}
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
            >
              {title || t('network.hero.title')}
            </motion.h1>
            
            {/* Title - Line 2 (with "Service Universel" gold accent + glow) */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className={cn(
                "font-bold text-white leading-[1.1] tracking-tight",
                isLanding ? "text-4xl md:text-5xl lg:text-6xl xl:text-7xl" : "text-3xl md:text-4xl"
              )}
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
            >
              {subtitle || (
                <>
                  {t('home.hero.subtitle.prefix')}{" "}
                  <span className="relative inline-block">
                    <span 
                      className="bg-gradient-to-r from-nx-gold via-amber-400 to-nx-gold bg-clip-text text-transparent"
                    >
                      {t('home.hero.subtitle.highlight')}
                    </span>
                    {/* Glow effect behind text */}
                    <span 
                      className="absolute inset-0 bg-gradient-to-r from-nx-gold via-amber-400 to-nx-gold bg-clip-text text-transparent blur-xl opacity-50 pointer-events-none"
                      aria-hidden="true"
                    >
                      {t('home.hero.subtitle.highlight')}
                    </span>
                  </span>
                  {" "}{t('home.hero.subtitle.suffix')}
                </>
              )}
            </motion.h1>
          </div>

          {/* Description */}
          {!isMinimal && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className={cn(
                "text-white/80 mt-8 max-w-2xl leading-relaxed",
                isLanding ? "text-lg md:text-xl" : "text-base md:text-lg"
              )}
            >
              {description || t('home.hero.description')}
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
              <div className={cn("flex flex-col sm:flex-row gap-4", isRTL && "sm:flex-row-reverse")}>
                <Button 
                  asChild 
                  size="lg" 
                  className="group bg-gradient-to-r from-white via-white to-white/95 text-nx-night hover:from-white/95 hover:to-white shadow-xl shadow-black/25 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300 font-semibold px-8 py-6"
                >
                  <Link to="/network">
                    {t('home.hero.cta.explore')}
                    <ArrowRight className={cn(
                      "h-5 w-5 transition-transform",
                      isRTL 
                        ? "mr-2 rotate-180 group-hover:-translate-x-1" 
                        : "ml-2 group-hover:translate-x-1"
                    )} />
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="border border-white/40 bg-white/[0.08] backdrop-blur-md text-white hover:bg-white/15 hover:border-white/60 transition-all duration-300 font-medium px-8 py-6"
                >
                  <Link to="/auth">
                    {t('home.hero.cta.member')}
                  </Link>
                </Button>
              </div>
              
              {/* Micro-text under CTAs */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className={cn(
                  "text-white/50 text-xs mt-4",
                  isRTL ? "text-right" : "text-center sm:text-left"
                )}
              >
                {t('home.hero.microtext')}
              </motion.p>
            </motion.div>
          )}

          {/* Custom children */}
          {children}
        </div>
      </motion.div>
      
      {/* ===== Scroll Indicator ===== */}
      {(fullscreen || isLanding) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/60"
        >
          <span className="text-xs font-medium mb-2 tracking-wide uppercase">{t('home.hero.scroll')}</span>
          <motion.div
            animate={shouldAnimate ? { y: [0, 8, 0] } : undefined}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
