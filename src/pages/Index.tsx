import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Globe, Sparkles } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { RegionCards } from "@/components/network/RegionCards";
import { ActivityTimeline } from "@/components/network/ActivityTimeline";
import { NexusHero } from "@/components/shared/NexusHero";
import { NexusNetworkPattern } from "@/components/shared/NexusNetworkPattern";

const Index = () => {
  return (
    <div className="min-h-screen bg-[hsl(var(--nx-bg))] relative overflow-hidden">
      {/* Hero Section - NEXUS Africa Network (Infrastructure Vivante) */}
      <NexusHero variant="landing" fullscreen parallax />

      {/* Recent Activity Section - Style NEXUS */}
      <section className="py-20 relative z-10 bg-[hsl(var(--nx-section-cool))]">
        <PageContainer>
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-2 bg-[hsl(var(--nx-night))]/10 text-[hsl(var(--nx-brand-900))] border-[hsl(var(--nx-brand-500))]/20">
              <Globe className="w-4 h-4 mr-2" />
              Activité récente
            </Badge>
            <h2 className="text-3xl font-bold text-[hsl(var(--nx-text-900))] mb-4">
              Ce qui se passe dans le réseau
            </h2>
            <p className="text-[hsl(var(--nx-text-500))] max-w-2xl mx-auto">
              Les dernières contributions et échanges entre pays membres
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <ActivityTimeline maxItems={4} />
          </div>
        </PageContainer>
      </section>

      {/* Regions Section - Style NEXUS avec pattern */}
      <section className="py-20 bg-[hsl(var(--nx-night))] relative z-10 overflow-hidden">
        {/* Pattern réseau */}
        <NexusNetworkPattern variant="soft" className="opacity-[0.08]" />
        
        <PageContainer className="relative z-10">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-2 bg-[hsl(var(--nx-gold))]/20 text-[hsl(var(--nx-gold))] border-[hsl(var(--nx-gold))]/30">
              <Globe className="w-4 h-4 mr-2" />
              Régions du réseau
            </Badge>
            <h2 className="text-3xl font-bold text-white mb-4">
              Un réseau panafricain
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto mb-8">
              Explorez les pays membres par région
            </p>
          </div>
          
          <RegionCards />
          
          <div className="text-center mt-10">
            <Button asChild variant="outline" className="border-[hsl(var(--nx-gold))]/30 text-[hsl(var(--nx-gold))] hover:bg-[hsl(var(--nx-gold))]/10 hover:border-[hsl(var(--nx-gold))]/50 transition-all duration-300">
              <Link to="/members" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Voir tous les pays membres</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </PageContainer>
      </section>

      {/* CTA Section - Style NEXUS avec gradient or */}
      <section className="py-20 bg-gradient-to-r from-[hsl(var(--nx-deep))] via-[hsl(var(--nx-night))] to-[hsl(var(--nx-deep))] relative z-10 overflow-hidden">
        {/* Accent doré en arrière-plan */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--nx-gold))]/5 via-transparent to-[hsl(var(--nx-gold))]/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[hsl(var(--nx-gold))]/10 rounded-full blur-3xl" />
        
        <PageContainer className="relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-[hsl(var(--nx-gold))]" />
              <span className="text-[hsl(var(--nx-gold))] font-medium">Rejoignez-nous</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Rejoignez le réseau SUTEL
            </h2>
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Participez à la construction collective du Service Universel en Afrique
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-[hsl(var(--nx-gold))] to-[hsl(var(--nx-gold))]/80 text-[hsl(var(--nx-night))] hover:from-[hsl(var(--nx-gold))]/90 hover:to-[hsl(var(--nx-gold))]/70 hover:scale-105 px-8 py-3 transition-all duration-300 shadow-lg shadow-[hsl(var(--nx-gold))]/20 hover:shadow-xl hover:shadow-[hsl(var(--nx-gold))]/30 font-semibold">
                <Link to="/auth" className="flex items-center">
                  <span>Créer un compte</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:border-white/30 hover:scale-105 px-8 py-3 transition-all duration-300">
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
