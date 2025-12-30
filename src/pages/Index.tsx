import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Globe, Sparkles, ChevronDown } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { PageContainer } from "@/components/layout/PageContainer";
import { RegionCards } from "@/components/network/RegionCards";
import { ActivityTimeline } from "@/components/network/ActivityTimeline";
import { PresenceIndicator } from "@/components/network/PresenceIndicator";

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      
      {/* Hero Section - Ultra-light, no KPIs */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-40 right-20 w-24 h-24 bg-accent/5 rounded-full blur-lg animate-bounce-subtle" />
        </div>

        <PageContainer size="full" className="relative z-10">
          <div className="text-center space-y-8 animate-fade-in">
            {/* Premium badge */}
            <div className="flex justify-center">
              <Badge 
                className="px-6 py-3 bg-card/80 backdrop-blur-md border-primary/30 text-primary font-medium text-sm shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                Réseau SUTEL
              </Badge>
            </div>

            {/* Main heading - Narrative, no stats */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
                <span className="gradient-text animate-shimmer bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto]">
                  54 pays construisent ensemble
                </span>
                <br />
                <span className="text-foreground/90 font-light">
                  l'avenir du Service Universel en Afrique
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                Une communauté panafricaine de partage et de coopération
              </p>
            </div>

            {/* Network Presence - Visual bar, no numbers */}
            <div className="flex justify-center py-4">
              <PresenceIndicator level={7} maxLevel={10} />
            </div>

            {/* 2 CTAs maximum - Blueprint requirement */}
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
                  Explorer les projets inspirants
                </Link>
              </Button>
            </div>

            {/* Scroll indicator */}
            <div className="pt-12 animate-fade-in">
              <div className="flex flex-col items-center text-muted-foreground animate-bounce-subtle">
                <span className="text-xs font-medium mb-2">Découvrir</span>
                <ChevronDown className="h-5 w-5" />
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Recent Activity Section - Proof of life, no punitive alerts */}
      <section className="py-16 relative z-10">
        <PageContainer>
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <Globe className="w-4 h-4 mr-2" />
              Activité récente
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ce qui se passe dans le réseau
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Les dernières contributions et échanges entre pays membres
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <ActivityTimeline maxItems={4} />
          </div>
        </PageContainer>
      </section>

      {/* Regions Section - Egalitarian cards, no project counts */}
      <section className="py-16 bg-gradient-to-r from-muted/20 via-muted/10 to-muted/20 backdrop-blur-sm relative z-10">
        <PageContainer>
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <Globe className="w-4 h-4 mr-2" />
              Régions du réseau
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Un réseau panafricain
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Explorez les pays membres par région
            </p>
          </div>
          
          <RegionCards />
          
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:text-white transition-all duration-300">
              <Link to="/members" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Voir tous les pays membres</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </PageContainer>
      </section>

      {/* CTA Section - Simplified */}
      <section className="py-16 bg-gradient-to-r from-primary via-primary-dark to-primary text-white relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
        <PageContainer className="relative z-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Rejoignez le réseau SUTEL
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Participez à la construction collective du Service Universel en Afrique
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 hover:scale-105 px-8 py-3 transition-all duration-300 shadow-lg hover:shadow-xl">
                <Link to="/auth" className="flex items-center">
                  <span>Créer un compte</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:scale-105 px-8 py-3 transition-all duration-300 backdrop-blur-sm">
                <Link to="/about">En savoir plus</Link>
              </Button>
            </div>
          </div>
        </PageContainer>
      </section>
    </div>
  );
};

export default Index;
