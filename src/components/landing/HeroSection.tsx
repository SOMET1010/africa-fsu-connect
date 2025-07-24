
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Globe, Users, Target, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { useTranslation } from "@/hooks/useTranslation";

export default function HeroSection() {
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Professional gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      {/* Subtle pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <PageContainer size="full" className="relative z-10">
        <div className="text-center space-y-8 animate-fade-in-up">
          {/* Professional badge */}
          <div className="flex justify-center">
            <Badge 
              variant="outline" 
              className="px-4 py-2 bg-background/80 backdrop-blur-sm border-primary/20 text-primary font-medium"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {t('hero.badge')}
            </Badge>
          </div>

          {/* Main heading with gradient text */}
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
              <span className="gradient-text">{t('hero.title.line1')}</span>
              <br />
              <span className="text-foreground">{t('hero.title.line2')}</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Professional stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto py-8">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">15+</div>
              <div className="text-sm text-muted-foreground">{t('hero.stats.countries')}</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div className="text-2xl font-bold text-foreground">500+</div>
              <div className="text-sm text-muted-foreground">{t('hero.stats.organizations')}</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mx-auto">
                <Target className="h-6 w-6 text-warning" />
              </div>
              <div className="text-2xl font-bold text-foreground">100+</div>
              <div className="text-sm text-muted-foreground">{t('common.projects')}</div>
            </div>
          </div>

          {/* Professional CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              asChild 
              size="lg" 
              className="px-8 py-4 text-base font-medium shadow-elegant hover:shadow-xl transition-all duration-200"
            >
              <Link to="/auth">
                {t('common.get.started')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="px-8 py-4 text-base font-medium bg-background/80 backdrop-blur-sm border-border hover:bg-muted/50"
            >
              <Link to="/organizations">
                {t('common.discover')}
              </Link>
            </Button>
          </div>

          {/* Professional trust indicators */}
          <div className="pt-12 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-6">
              Soutenu par les principales institutions africaines
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
              {["Union Africaine", "CEDEAO", "SADC", "EAC"].map((org) => (
                <div key={org} className="text-center">
                  <div className="w-16 h-16 bg-muted/30 rounded-lg mx-auto mb-2" />
                  <div className="text-xs text-muted-foreground font-medium">{org}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
