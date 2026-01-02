// NEXUS_COMPONENT
// Régions avec couleur égalitaire (pas de hiérarchie visuelle)
// Toutes les régions ont la même importance visuelle

import { Link } from "react-router-dom";
import { NexusCard } from "@/components/ui/nexus-card";
import { useTranslation } from "@/hooks/useTranslation";

interface Region {
  id: string;
  name: string;
  code: string;
  countriesCount: number;
}

// Toutes les régions ont la même couleur (égalité)
const regions: Region[] = [
  { id: '1', name: 'Afrique de l\'Ouest', code: 'west', countriesCount: 15 },
  { id: '2', name: 'Afrique Centrale', code: 'central', countriesCount: 9 },
  { id: '3', name: 'Afrique de l\'Est', code: 'east', countriesCount: 13 },
  { id: '4', name: 'Afrique du Nord', code: 'north', countriesCount: 6 },
  { id: '5', name: 'Afrique Australe', code: 'south', countriesCount: 11 },
];

export const RegionCards = () => {
  const { t, currentLanguage } = useTranslation();

  const badgeByRegion: Record<Region['code'], Partial<Record<typeof currentLanguage, string>> & { default: string }> = {
    west: { fr: 'O', pt: 'O', default: 'W' },
    central: { fr: 'C', pt: 'C', default: 'C' },
    east: { fr: 'E', pt: 'E', default: 'E' },
    north: { fr: 'N', pt: 'N', default: 'N' },
    south: { fr: 'S', pt: 'S', default: 'S' },
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {regions.map((region, index) => {
        const badge = (badgeByRegion[region.code]?.[currentLanguage] || badgeByRegion[region.code]?.default || '?').toUpperCase();

        return (
          <Link 
            key={region.id} 
            to={`/members?region=${encodeURIComponent(region.name)}`}
            className="block group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="h-full text-center animate-fade-in rounded-[var(--nx-radius-md)] border border-white/10 bg-white/5 backdrop-blur-sm p-4 hover:bg-white/10 hover:border-[hsl(var(--nx-gold)/0.5)] transition-all duration-[var(--nx-dur-2)]">
              {/* Indicateur de région - couleur gold */}
              <div className="w-12 h-12 bg-[hsl(var(--nx-gold))] rounded-xl mx-auto mb-3 flex items-center justify-center transition-transform duration-[var(--nx-dur-2)] ease-[var(--nx-ease)] group-hover:scale-105 shadow-[0_0_20px_hsl(var(--nx-gold)/0.3)]">
                <span className="text-[hsl(var(--nx-night))] font-semibold text-lg">
                  {badge}
                </span>
              </div>

              <h3 className="font-medium text-sm text-white mb-1">
                {region.name}
              </h3>

              <p className="text-xs text-white/60">
                {region.countriesCount} {t('common.countries') || 'pays'}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
