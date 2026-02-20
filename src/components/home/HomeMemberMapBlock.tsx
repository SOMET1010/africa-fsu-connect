import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe, ArrowRight, Users, FolderOpen, TrendingUp } from "lucide-react";
import { useAfricanCountries } from "@/hooks/useCountries";
import { Country } from "@/services/countriesService";
import { cn } from "@/lib/utils";
import { useDirection } from "@/hooks/useDirection";
import { HomeMemberMap } from "@/components/home/HomeMemberMap";
import { ACTIVITY_LEVELS, type MapMode, type ActivityLevel, getCountryActivity } from "@/components/map/activityData";

const LEGEND_ITEMS: { level: ActivityLevel; label: string }[] = [
  { level: 'high', label: 'Très actif' },
  { level: 'medium', label: 'Membre' },
  { level: 'onboarding', label: 'En intégration' },
  { level: 'observer', label: 'Observateur' },
];

const MODE_OPTIONS: { mode: MapMode; label: string; icon: typeof Users }[] = [
  { mode: 'members', label: 'Membres', icon: Users },
  { mode: 'projects', label: 'Projets', icon: FolderOpen },
  { mode: 'trends', label: 'Tendances', icon: TrendingUp },
];

export function HomeMemberMapBlock() {
  const { data: countries = [], isLoading } = useAfricanCountries();
  const { isRTL } = useDirection();
  const [activeMode, setActiveMode] = useState<MapMode>('members');

  const handleCountryClick = (_country: Country) => {};

  const countByLevel = (level: ActivityLevel): number => {
    return countries.filter((c) => getCountryActivity(c.code).level === level).length;
  };

  return (
    <section className="py-16 animate-fade-in" style={{ contentVisibility: 'auto' }}>
      <div className="container mx-auto px-4">
        <div className={cn("text-center mb-10", isRTL && "text-right")}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nx-brand-900))]/5 border border-[hsl(var(--nx-border))] text-[hsl(var(--nx-text-500))] text-sm mb-4">
            <Globe className="h-4 w-4 text-[hsl(var(--nx-gold))]" />
            Réseau continental
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[hsl(var(--nx-text-900))] mb-3">
            Participation des Membres
          </h2>
          <p className="text-[hsl(var(--nx-text-500))] max-w-2xl mx-auto">
            Visualisez l'engagement des pays africains dans le réseau UDC — contributions, projets et collaborations en temps réel.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {MODE_OPTIONS.map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setActiveMode(mode)}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all",
                activeMode === mode
                  ? "bg-[hsl(var(--nx-brand-900))]/10 text-[hsl(var(--nx-brand-900))] border border-[hsl(var(--nx-brand-900))]/30"
                  : "bg-[hsl(var(--nx-surface))] text-[hsl(var(--nx-text-500))] border border-[hsl(var(--nx-border))] hover:bg-[hsl(var(--nx-border))] hover:text-[hsl(var(--nx-text-700))]"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div
          className="relative rounded-2xl overflow-hidden border border-[hsl(var(--nx-gold))]/20 bg-[hsl(var(--nx-night))]"
          style={{ height: 'clamp(380px, 55vw, 520px)' }}
        >
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-10 h-10 border-3 border-[hsl(var(--nx-gold))] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-white/50 text-sm">Chargement de la carte...</p>
              </div>
            </div>
          ) : (
            <HomeMemberMap countries={countries} onCountryClick={handleCountryClick} mode={activeMode} />
          )}
        </div>

        {/* Legend with counts */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-5">
          {LEGEND_ITEMS.map(({ level, label }) => (
            <div key={level} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full border-2"
                style={{
                  borderColor: ACTIVITY_LEVELS[level].color,
                  backgroundColor: `${ACTIVITY_LEVELS[level].color}33`,
                }}
              />
              <span className="text-xs text-[hsl(var(--nx-text-500))]">
                {label}
                <span className="ml-1 text-[hsl(var(--nx-text-500))]/60">({countByLevel(level)})</span>
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button
            asChild
            variant="outline"
            className="border-[hsl(var(--nx-border))] bg-[hsl(var(--nx-surface))] text-[hsl(var(--nx-text-900))] hover:bg-[hsl(var(--nx-border))] shadow-sm"
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
