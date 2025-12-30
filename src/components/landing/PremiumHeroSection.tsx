import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Globe, Sparkles, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { useTranslation } from "@/hooks/useTranslation";
import { PresenceIndicator } from "@/components/network/PresenceIndicator";

/**
 * PremiumHeroSection - Couche 1 compliant
 * 
 * UX RULES (Blueprint):
 * - NO KPIs or hard numbers
 * - NO rankings
 * - Max 2 CTAs above the fold
 * - Narrative text only (1 sentence per block)
 * - Network presence as visual bar (no numbers)
 */
export default function PremiumHeroSection() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Premium animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-accent/5 rounded-full blur-lg animate-bounce-subtle" />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-primary/3 rounded-full blur-2xl animate-pulse" />
      </div>

      <PageContainer size="full" className="relative z-10">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Premium badge */}
          <div className="flex justify-center">
            <Badge 
              className="px-6 py-3 bg-card/80 backdrop-blur-md border-primary/30 text-primary font-medium text-sm shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
              {t('hero.badge')}
            </Badge>
          </div>

          {/* Main heading with narrative focus - NO STATS */}
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
              <span className="gradient-text animate-shimmer bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto]">
                {t('hero.title.line1')}
              </span>
              <br />
              <span className="text-foreground/90 font-light">
                {t('hero.title.line2')}
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Network Presence - Visual indicator, NO numbers */}
          <div className="flex justify-center py-6">
            <div className="text-center space-y-3">
              <PresenceIndicator level={7} maxLevel={10} size="lg" />
              <p className="text-sm text-muted-foreground font-medium">
                Forte activité ce mois
              </p>
            </div>
          </div>

          {/* Premium CTA buttons - Max 2 per Blueprint */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              asChild 
              size="lg" 
              className="px-10 py-6 text-lg font-medium rounded-2xl shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary-dark"
            >
              <Link to="/network">
                Découvrir le réseau
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="px-10 py-6 text-lg font-medium rounded-2xl bg-card/60 backdrop-blur-md border-border/50 hover:bg-card/80 hover:shadow-md transition-all duration-300 hover:scale-105"
            >
              <Link to="/projects">
                Explorer les projets
              </Link>
            </Button>
          </div>

          {/* Trust indicators - Regions égalitaires, NO project counts */}
          <div className="pt-8 border-t border-border/30 mt-8">
            <p className="text-sm text-muted-foreground mb-8 font-medium">
              {t('hero.trust.supported')}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 opacity-70 hover:opacity-100 transition-opacity duration-500">
              {[
                { name: "CEDEAO", color: "bg-blue-500/20" },
                { name: "SADC", color: "bg-green-500/20" },
                { name: "EACO", color: "bg-purple-500/20" },
                { name: "ECCAS", color: "bg-orange-500/20" },
                { name: "UMA", color: "bg-red-500/20" }
              ].map((org, index) => (
                <div 
                  key={org.name} 
                  className="text-center group animate-fade-in"
                  style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                >
                  <div className={`w-16 h-16 ${org.color} rounded-2xl mx-auto mb-3 group-hover:scale-110 transition-all duration-300 flex items-center justify-center`}>
                    <span className="font-bold text-foreground text-sm">{org.name[0]}</span>
                  </div>
                  <div className="text-xs text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                    {org.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-fade-in">
            <div className="flex flex-col items-center text-muted-foreground animate-bounce-subtle">
              <span className="text-xs font-medium mb-2">{t('hero.scroll.discover')}</span>
              <ChevronDown className="h-5 w-5" />
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
