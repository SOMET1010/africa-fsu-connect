
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
    default: "bg-card shadow-sm",
    strong: "bg-card shadow-sm",
    subtle: "bg-card"
  };

  const shadows = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-sm",
    lg: "shadow-sm"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-2xl transition-all duration-200",
        variants[variant],
        border && (variant === "subtle" ? "border border-border/50" : "border border-border"),
        shadows[shadow],
        "hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

GlassCard.displayName = "GlassCard";

export { GlassCard };
