// Indicateur de présence visuel, sans chiffres agressifs

import { cn } from "@/lib/utils";

interface PresenceIndicatorProps {
  level?: number;
  maxLevel?: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  description?: string;
  showLabel?: boolean;
  className?: string;
}

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

  // Simple mode (inline, no wrapping) — used in hero (white text context)
  if (!showLabel && !label) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex items-end gap-0.5 h-4">
          {Array.from({ length: Math.min(maxLevel, 4) }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "rounded-full transition-all duration-200",
                barSizeClasses[size],
                index < level 
                  ? 'bg-white' 
                  : 'bg-white/30'
              )}
              style={{
                height: `${(heightClasses[size] || heightClasses.md)[index] || 16}px`,
              }}
            />
          ))}
        </div>
        
        <span className="text-sm text-white/80">
          Réseau actif
        </span>
      </div>
    );
  }

  // Full mode
  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      {label && (
        <span className="text-sm text-slate-500 dark:text-muted-foreground font-medium">
          {label}
        </span>
      )}
      
      <div className="flex gap-1 items-end">
        {Array.from({ length: maxLevel }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "rounded-sm transition-colors duration-200",
              size === "sm" ? "w-4 h-2" : size === "lg" ? "w-8 h-4" : "w-6 h-3",
              index < level 
                ? 'bg-emerald-500' 
                : 'bg-slate-200 dark:bg-border'
            )}
          />
        ))}
      </div>
      
      <span className="text-xs text-slate-500 dark:text-muted-foreground">
        {getDescription()}
      </span>
    </div>
  );
};
