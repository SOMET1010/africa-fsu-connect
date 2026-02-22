
import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gradient" | "glass" | "elevated" | "neon";
  hover?: "lift" | "glow" | "scale" | "tilt" | "none";
  interactive?: boolean;
}

const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps>(({
  className,
  variant = "default",
  hover = "lift",
  interactive = false,
  children,
  ...props
}, ref) => {
  const variants = {
    default: "bg-card border border-border shadow-sm",
    gradient: "bg-card border border-border shadow-sm",
    glass: "bg-card border border-border shadow-sm",
    elevated: "bg-card border border-border shadow-sm",
    neon: "bg-card border border-border shadow-sm"
  };

  const hoverEffects = {
    lift: "hover:-translate-y-1 hover:shadow-md transition-all duration-200 ease-out",
    glow: "hover:shadow-md transition-all duration-200",
    scale: "hover:scale-[1.01] transition-transform duration-200",
    tilt: "hover:scale-[1.01] transition-all duration-200",
    none: ""
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl overflow-hidden relative",
        variants[variant],
        hover !== "none" && hoverEffects[hover],
        interactive && "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

ModernCard.displayName = "ModernCard";

interface IconCardProps extends ModernCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  iconColor?: string;
  badge?: React.ReactNode;
  stats?: { label: string; value: string }[];
}

export const ModernIconCard = React.forwardRef<HTMLDivElement, IconCardProps>(({
  icon: Icon,
  title,
  description,
  iconColor = "text-primary",
  badge,
  stats,
  className,
  children,
  ...props
}, ref) => {
  return (
    <ModernCard
      ref={ref}
      className={cn("p-6 group", className)}
      {...props}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-border">
              <Icon className={cn("h-7 w-7", iconColor)} />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors duration-200">
              {title}
            </h3>
            {description && (
              <p className="text-muted-foreground mt-1 text-sm">{description}</p>
            )}
          </div>
        </div>
        {badge}
      </div>
      
      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-3 rounded-xl bg-muted/50 border border-border">
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
      
      {children}
    </ModernCard>
  );
});

ModernIconCard.displayName = "ModernIconCard";

export { ModernCard };
