import { motion } from "framer-motion";
import { MapPin, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountryVisualProps {
  country: string;
  flag: string;
  size?: "sm" | "md" | "lg";
  variant?: "flag" | "map" | "badge";
  className?: string;
}

// Region color mapping
const regionColors: Record<string, { bg: string; text: string; border: string }> = {
  // Afrique de l'Ouest
  "Côte d'Ivoire": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "Sénégal": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "Mali": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "Burkina Faso": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "Niger": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "Guinée": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "Bénin": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "Togo": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  
  // Afrique Centrale
  "Cameroun": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "RDC": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "Congo": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "Gabon": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "Tchad": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  
  // Afrique de l'Est
  "Kenya": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "Tanzanie": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "Rwanda": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "Éthiopie": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "Ouganda": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  
  // Afrique du Nord
  "Maroc": { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  "Tunisie": { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  "Algérie": { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  "Égypte": { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  
  // Afrique Australe
  "Afrique du Sud": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  "Mozambique": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  "Madagascar": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
};

const defaultColors = { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" };

const sizeConfig = {
  sm: { container: "w-8 h-8", flag: "text-lg", icon: 12 },
  md: { container: "w-12 h-12", flag: "text-2xl", icon: 16 },
  lg: { container: "w-16 h-16", flag: "text-3xl", icon: 20 },
};

export function CountryVisual({
  country,
  flag,
  size = "md",
  variant = "flag",
  className,
}: CountryVisualProps) {
  const colors = regionColors[country] || defaultColors;
  const sizeValues = sizeConfig[size];

  if (variant === "badge") {
    return (
      <motion.span
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-sm font-medium border",
          colors.bg,
          colors.text,
          colors.border,
          className
        )}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <span>{flag}</span>
        <span>{country}</span>
      </motion.span>
    );
  }

  if (variant === "map") {
    return (
      <motion.div
        className={cn(
          "relative flex items-center justify-center rounded-xl border",
          sizeValues.container,
          colors.bg,
          colors.border,
          className
        )}
        whileHover={{ scale: 1.05 }}
      >
        <Globe
          size={sizeValues.icon}
          className={colors.text}
          strokeWidth={1.5}
        />
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-white rounded-full shadow-sm border text-xs"
        >
          {flag}
        </motion.div>
      </motion.div>
    );
  }

  // Default: flag variant
  return (
    <motion.div
      className={cn(
        "flex items-center justify-center rounded-xl border",
        sizeValues.container,
        colors.bg,
        colors.border,
        className
      )}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <span className={sizeValues.flag}>{flag}</span>
    </motion.div>
  );
}

// Inline version for lists
export function CountryInline({
  country,
  flag,
  className,
}: {
  country: string;
  flag: string;
  className?: string;
}) {
  const colors = regionColors[country] || defaultColors;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm",
        colors.text,
        className
      )}
    >
      <span>{flag}</span>
      <span className="font-medium">{country}</span>
    </span>
  );
}
