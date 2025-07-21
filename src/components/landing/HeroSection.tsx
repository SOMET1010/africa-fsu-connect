
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Globe, Users, Target } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary via-blue-600 to-blue-800 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="m20 20 20 20-20-20Z"/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge d'introduction */}
          <Badge variant="secondary" className="mb-6 px-4 py-2 bg-white/20 text-white border-white/30 hover:bg-white/30">
            <Globe className="w-4 h-4 mr-2" />
            Plateforme Collaborative Africaine
          </Badge>
          
          {/* Titre principal */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="block">Fonds du Service</span>
            <span className="block text-yellow-300">Universel Afrique</span>
          </h1>
          
          {/* Sous-titre */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Unissons nos forces pour une connectivité universelle et inclusive à travers le continent africain
          </p>
          
          {/* Statistiques rapides */}
          <div className="flex flex-wrap justify-center gap-8 mb-10 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[120px]">
              <div className="text-2xl lg:text-3xl font-bold text-yellow-300">54</div>
              <div className="text-sm text-white/80">Pays</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[120px]">
              <div className="text-2xl lg:text-3xl font-bold text-yellow-300">1,247</div>
              <div className="text-sm text-white/80">Projets</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[120px]">
              <div className="text-2xl lg:text-3xl font-bold text-yellow-300">186</div>
              <div className="text-sm text-white/80">Organisations</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[120px]">
              <div className="text-2xl lg:text-3xl font-bold text-yellow-300">45M+</div>
              <div className="text-sm text-white/80">Bénéficiaires</div>
            </div>
          </div>
          
          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 shadow-lg px-8 py-3 text-lg font-semibold"
              asChild
            >
              <Link to="/auth" className="flex items-center">
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 hover:border-white px-8 py-3 text-lg backdrop-blur-sm"
              asChild
            >
              <Link to="/organizations">Explorer les projets</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
