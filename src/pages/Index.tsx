import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Users, FolderGit2, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useDirection } from "@/hooks/useDirection";
import { cn } from "@/lib/utils";
import nexusHeroImage from "@/assets/nexus-hero-africa.png";

const Index = () => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  const features = [
    {
      icon: Users,
      titleKey: "home.features.network.title",
      descKey: "home.features.network.desc",
      fallbackTitle: "54 Pays Membres",
      fallbackDesc: "Réseau panafricain des agences de régulation"
    },
    {
      icon: FolderGit2,
      titleKey: "home.features.projects.title",
      descKey: "home.features.projects.desc",
      fallbackTitle: "Projets FSU",
      fallbackDesc: "Partage d'expériences et bonnes pratiques"
    },
    {
      icon: FileText,
      titleKey: "home.features.resources.title",
      descKey: "home.features.resources.desc",
      fallbackTitle: "Ressources",
      fallbackDesc: "Documentation et guides méthodologiques"
    }
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--nx-night))] relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={nexusHeroImage}
          alt="Africa Network"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--nx-night))]/60 via-[hsl(var(--nx-night))]/80 to-[hsl(var(--nx-night))]" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
            <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--nx-gold))] to-[hsl(var(--nx-gold))]/70 flex items-center justify-center">
                <Globe className="w-5 h-5 text-[hsl(var(--nx-night))]" />
              </div>
              <span className="text-xl font-bold text-white">NEXUS</span>
            </div>
            <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
              <Button asChild variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                <Link to="/about">{t('common.about') || 'À propos'}</Link>
              </Button>
              <Button asChild className="bg-white/10 text-white hover:bg-white/20 border border-white/20">
                <Link to="/auth">{t('common.login') || 'Connexion'}</Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center">
          <div className="container mx-auto px-4 py-12">
            <div className={cn("max-w-3xl", isRTL && "mr-0 ml-auto text-right")}>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge className={cn(
                  "mb-6 px-4 py-2 bg-white/10 backdrop-blur border border-[hsl(var(--nx-gold))]/30 text-white/90",
                  isRTL && "flex-row-reverse"
                )}>
                  <Globe className={cn("h-4 w-4 text-[hsl(var(--nx-gold))]", isRTL ? "ml-2" : "mr-2")} />
                  {t('home.hero.badge') || 'Réseau SUTEL — Service Universel Africain'}
                </Badge>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
              >
                {t('network.hero.title') || 'Plateforme de coopération'}
                <br />
                <span className="bg-gradient-to-r from-[hsl(var(--nx-gold))] to-amber-400 bg-clip-text text-transparent">
                  {t('home.hero.subtitle.highlight') || 'Service Universel'}
                </span>
                {' '}{t('home.hero.subtitle.suffix') || 'Africain'}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl"
              >
                {t('home.hero.description') || 'Une plateforme de coopération, de projets et de partage au service de l\'inclusion numérique africaine.'}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={cn("flex flex-col sm:flex-row gap-4", isRTL && "sm:flex-row-reverse")}
              >
                <Button 
                  asChild 
                  size="lg"
                  className="bg-gradient-to-r from-[hsl(var(--nx-gold))] to-amber-500 text-[hsl(var(--nx-night))] hover:opacity-90 font-semibold px-8"
                >
                  <Link to="/network" className={cn("flex items-center", isRTL && "flex-row-reverse")}>
                    {t('home.hero.cta.explore') || 'Découvrir le réseau'}
                    <ArrowRight className={cn("h-5 w-5", isRTL ? "mr-2 rotate-180" : "ml-2")} />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  size="lg" 
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8"
                >
                  <Link to="/auth">
                    {t('home.hero.cta.member') || 'Espace membre'}
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </main>

        {/* Features Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="container mx-auto px-4 pb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={cn(
                  "p-5 rounded-xl bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition-colors",
                  isRTL && "text-right"
                )}
              >
                <div className={cn("flex items-start gap-4", isRTL && "flex-row-reverse")}>
                  <div className="p-2.5 rounded-lg bg-[hsl(var(--nx-gold))]/10 border border-[hsl(var(--nx-gold))]/20">
                    <feature.icon className="w-5 h-5 text-[hsl(var(--nx-gold))]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      {t(feature.titleKey) || feature.fallbackTitle}
                    </h3>
                    <p className="text-sm text-white/60">
                      {t(feature.descKey) || feature.fallbackDesc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-6 border-t border-white/10">
          <div className={cn("flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50", isRTL && "md:flex-row-reverse")}>
            <p>© 2026 NEXUS — Réseau SUTEL</p>
            <div className={cn("flex items-center gap-6", isRTL && "flex-row-reverse")}>
              <Link to="/about" className="hover:text-white transition-colors">
                {t('common.about') || 'À propos'}
              </Link>
              <Link to="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
