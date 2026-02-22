import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeIllustration } from "@/components/shared/ThemeIllustration";
import { AfricaMapMini } from "./AfricaMapMini";

interface PracticesHeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PracticesHero({ searchQuery, onSearchChange }: PracticesHeroProps) {
  return (
    <div className="py-10 md:py-16 relative">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        {/* Left: Text content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            <Sparkles className="h-4 w-4" />
            <span>Bibliothèque des pratiques</span>
          </motion.div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Bonnes Pratiques{" "}
            <span 
              className="inline-block"
              style={{ 
                background: "linear-gradient(135deg, hsl(230 55% 45%), hsl(18 76% 55%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              du Réseau
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-lg text-muted-foreground max-w-xl mb-8">
            Ce sont des projets réels, portés par des pays africains, 
            qui ont déjà fait leurs preuves sur le terrain.
          </p>

          {/* Search + CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une pratique..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <Button className="group h-11">
              <Share2 className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
              Partager une pratique
            </Button>
          </div>

          {/* Mini stats under search */}
          <div className="flex gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">100+ pratiques</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">23 pays</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-muted-foreground">5 thèmes</span>
            </div>
          </div>
        </motion.div>

        {/* Right: Visual elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          {/* Decorative theme illustrations floating around - reduced opacity */}
          <div className="absolute -top-4 -left-4 opacity-15">
            <ThemeIllustration theme="Connectivité" size="md" />
          </div>
          <div className="absolute top-10 -right-4 opacity-15">
            <ThemeIllustration theme="E-Santé" size="sm" />
          </div>
          <div className="absolute -bottom-4 left-10 opacity-15">
            <ThemeIllustration theme="Éducation" size="sm" />
          </div>

          {/* Mini Africa Map */}
          <AfricaMapMini className="shadow-lg" />
        </motion.div>
      </div>
    </div>
  );
}
