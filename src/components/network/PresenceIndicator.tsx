import { cn } from "@/lib/utils";

interface PresenceIndicatorProps {
  level: number;
  maxLevel?: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  description?: string;
  showLabel?: boolean;
}

/**
 * PresenceIndicator - Couche 1 compliant
 * 
 * Visual bar showing network presence WITHOUT numerical values.
 * This is intentional per the Blueprint UX guidelines.
 * 
 * UX RULE: No hard KPIs on Couche 1 screens
 */
export const PresenceIndicator = ({ 
  level, 
  maxLevel = 10,
  size = "md",
  label = "Présence réseau",
  description,
  showLabel = true
}: PresenceIndicatorProps) => {
  const percentage = (level / maxLevel) * 100;
  
  const barSizeClasses = {
    sm: "w-4 h-2",
    md: "w-6 h-3",
    lg: "w-8 h-4",
  };

  const getDescription = () => {
    if (description) return description;
    if (percentage >= 70) return "Forte activité ce mois";
    if (percentage >= 40) return "Activité modérée";
    return "Activité en développement";
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {showLabel && (
        <span className="text-sm text-muted-foreground font-medium">
          {label}
        </span>
      )}
      
      {/* Barre visuelle - pas de chiffres */}
      <div className="flex gap-1">
        {Array.from({ length: maxLevel }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "rounded-sm transition-colors",
              barSizeClasses[size],
              index < level 
                ? 'bg-primary' 
                : 'bg-muted'
            )}
          />
        ))}
      </div>
      
      <span className="text-xs text-muted-foreground">
        {getDescription()}
      </span>
    </div>
  );
};