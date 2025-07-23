
import * as React from "react";
import { cn } from "@/lib/utils";
import { glassEffect, modernTransition, hoverEffects } from "@/lib/design-tokens";

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "light" | "medium" | "strong" | "gradient" | "glass";
  hover?: "none" | "lift" | "scale" | "glow";
  padding?: "none" | "sm" | "md" | "lg";
  border?: boolean;
  shadow?: boolean;
}

const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps>(
  ({ 
    className, 
    variant = "medium", 
    hover = "none", 
    padding = "md", 
    border = true,
    shadow = true,
    ...props 
  }, ref) => {
    const baseClasses = "rounded-xl relative overflow-hidden";
    
    const variantClasses = {
      light: glassEffect('light'),
      medium: glassEffect('medium'),
      strong: glassEffect('strong'),
      gradient: "bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border border-border/20 shadow-lg shadow-black/5",
      glass: "bg-card/60 backdrop-blur-xl border border-border/20 shadow-lg shadow-black/5"
    };

    const hoverClasses = {
      none: "",
      lift: hoverEffects.lift,
      scale: hoverEffects.scale,
      glow: "hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
    };

    const paddingClasses = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8"
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          hoverClasses[hover],
          paddingClasses[padding],
          !border && "border-none",
          !shadow && "shadow-none",
          className
        )}
        {...props}
      />
    );
  }
);
ModernCard.displayName = "ModernCard";

export { ModernCard };
