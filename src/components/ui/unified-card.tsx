/**
 * UNIFIED CARD COMPONENT
 * 
 * Consolidates all Card variants:
 * - GlassCard → variant="glass"
 * - EnhancedCard → variant="enhanced" 
 * - ModernCard → variant="modern"
 * - NexusCard → variant="nexus"
 * - ProfessionalCard → variant="professional"
 * 
 * @deprecated Individual card components (GlassCard, EnhancedCard, etc.)
 * Use UnifiedCard with appropriate variant prop instead.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

/* ========================================
   UNIFIED CARD TYPES
   ======================================== */

export type CardVariant = 
  | "default" 
  | "glass" 
  | "glass-strong"
  | "glass-subtle"
  | "enhanced"
  | "modern"
  | "gradient"
  | "elevated"
  | "minimal"
  | "nexus"
  | "nexus-flat"
  | "professional"
  | "featured";

export type CardHover = 
  | "none" 
  | "subtle"
  | "lift" 
  | "glow" 
  | "scale";

export type CardPadding = "none" | "sm" | "md" | "lg";
export type CardBlur = "none" | "sm" | "md" | "lg" | "xl";
export type CardShadow = "none" | "sm" | "md" | "lg" | "dramatic";

export interface UnifiedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hover?: CardHover;
  padding?: CardPadding;
  blur?: CardBlur;
  shadow?: CardShadow;
  border?: boolean;
  interactive?: boolean;
}

/* ========================================
   VARIANT STYLES
   ======================================== */

const variantStyles: Record<CardVariant, string> = {
  // Default - simple card
  default: "bg-card border border-border",
  
  // Glass variants (from GlassCard)
  glass: "bg-white/5 dark:bg-white/5 backdrop-blur-md border border-white/10",
  "glass-strong": "bg-white/10 dark:bg-white/10 backdrop-blur-lg border border-white/15",
  "glass-subtle": "bg-white/[0.03] dark:bg-white/[0.03] backdrop-blur-sm border border-white/5",
  
  // Enhanced variants (from EnhancedCard)
  enhanced: "bg-card/80 backdrop-blur-lg border border-border/50 shadow-xl",
  
  // Modern variants (from ModernCard)
  modern: "bg-card border border-border/50 shadow-lg",
  gradient: "bg-gradient-to-br from-card via-card/95 to-card/90 border border-border/30 shadow-xl backdrop-blur-sm",
  
  // Elevated
  elevated: "bg-card border border-border shadow-lg",
  
  // Minimal
  minimal: "bg-transparent border-0",
  
  // Nexus variants (from NexusCard)
  nexus: "bg-[hsl(var(--nx-surface))] border border-[hsl(var(--nx-border))] shadow-[var(--nx-shadow-sm)]",
  "nexus-flat": "bg-[hsl(var(--nx-surface))] border border-[hsl(var(--nx-border))]",
  
  // Professional variants (from ProfessionalCard)
  professional: "bg-card border border-border hover:border-primary/30 transition-colors",
  featured: "bg-gradient-to-br from-card to-card/80 border border-primary/20 shadow-lg",
};

const hoverStyles: Record<CardHover, string> = {
  none: "",
  subtle: "hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ease-out",
  lift: "hover:-translate-y-2 hover:shadow-xl transition-all duration-300 ease-out",
  glow: "hover:shadow-xl hover:shadow-primary/10 transition-all duration-300",
  scale: "hover:scale-[1.02] transition-transform duration-200",
};

const paddingStyles: Record<CardPadding, string> = {
  none: "",
  sm: "p-3 md:p-4",
  md: "p-4 md:p-6",
  lg: "p-6 md:p-8",
};

const blurStyles: Record<CardBlur, string> = {
  none: "",
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
};

const shadowStyles: Record<CardShadow, string> = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  dramatic: "shadow-2xl shadow-black/10",
};

/* ========================================
   UNIFIED CARD COMPONENT
   ======================================== */

const UnifiedCard = React.forwardRef<HTMLDivElement, UnifiedCardProps>(
  (
    {
      className,
      variant = "default",
      hover = "none",
      padding = "md",
      blur = "none",
      shadow = "none",
      border = true,
      interactive = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl overflow-hidden relative",
          variantStyles[variant],
          hoverStyles[hover],
          paddingStyles[padding],
          blur !== "none" && blurStyles[blur],
          shadow !== "none" && shadowStyles[shadow],
          !border && "border-0",
          interactive && "cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

UnifiedCard.displayName = "UnifiedCard";

/* ========================================
   UNIFIED ICON CARD
   ======================================== */

interface UnifiedIconCardProps extends UnifiedCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  iconColor?: string;
  iconBgColor?: string;
  badge?: React.ReactNode;
  stats?: { label: string; value: string }[];
}

const UnifiedIconCard = React.forwardRef<HTMLDivElement, UnifiedIconCardProps>(
  (
    {
      icon: Icon,
      title,
      description,
      iconColor = "text-primary",
      iconBgColor = "bg-primary/10",
      badge,
      stats,
      className,
      children,
      padding = "md",
      ...props
    },
    ref
  ) => {
    return (
      <UnifiedCard
        ref={ref}
        className={cn("group", className)}
        padding={padding}
        {...props}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center border border-primary/20",
                iconBgColor
              )}
            >
              <Icon className={cn("h-6 w-6", iconColor)} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-200">
                {title}
              </h3>
              {description && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {description}
                </p>
              )}
            </div>
          </div>
          {badge}
        </div>

        {stats && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-2.5 rounded-lg bg-muted/30 border border-border/30"
              >
                <div className="text-xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {children}
      </UnifiedCard>
    );
  }
);

UnifiedIconCard.displayName = "UnifiedIconCard";

/* ========================================
   BACKWARD COMPATIBILITY ALIASES
   
   These are deprecated and will be removed in future.
   Use UnifiedCard with appropriate variant instead.
   ======================================== */

/**
 * @deprecated Use UnifiedCard variant="glass" instead
 */
export const GlassCardAlias = React.forwardRef<
  HTMLDivElement,
  Omit<UnifiedCardProps, "variant"> & { variant?: "default" | "strong" | "subtle" }
>((props, ref) => {
  const variantMap = {
    default: "glass",
    strong: "glass-strong",
    subtle: "glass-subtle",
  } as const;
  
  return (
    <UnifiedCard
      ref={ref}
      {...props}
      variant={variantMap[props.variant || "default"]}
    />
  );
});
GlassCardAlias.displayName = "GlassCardAlias";

/**
 * @deprecated Use UnifiedCard variant="enhanced" instead
 */
export const EnhancedCardAlias = React.forwardRef<
  HTMLDivElement,
  UnifiedCardProps
>((props, ref) => (
  <UnifiedCard ref={ref} variant="enhanced" {...props} />
));
EnhancedCardAlias.displayName = "EnhancedCardAlias";

/**
 * @deprecated Use UnifiedCard variant="modern" instead
 */
export const ModernCardAlias = React.forwardRef<
  HTMLDivElement,
  UnifiedCardProps
>((props, ref) => (
  <UnifiedCard ref={ref} variant="modern" {...props} />
));
ModernCardAlias.displayName = "ModernCardAlias";

export { UnifiedCard, UnifiedIconCard };
