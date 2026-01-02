import { useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Practice } from "@/types/practice";

interface CountryPosition {
  name: string;
  code: string;
  flag: string;
  x: number;
  y: number;
}

// Simplified Africa country positions (percentage-based)
const COUNTRY_POSITIONS: CountryPosition[] = [
  { name: "Maroc", code: "MA", flag: "🇲🇦", x: 30, y: 12 },
  { name: "Sénégal", code: "SN", flag: "🇸🇳", x: 12, y: 32 },
  { name: "Mali", code: "ML", flag: "🇲🇱", x: 28, y: 28 },
  { name: "Côte d'Ivoire", code: "CI", flag: "🇨🇮", x: 22, y: 42 },
  { name: "Burkina Faso", code: "BF", flag: "🇧🇫", x: 32, y: 35 },
  { name: "Niger", code: "NE", flag: "🇳🇪", x: 42, y: 28 },
  { name: "Nigeria", code: "NG", flag: "🇳🇬", x: 45, y: 42 },
  { name: "Cameroun", code: "CM", flag: "🇨🇲", x: 50, y: 48 },
  { name: "RDC", code: "CD", flag: "🇨🇩", x: 58, y: 58 },
  { name: "Kenya", code: "KE", flag: "🇰🇪", x: 75, y: 48 },
  { name: "Rwanda", code: "RW", flag: "🇷🇼", x: 68, y: 55 },
  { name: "Éthiopie", code: "ET", flag: "🇪🇹", x: 78, y: 35 },
  { name: "Tanzanie", code: "TZ", flag: "🇹🇿", x: 72, y: 60 },
  { name: "Afrique du Sud", code: "ZA", flag: "🇿🇦", x: 60, y: 88 },
  { name: "Madagascar", code: "MG", flag: "🇲🇬", x: 82, y: 72 },
];

interface PracticesMapMiniProps {
  practices?: Practice[];
  onCountryClick?: (country: string) => void;
  selectedCountry?: string;
  className?: string;
}

export function PracticesMapMini({ 
  practices, 
  onCountryClick, 
  selectedCountry, 
  className 
}: PracticesMapMiniProps) {
  // Compute country counts from practices
  const countryData = useMemo(() => {
    if (!practices || practices.length === 0) {
      // Default demo data
      return COUNTRY_POSITIONS.map(pos => ({
        ...pos,
        count: Math.floor(Math.random() * 10) + 1,
      }));
    }

    const counts: Record<string, number> = {};
    practices.forEach((p) => {
      counts[p.country] = (counts[p.country] || 0) + 1;
    });

    return COUNTRY_POSITIONS.map(pos => ({
      ...pos,
      count: counts[pos.name] || 0,
    })).filter(c => c.count > 0);
  }, [practices]);

  const totalCountries = countryData.length;
  const totalPractices = countryData.reduce((sum, c) => sum + c.count, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "relative bg-gradient-to-br from-primary/5 via-background to-accent/5",
        "rounded-2xl border overflow-hidden",
        "aspect-[4/3]",
        className
      )}
    >
      {/* Subtle Africa silhouette */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <path
            d="M45,5 Q60,8 65,15 L70,25 Q75,35 72,45 L75,55 Q78,65 70,75 L65,85 Q55,95 45,90 L35,85 Q25,80 22,70 L18,55 Q15,45 20,35 L25,25 Q30,12 45,5 Z"
            fill="currentColor"
            className="text-foreground"
          />
        </svg>
      </div>

      {/* Country points */}
      {countryData.map((country, index) => (
        <motion.button
          key={country.code}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.03, type: "spring", stiffness: 400, damping: 20 }}
          whileHover={{ scale: 1.2 }}
          onClick={() => onCountryClick?.(country.name)}
          className={cn(
            "absolute -translate-x-1/2 -translate-y-1/2 group z-10",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full"
          )}
          style={{ left: `${country.x}%`, top: `${country.y}%` }}
          aria-label={`${country.name}: ${country.count} pratiques`}
        >
          {/* Pulse for high-count countries */}
          {country.count >= 5 && (
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20"
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          )}

          {/* Main marker */}
          <div
            className={cn(
              "relative flex items-center justify-center rounded-full transition-all duration-200",
              "shadow-sm",
              selectedCountry === country.name
                ? "w-9 h-9 bg-primary text-primary-foreground ring-2 ring-primary/30"
                : "w-7 h-7 bg-card border border-border hover:border-primary/50 hover:bg-accent"
            )}
          >
            <span className="text-sm leading-none">{country.flag}</span>
          </div>

          {/* Tooltip */}
          <div className={cn(
            "absolute left-1/2 -translate-x-1/2 -top-11",
            "px-2 py-1 rounded-md bg-popover border shadow-md",
            "text-xs whitespace-nowrap pointer-events-none",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-150",
            "z-30"
          )}>
            <p className="font-medium text-foreground">{country.name}</p>
            <p className="text-muted-foreground">{country.count} pratique{country.count > 1 ? 's' : ''}</p>
          </div>
        </motion.button>
      ))}

      {/* Stats badge */}
      <div className="absolute bottom-2 left-2 bg-card/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border shadow-sm">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Présence</p>
        <p className="text-base font-bold text-primary">{totalCountries} <span className="text-xs font-normal text-muted-foreground">pays</span></p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-2 right-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
        <MapPin className="h-3 w-3" />
        <span>{totalPractices} pratiques</span>
      </div>
    </motion.div>
  );
}
