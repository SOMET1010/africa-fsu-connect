// NEXUS_LAYER1_GUARD
// - max 2 CTA visibles
// - pas de KPI cards
// - pas d'alertes rouges
// - pas de ranking
// - 1 message principal par écran
// - animations lentes uniquement (fade/slide)
// - couleurs : nx-brand + nx-coop uniquement
// - organisations visuellement égalitaires (même couleur)

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { useTranslation } from "@/hooks/useTranslation";
import { PresenceIndicator } from "@/components/network/PresenceIndicator";

/**
 * PremiumHeroSection - NEXUS Design System Compliant
 * 
 * UX RULES (Blueprint):
 * - NO KPIs or hard numbers
 * - NO rankings
 * - Max 2 CTAs above the fold
 * - Narrative text only (1 sentence per block)
 * - Network presence as visual bar (no numbers)
 * - Organizations visually equal (same color)
 */

const organizations = [
  { name: "CEDEAO" },
  { name: "SADC" },
  { name: "EACO" },
  { name: "ECCAS" },
  { name: "UMA" }
];

export default function PremiumHeroSection() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center bg-[hsl(var(--nx-bg))]">
      <PageContainer size="full" className="relative z-10">
        <div className="text-center space-y-8 nx-animate-fade-in">
          {/* NEXUS Badge - calm, no aggressive animations */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nx-surface))] border border-[hsl(var(--nx-border))] shadow-[var(--nx-shadow-sm)] transition-colors duration-[var(--nx-dur-2)]">
              <Sparkles className="h-4 w-4 text-[hsl(var(--nx-brand-900))]" />
              <span className="text-sm font-medium text-[hsl(var(--nx-brand-900))]">
                {t('hero.badge')}
              </span>
            </div>
          </div>

          {/* Main heading - reduced typography (max 32px) */}
          <div className="space-y-4">
            <h1 className="text-[28px] md:text-[32px] font-semibold leading-tight max-w-3xl mx-auto">
              <span className="nx-gradient-text">
                {t('hero.title.line1')}
              </span>
              <br />
              <span className="text-[hsl(var(--nx-text-700))] font-normal">
                {t('hero.title.line2')}
              </span>
            </h1>
            <p className="text-base md:text-lg text-[hsl(var(--nx-text-500))] max-w-2xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Network Presence - Visual indicator, NO numbers */}
          <div className="flex justify-center py-4">
            <div className="text-center space-y-3">
              <PresenceIndicator level={7} maxLevel={10} size="lg" />
              <p className="text-sm text-[hsl(var(--nx-text-500))] font-medium">
                Forte activité ce mois
              </p>
            </div>
          </div>

          {/* NEXUS CTA buttons - Max 2 per Blueprint */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              asChild 
              size="lg" 
              className="bg-[hsl(var(--nx-brand-900))] hover:bg-[hsl(var(--nx-brand-700))] text-white px-8 py-3 text-base font-medium rounded-[var(--nx-radius-md)] shadow-[var(--nx-shadow-sm)] hover:shadow-[var(--nx-shadow-md)] transition-all duration-[var(--nx-dur-2)] ease-[var(--nx-ease)]"
            >
              <Link to="/network">
                Découvrir le réseau
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="border-[hsl(var(--nx-border))] text-[hsl(var(--nx-text-700))] hover:bg-[hsl(var(--nx-surface))] hover:border-[hsl(var(--nx-brand-500))] px-8 py-3 text-base font-medium rounded-[var(--nx-radius-md)] transition-all duration-[var(--nx-dur-2)] ease-[var(--nx-ease)]"
            >
              <Link to="/projects">
                Explorer les projets
              </Link>
            </Button>
          </div>

          {/* Trust indicators - Equal visual weight (same color for all) */}
          <div className="pt-8 border-t border-[hsl(var(--nx-border))] mt-8">
            <p className="text-sm text-[hsl(var(--nx-text-500))] mb-8 font-medium">
              {t('hero.trust.supported')}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {organizations.map((org, index) => (
                <div 
                  key={org.name} 
                  className="text-center group nx-animate-fade-in"
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  <div className="w-14 h-14 bg-[hsl(var(--nx-brand-900)/0.1)] rounded-[var(--nx-radius-lg)] mx-auto mb-3 flex items-center justify-center transition-all duration-[var(--nx-dur-2)] hover:-translate-y-0.5">
                    <span className="font-semibold text-[hsl(var(--nx-brand-900))] text-sm">
                      {org.name[0]}
                    </span>
                  </div>
                  <div className="text-xs text-[hsl(var(--nx-text-500))] font-medium group-hover:text-[hsl(var(--nx-text-700))] transition-colors duration-[var(--nx-dur-2)]">
                    {org.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator - slow fade only */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 nx-animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex flex-col items-center text-[hsl(var(--nx-text-500))]">
              <span className="text-xs font-medium mb-2">{t('hero.scroll.discover')}</span>
              <ChevronDown className="h-5 w-5" />
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
