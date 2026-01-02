import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { NexusActivityFeed } from "@/components/network/NexusActivityFeed";
import { NexusRegions } from "@/components/network/NexusRegions";
import { NexusHero } from "@/components/shared/NexusHero";
import { useTranslation } from "@/hooks/useTranslation";
import { useDirection } from "@/hooks/useDirection";
import { cn } from "@/lib/utils";

const Index = () => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  return (
    <div className="min-h-screen bg-[hsl(var(--nx-bg))] relative overflow-hidden">
      {/* Hero Section - NEXUS Africa Network (Infrastructure Vivante) */}
      <NexusHero variant="landing" fullscreen parallax />

      {/* Recent Activity Section - Nexus Stream (Dark Mode Continuity) */}
      <NexusActivityFeed />

      {/* Regions Section - Holographic Grid */}
      <section className="bg-[hsl(var(--nx-night))] relative z-10">
        <NexusRegions />
      </section>

      {/* CTA Section - Style NEXUS avec gradient or */}
      <section className="py-20 bg-gradient-to-r from-[hsl(var(--nx-deep))] via-[hsl(var(--nx-night))] to-[hsl(var(--nx-deep))] relative z-10 overflow-hidden">
        {/* Accent doré en arrière-plan */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--nx-gold))]/5 via-transparent to-[hsl(var(--nx-gold))]/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[hsl(var(--nx-gold))]/10 rounded-full blur-3xl" />
        
        <PageContainer className="relative z-10">
          <div className={cn("text-center", isRTL && "rtl")}>
            <div className={cn("inline-flex items-center gap-2 mb-6", isRTL && "flex-row-reverse")}>
              <Sparkles className="h-5 w-5 text-[hsl(var(--nx-gold))]" />
              <span className="text-[hsl(var(--nx-gold))] font-medium">{t('home.cta.kicker')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              {t('home.cta.title')}
            </h2>
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              {t('home.cta.subtitle')}
            </p>
            <div className={cn("flex flex-col sm:flex-row gap-4 justify-center", isRTL && "sm:flex-row-reverse")}>
              <Button asChild size="lg" className="bg-gradient-to-r from-[hsl(var(--nx-gold))] to-[hsl(var(--nx-gold))]/80 text-[hsl(var(--nx-night))] hover:from-[hsl(var(--nx-gold))]/90 hover:to-[hsl(var(--nx-gold))]/70 hover:scale-105 px-8 py-3 transition-all duration-300 shadow-lg shadow-[hsl(var(--nx-gold))]/20 hover:shadow-xl hover:shadow-[hsl(var(--nx-gold))]/30 font-semibold">
                <Link to="/auth" className={cn("flex items-center", isRTL && "flex-row-reverse")}>
                  <span>{t('common.create.account')}</span>
                  <ArrowRight className={cn("h-5 w-5", isRTL ? "mr-2 rotate-180" : "ml-2")} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:border-white/30 hover:scale-105 px-8 py-3 transition-all duration-300">
                <Link to="/about">{t('common.learn.more')}</Link>
              </Button>
            </div>
          </div>
        </PageContainer>
      </section>
    </div>
  );
};

export default Index;
