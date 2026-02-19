import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe, ArrowRight } from "lucide-react";
import { useAfricanCountries } from "@/hooks/useCountries";
import { CommandCenterMap } from "@/components/map/CommandCenterMap";
import { Country } from "@/services/countriesService";
import { cn } from "@/lib/utils";
import { useDirection } from "@/hooks/useDirection";

export function HomeMemberMapBlock() {
  const { data: countries = [], isLoading } = useAfricanCountries();
  const { isRTL } = useDirection();

  const handleCountryClick = (_country: Country) => {
    // Optional: could navigate to /map?country=XX
  };

  return (
    <section className="py-16 animate-fade-in" style={{ contentVisibility: 'auto' }}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className={cn("text-center mb-10", isRTL && "text-right")}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm mb-4">
            <Globe className="h-4 w-4 text-[hsl(var(--nx-gold))]" />
            Réseau continental
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Participation des Membres
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Visualisez l'engagement des pays africains dans le réseau ADCA — contributions, projets et collaborations en temps réel.
          </p>
        </div>

        {/* Map Container */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[hsl(var(--nx-night))]" style={{ height: 'clamp(350px, 50vw, 500px)' }}>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-10 h-10 border-3 border-[hsl(var(--nx-gold))] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-white/50 text-sm">Chargement de la carte...</p>
              </div>
            </div>
          ) : (
            <CommandCenterMap
              countries={countries}
              onCountryClick={handleCountryClick}
              mode="members"
            />
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Button
            asChild
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 hover:text-white"
          >
            <Link to="/network" className="inline-flex items-center gap-2">
              Explorer la carte complète
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
