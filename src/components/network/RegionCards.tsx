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
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {regions.map((region, index) => (
        <Link 
          key={region.id} 
          to={`/members?region=${encodeURIComponent(region.name)}`}
          className="block group"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <NexusCard 
            hover="subtle" 
            padding="sm"
            className="h-full text-center animate-fade-in"
          >
            {/* Indicateur de région - couleur égalitaire */}
            <div className="w-12 h-12 bg-[hsl(var(--nx-brand-900))] rounded-xl mx-auto mb-3 flex items-center justify-center transition-transform duration-[var(--nx-dur-2)] ease-[var(--nx-ease)] group-hover:scale-105">
              <span className="text-white font-semibold text-lg">
                {region.name[0]}
              </span>
            </div>
            
            <h3 className="font-medium text-sm text-[hsl(var(--nx-text-900))] mb-1">
              {region.name}
            </h3>
            
            <p className="text-xs text-[hsl(var(--nx-text-500))]">
              {region.countriesCount} {t('common.countries') || 'pays'}
            </p>
          </NexusCard>
        </Link>
      ))}
    </div>
  );
};
