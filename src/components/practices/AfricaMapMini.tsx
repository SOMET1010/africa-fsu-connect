import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountryPoint {
  name: string;
  flag: string;
  count: number;
  x: number; // percentage position
  y: number;
}

// Simplified positions on an abstract Africa map
const countryPoints: CountryPoint[] = [
  { name: "Maroc", flag: "🇲🇦", count: 5, x: 30, y: 15 },
  { name: "Sénégal", flag: "🇸🇳", count: 12, x: 15, y: 35 },
  { name: "Mali", flag: "🇲🇱", count: 4, x: 32, y: 32 },
  { name: "Côte d'Ivoire", flag: "🇨🇮", count: 15, x: 25, y: 45 },
  { name: "Burkina Faso", flag: "🇧🇫", count: 6, x: 35, y: 38 },
  { name: "Niger", flag: "🇳🇪", count: 3, x: 45, y: 30 },
  { name: "Cameroun", flag: "🇨🇲", count: 8, x: 50, y: 48 },
  { name: "RDC", flag: "🇨🇩", count: 7, x: 58, y: 55 },
  { name: "Kenya", flag: "🇰🇪", count: 10, x: 75, y: 50 },
  { name: "Rwanda", flag: "🇷🇼", count: 9, x: 68, y: 55 },
  { name: "Éthiopie", flag: "🇪🇹", count: 6, x: 78, y: 38 },
  { name: "Afrique du Sud", flag: "🇿🇦", count: 11, x: 60, y: 85 },
  { name: "Madagascar", flag: "🇲🇬", count: 4, x: 82, y: 70 },
];

interface AfricaMapMiniProps {
  onCountryClick?: (country: string) => void;
  selectedCountry?: string;
  className?: string;
}

export function AfricaMapMini({ onCountryClick, selectedCountry, className }: AfricaMapMiniProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "relative bg-gradient-to-br from-primary/5 via-muted/50 to-accent/5 rounded-2xl border overflow-hidden",
        "aspect-[4/3] md:aspect-[16/9]",
        className
      )}
    >
      {/* Decorative Africa silhouette background */}
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <path
            d="M45,5 Q60,8 65,15 L70,25 Q75,35 72,45 L75,55 Q78,65 70,75 L65,85 Q55,95 45,90 L35,85 Q25,80 22,70 L18,55 Q15,45 20,35 L25,25 Q30,12 45,5 Z"
            fill="currentColor"
            className="text-primary"
          />
        </svg>
      </div>

      {/* Country points */}
      {countryPoints.map((country, index) => (
        <motion.button
          key={country.name}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
          whileHover={{ scale: 1.3, zIndex: 10 }}
          onClick={() => onCountryClick?.(country.name)}
          className={cn(
            "absolute -translate-x-1/2 -translate-y-1/2 group",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
          )}
          style={{ left: `${country.x}%`, top: `${country.y}%` }}
          title={`${country.name}: ${country.count} pratiques`}
        >
          {/* Pulse effect for countries with many practices */}
          {country.count >= 10 && (
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/30"
              animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          {/* Main dot */}
          <div
            className={cn(
              "relative flex items-center justify-center rounded-full transition-all",
              "shadow-md",
              selectedCountry === country.name
                ? "w-10 h-10 bg-primary text-primary-foreground"
                : "w-7 h-7 bg-card border-2 border-primary/30 hover:border-primary"
            )}
          >
            <span className="text-sm">{country.flag}</span>
          </div>

          {/* Tooltip on hover */}
          <div className={cn(
            "absolute left-1/2 -translate-x-1/2 -top-12 px-2 py-1 rounded-lg",
            "bg-popover border shadow-lg text-xs font-medium whitespace-nowrap",
            "opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
            "z-20"
          )}>
            <p className="font-semibold">{country.name}</p>
            <p className="text-muted-foreground">{country.count} pratiques</p>
          </div>
        </motion.button>
      ))}

      {/* Stats overlay */}
      <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 border shadow-sm">
        <p className="text-xs text-muted-foreground">Présence dans</p>
        <p className="text-lg font-bold text-primary">{countryPoints.length} pays</p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3" />
        <span>Cliquez pour filtrer</span>
      </div>
    </motion.div>
  );
}
