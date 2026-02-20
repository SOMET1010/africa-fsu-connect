import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useDirection } from "@/hooks/useDirection";
import { cn } from "@/lib/utils";
import { useHomepageContent } from "@/hooks/useHomepageContent";
import { Skeleton } from "@/components/ui/skeleton";

export function HomeHeroBlock() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const { getBlock, isLoading } = useHomepageContent();

  const hero = getBlock('hero');

  const badge = (hero?.badge as string) ?? t('home.hero.badge') ?? 'USF Digital Connect Africa';
  const title = (hero?.title as string) ?? t('home.hero.title') ?? 'Connecter l\'écosystème';
  const highlight = (hero?.subtitle_highlight as string) ?? t('home.hero.subtitle.highlight') ?? 'numérique de l\'Afrique';
  const suffix = (hero?.subtitle_suffix as string) ?? t('home.hero.subtitle.suffix') ?? '';
  const description = (hero?.description as string) ?? t('home.hero.description') ?? "Plateforme panafricaine pour la coordination, l'innovation et la mutualisation des ressources du Service Universel des Télécommunications.";
  const ctaExplore = (hero?.cta_explore as string) || t('home.hero.cta.explore') || 'Explorer le réseau';
  const ctaSignup = (hero?.cta_signup as string) || t('home.hero.cta.signup') || "S'inscrire";
  const ctaLogin = (hero?.cta_login as string) || t('home.hero.cta.login') || 'Se connecter';

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl space-y-6">
          <Skeleton className="h-8 w-64 bg-white/10" />
          <Skeleton className="h-16 w-full bg-white/10" />
          <Skeleton className="h-6 w-3/4 bg-white/10" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-40 bg-white/10" />
            <Skeleton className="h-12 w-32 bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 flex items-center">
      <div className="container mx-auto px-4 py-12">
        <div className={cn("max-w-3xl", isRTL && "mr-0 ml-auto text-right")}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className={cn("mb-6 px-4 py-2 bg-white/10 backdrop-blur border border-[hsl(var(--nx-gold))]/30 text-white/90", isRTL && "flex-row-reverse")}>
              <Globe className={cn("h-4 w-4 text-[hsl(var(--nx-gold))]", isRTL ? "ml-2" : "mr-2")} />
              {badge}
            </Badge>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {title}
            <br />
            <span className="bg-gradient-to-r from-[hsl(var(--nx-gold))] to-amber-400 bg-clip-text text-transparent">{highlight}</span>
            {' '}{suffix}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl">
            {description}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className={cn("flex flex-col sm:flex-row gap-4", isRTL && "sm:flex-row-reverse")}>
            <Button asChild size="lg" className="bg-gradient-to-r from-[hsl(var(--nx-gold))] to-amber-500 text-[hsl(var(--nx-night))] hover:opacity-90 font-semibold px-8">
              <Link to="/auth?mode=signup" className={cn("flex items-center", isRTL && "flex-row-reverse")}>
                {ctaSignup}
                <ArrowRight className={cn("h-5 w-5", isRTL ? "mr-2 rotate-180" : "ml-2")} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/50 text-white bg-white/10 hover:bg-white/20 px-8">
              <Link to="/network" className={cn("flex items-center", isRTL && "flex-row-reverse")}>
                {ctaExplore}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
              <Link to="/auth">{ctaLogin}</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
