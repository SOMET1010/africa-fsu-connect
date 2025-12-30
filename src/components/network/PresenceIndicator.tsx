// NEXUS_COMPONENT
// Indicateur de présence visuel, sans chiffres agressifs
// Couleurs : nx-coop uniquement
// Compatible avec l'ancienne et nouvelle API

import { cn } from "@/lib/utils";

interface PresenceIndicatorProps {
  // Legacy API (for backward compatibility)
  level?: number;
  maxLevel?: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  description?: string;
  showLabel?: boolean;
  // New API
  className?: string;
}

/**
 * PresenceIndicator - Couche 1 compliant (NEXUS)
 * 
 * Visual bar showing network presence WITHOUT numerical values.
 * This is intentional per the Blueprint UX guidelines.
 * 
 * UX RULE: No hard KPIs on Couche 1 screens
 */
export const PresenceIndicator = ({ 
  level = 3,
  maxLevel = 4,
  size = "md",
  label,
  description,
  showLabel = false,
  className = ""
}: PresenceIndicatorProps) => {
  const percentage = (level / maxLevel) * 100;
  
  const barSizeClasses = {
    sm: "w-1 gap-0.5",
    md: "w-1 gap-0.5",
    lg: "w-1.5 gap-1",
  };

  const heightClasses = {
    sm: [4, 6, 8, 10],
    md: [4, 8, 12, 16],
    lg: [6, 10, 14, 18],
  };

  const getDescription = () => {
    if (description) return description;
    if (percentage >= 70) return "Forte activité ce mois";
    if (percentage >= 40) return "Activité modérée";
    return "Activité en développement";
  };

  // Simple mode (inline, no wrapping)
  if (!showLabel && !label) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {/* Barres de présence NEXUS */}
        <div className="flex items-end gap-0.5 h-4">
          {Array.from({ length: Math.min(maxLevel, 4) }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "rounded-full transition-all duration-[var(--nx-dur-2)] ease-[var(--nx-ease)]",
                barSizeClasses[size],
                index < level 
                  ? 'bg-[hsl(var(--nx-coop-600))]' 
                  : 'bg-[hsl(var(--nx-border))]'
              )}
              style={{
                height: `${(heightClasses[size] || heightClasses.md)[index] || 16}px`,
              }}
            />
          ))}
        </div>
        
        {/* Label textuel discret */}
        <span className="text-sm text-[hsl(var(--nx-text-500))]">
          Réseau actif
        </span>
      </div>
    );
  }

  // Full mode (centered, with label and description)
  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      {label && (
        <span className="text-sm text-[hsl(var(--nx-text-500))] font-medium">
          {label}
        </span>
      )}
      
      {/* Barre visuelle NEXUS - pas de chiffres */}
      <div className="flex gap-1 items-end">
        {Array.from({ length: maxLevel }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "rounded-sm transition-colors duration-[var(--nx-dur-2)]",
              size === "sm" ? "w-4 h-2" : size === "lg" ? "w-8 h-4" : "w-6 h-3",
              index < level 
                ? 'bg-[hsl(var(--nx-coop-600))]' 
                : 'bg-[hsl(var(--nx-border))]'
            )}
          />
        ))}
      </div>
      
      <span className="text-xs text-[hsl(var(--nx-text-500))]">
        {getDescription()}
      </span>
    </div>
  );
};
