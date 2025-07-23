
import * as React from "react";
import { cn } from "@/lib/utils";
import { glassEffect, modernTransition, hoverEffects } from "@/lib/design-tokens";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "light" | "medium" | "strong" | "default";
  hover?: "none" | "lift" | "scale";
  padding?: "none" | "sm" | "md" | "lg";
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "medium", hover = "none", padding = "md", ...props }, ref) => {
    const variantClasses = {
      light: glassEffect('light'),
      medium: glassEffect('medium'),
      strong: glassEffect('strong'),
      default: glassEffect('medium')
    };

    const hoverClasses = {
      none: "",
      lift: hoverEffects.lift,
      scale: hoverEffects.scale
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
          "rounded-xl relative overflow-hidden",
          variantClasses[variant],
          hoverClasses[hover],
          paddingClasses[padding],
          className
        )}
        {...props}
      />
    );
  }
);
GlassCard.displayName = "GlassCard";

export { GlassCard };
