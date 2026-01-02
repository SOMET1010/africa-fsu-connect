import { MemberCountryCard } from "./MemberCountryCard";

interface Country {
  code: string;
  name: string;
  flag: string;
  status: 'active' | 'member' | 'joining';
}

interface RegionSectionProps {
  region: string;
  countries: Country[];
  variant?: 'light' | 'dark';
}

export const RegionSection = ({ region, countries, variant = 'light' }: RegionSectionProps) => {
  const isDark = variant === 'dark';
  
  return (
    <div className="space-y-4">
      {/* Header de région */}
      <div className="flex items-center gap-3">
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-foreground'}`}>
          {region}
        </h2>
        <span className={`text-sm ${isDark ? 'text-white/60' : 'text-muted-foreground'}`}>
          ({countries.length})
        </span>
      </div>

      {/* Grille des pays - égalitaire */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {countries.map((country) => (
          <MemberCountryCard key={country.code} country={country} variant={variant} />
        ))}
      </div>
    </div>
  );
};
