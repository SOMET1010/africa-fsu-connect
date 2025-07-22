
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
    default: "bg-card border border-border/50 shadow-lg",
    gradient: "bg-gradient-to-br from-card via-card/95 to-card/90 border border-border/30 shadow-xl backdrop-blur-sm",
    glass: "bg-card/80 backdrop-blur-xl border border-border/20 shadow-2xl",
    elevated: "bg-card border border-border shadow-dramatic",
    neon: "bg-card border-2 border-primary/20 shadow-lg shadow-primary/5"
  };

  const hoverEffects = {
    lift: "hover:-translate-y-3 hover:shadow-2xl transition-all duration-300 ease-out",
    glow: "hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300",
    scale: "hover:scale-[1.02] transition-transform duration-200",
    tilt: "hover:rotate-1 hover:scale-[1.02] transition-all duration-200",
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
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-300 hover:opacity-100" />
      <div className="relative z-10">
        {children}
      </div>
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
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/20">
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
            <div key={index} className="text-center p-3 rounded-xl bg-muted/30 border border-border/30">
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
