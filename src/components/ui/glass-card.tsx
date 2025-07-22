
import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "strong" | "subtle";
  blur?: "sm" | "md" | "lg" | "xl";
  border?: boolean;
  shadow?: "none" | "sm" | "md" | "lg";
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(({
  className,
  variant = "default",
  blur = "md",
  border = true,
  shadow = "lg",
  children,
  ...props
}, ref) => {
  const variants = {
    default: "bg-card/80 backdrop-blur-md",
    strong: "bg-card/90 backdrop-blur-lg",
    subtle: "bg-card/60 backdrop-blur-sm"
  };

  const blurLevels = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md", 
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl"
  };

  const shadows = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg shadow-black/5"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-2xl transition-all duration-300",
        variants[variant],
        blurLevels[blur],
        border && "border border-border/20",
        shadows[shadow],
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300",
        "hover:before:opacity-100 hover:shadow-xl hover:shadow-primary/5",
        className
      )}
      {...props}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
});

GlassCard.displayName = "GlassCard";

export { GlassCard };
