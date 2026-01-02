import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Globe } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { RegionCards } from "@/components/network/RegionCards";
import { ActivityTimeline } from "@/components/network/ActivityTimeline";
import { NexusHero } from "@/components/shared/NexusHero";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 relative overflow-hidden">
      {/* Hero Section - NEXUS Africa Network */}
      <NexusHero variant="landing" showStats fullscreen parallax />

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
