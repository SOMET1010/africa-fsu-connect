interface PresenceIndicatorProps {
  level: number;
  maxLevel?: number;
  label?: string;
  description?: string;
}

export const PresenceIndicator = ({ 
  level, 
  maxLevel = 7,
  label = "Présence réseau",
  description = "Participation au réseau"
}: PresenceIndicatorProps) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <span className="text-sm text-muted-foreground font-medium">
        {label}
      </span>
      
      {/* Barre visuelle - pas de chiffres */}
      <div className="flex gap-1">
        {Array.from({ length: maxLevel }).map((_, index) => (
          <div
            key={index}
            className={`w-6 h-3 rounded-sm transition-colors ${
              index < level 
                ? 'bg-primary' 
                : 'bg-muted'
            }`}
          />
        ))}
      </div>
      
      <span className="text-xs text-muted-foreground">
        {description}
      </span>
    </div>
  );
};
