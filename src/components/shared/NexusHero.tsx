import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Globe, Users, Sparkles, Network } from "lucide-react";
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
  className,
  children,
}: NexusHeroProps) {
  const content = defaultContent[variant];
  const isLanding = variant === "landing";
  const isMinimal = variant === "minimal";

  return (
    <div className={cn(
      "relative overflow-hidden",
      isLanding ? "min-h-[85vh]" : isMinimal ? "min-h-[40vh]" : "min-h-[60vh]",
      "flex items-center",
      className
    )}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={nexusHeroImage}
          alt="Carte de l'Afrique connectée"
          className="w-full h-full object-cover object-center"
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge 
              className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-md border-white/20 text-white font-medium"
            >
              <Network className="h-4 w-4 mr-2" />
              Plateforme panafricaine
            </Badge>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className={cn(
              "font-bold text-white leading-tight",
              isLanding ? "text-4xl md:text-5xl lg:text-6xl" : "text-3xl md:text-4xl"
            )}>
              {title || content.title}
              <br />
              <span className="text-nx-gold">{subtitle || content.titleAccent}</span>
            </h1>
          </motion.div>

          {/* Description */}
          {(description || content.description) && !isMinimal && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mt-8"
            >
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-nx-night hover:bg-white/90 shadow-lg"
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
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
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
    </div>
  );
}
