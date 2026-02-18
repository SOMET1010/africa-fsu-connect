import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useDirection } from "@/hooks/useDirection";
import { cn } from "@/lib/utils";
import nexusHeroImage from "@/assets/nexus-hero-africa.png";
import { HomeHeroBlock } from "@/components/home/HomeHeroBlock";
import { HomeFeaturesBlock } from "@/components/home/HomeFeaturesBlock";
import { HomeCtaBlock } from "@/components/home/HomeCtaBlock";
import { HomePartnersBlock } from "@/components/home/HomePartnersBlock";

const Index = () => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  return (
    <div className="min-h-screen bg-[hsl(var(--nx-night))] relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={nexusHeroImage} alt="Africa Network" className="w-full h-full object-cover opacity-30" />
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

        {/* Dynamic Content Blocks */}
        <HomeHeroBlock />
        <HomeFeaturesBlock />
        <HomeCtaBlock />
        <HomePartnersBlock />

        {/* Footer */}
        <footer className="container mx-auto px-4 py-6 border-t border-white/10 mt-auto">
          <div className={cn("flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50", isRTL && "md:flex-row-reverse")}>
            <p>© 2026 NEXUS — Réseau SUTEL</p>
            <div className={cn("flex items-center gap-6", isRTL && "flex-row-reverse")}>
              <Link to="/about" className="hover:text-white transition-colors">{t('common.about') || 'À propos'}</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
