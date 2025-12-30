/**
 * NEXUS DESIGN SYSTEM — Card Components
 * 
 * NEXUS_CARD_GUARD
 * - Pas d'effet "neon" ou "glow" agressif
 * - Hover max translateY(-2px)
 * - Ombres soft uniquement
 * - Max 2 CTAs par card
 * - Animation durée >= 180ms
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ========================================
   BASE NEXUS CARD
   ======================================== */

interface NexusCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "flat" | "elevated";
  hover?: "subtle" | "none";
  padding?: "sm" | "md" | "lg";
}

const NexusCard = React.forwardRef<HTMLDivElement, NexusCardProps>(
  ({ className, variant = "default", hover = "subtle", padding = "md", children, ...props }, ref) => {
    const variants = {
      default: "bg-[hsl(var(--nx-surface))] border border-[hsl(var(--nx-border))] shadow-[var(--nx-shadow-sm)]",
      flat: "bg-[hsl(var(--nx-surface))] border border-[hsl(var(--nx-border))]",
      elevated: "bg-[hsl(var(--nx-surface))] border border-[hsl(var(--nx-border))] shadow-[var(--nx-shadow-md)]",
    };

    const paddings = {
      sm: "p-4",
      md: "p-5 md:p-6",
      lg: "p-6 md:p-8",
    };

    const hoverEffects = {
      subtle: "hover:-translate-y-0.5 hover:shadow-[var(--nx-shadow-md)] transition-all duration-[var(--nx-dur-2)] ease-[var(--nx-ease)]",
      none: "",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[var(--nx-radius-lg)]",
          variants[variant],
          paddings[padding],
          hoverEffects[hover],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NexusCard.displayName = "NexusCard";

/* ========================================
   NARRATIVE CARD — Messages courts + icône douce
   Pour Couche 1 : texte court, pas de KPI
   ======================================== */

interface NexusNarrativeCardProps extends Omit<NexusCardProps, 'children'> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  accent?: "brand" | "coop" | "neutral";
}

const NexusNarrativeCard = React.forwardRef<HTMLDivElement, NexusNarrativeCardProps>(
  ({ icon: Icon, title, description, accent = "brand", className, ...props }, ref) => {
    const accentColors = {
      brand: {
        bg: "bg-[hsl(var(--nx-brand-900)/0.08)]",
        icon: "text-[hsl(var(--nx-brand-900))]",
        border: "border-[hsl(var(--nx-brand-900)/0.15)]",
      },
      coop: {
        bg: "bg-[hsl(var(--nx-coop-600)/0.08)]",
        icon: "text-[hsl(var(--nx-coop-600))]",
        border: "border-[hsl(var(--nx-coop-600)/0.15)]",
      },
      neutral: {
        bg: "bg-[hsl(var(--nx-bg))]",
        icon: "text-[hsl(var(--nx-text-700))]",
        border: "border-[hsl(var(--nx-border))]",
      },
    };

    const colors = accentColors[accent];

    return (
      <NexusCard ref={ref} className={cn("group", className)} {...props}>
        <div className="flex items-start gap-4">
          {Icon && (
            <div className={cn(
              "flex-shrink-0 w-12 h-12 rounded-[var(--nx-radius-md)] flex items-center justify-center border",
              colors.bg,
              colors.border
            )}>
              <Icon className={cn("h-6 w-6", colors.icon)} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-[hsl(var(--nx-text-900))] leading-tight">
              {title}
            </h3>
            {description && (
              <p className="mt-1.5 text-sm text-[hsl(var(--nx-text-500))] leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </NexusCard>
    );
  }
);

NexusNarrativeCard.displayName = "NexusNarrativeCard";

/* ========================================
   ACTION CARD — Avec 1-2 CTAs max
   Pour actions contextuelles
   ======================================== */

interface CardAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary";
}

interface NexusActionCardProps extends Omit<NexusCardProps, 'children'> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  primaryAction?: CardAction;
  secondaryAction?: CardAction;
  accent?: "brand" | "coop" | "neutral";
}

const NexusActionCard = React.forwardRef<HTMLDivElement, NexusActionCardProps>(
  ({ 
    icon: Icon, 
    title, 
    description, 
    primaryAction, 
    secondaryAction,
    accent = "brand",
    className, 
    ...props 
  }, ref) => {
    const accentColors = {
      brand: {
        bg: "bg-[hsl(var(--nx-brand-900)/0.08)]",
        icon: "text-[hsl(var(--nx-brand-900))]",
        border: "border-[hsl(var(--nx-brand-900)/0.15)]",
        button: "bg-[hsl(var(--nx-brand-900))] hover:bg-[hsl(var(--nx-brand-700))] text-white",
      },
      coop: {
        bg: "bg-[hsl(var(--nx-coop-600)/0.08)]",
        icon: "text-[hsl(var(--nx-coop-600))]",
        border: "border-[hsl(var(--nx-coop-600)/0.15)]",
        button: "bg-[hsl(var(--nx-coop-600))] hover:bg-[hsl(var(--nx-coop-500))] text-white",
      },
      neutral: {
        bg: "bg-[hsl(var(--nx-bg))]",
        icon: "text-[hsl(var(--nx-text-700))]",
        border: "border-[hsl(var(--nx-border))]",
        button: "bg-[hsl(var(--nx-text-900))] hover:bg-[hsl(var(--nx-text-700))] text-white",
      },
    };

    const colors = accentColors[accent];

    return (
      <NexusCard ref={ref} className={cn("flex flex-col", className)} {...props}>
        <div className="flex items-start gap-4 flex-1">
          {Icon && (
            <div className={cn(
              "flex-shrink-0 w-12 h-12 rounded-[var(--nx-radius-md)] flex items-center justify-center border",
              colors.bg,
              colors.border
            )}>
              <Icon className={cn("h-6 w-6", colors.icon)} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-[hsl(var(--nx-text-900))] leading-tight">
              {title}
            </h3>
            {description && (
              <p className="mt-1.5 text-sm text-[hsl(var(--nx-text-500))] leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Actions — Max 2 CTAs */}
        {(primaryAction || secondaryAction) && (
          <div className="flex items-center gap-3 mt-5 pt-5 border-t border-[hsl(var(--nx-border))]">
            {primaryAction && (
              <Button
                size="sm"
                className={cn(
                  "rounded-[var(--nx-radius-sm)] transition-all duration-[var(--nx-dur-2)]",
                  colors.button
                )}
                onClick={primaryAction.onClick}
                asChild={!!primaryAction.href}
              >
                {primaryAction.href ? (
                  <a href={primaryAction.href}>{primaryAction.label}</a>
                ) : (
                  primaryAction.label
                )}
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-[var(--nx-radius-sm)] border-[hsl(var(--nx-border))] text-[hsl(var(--nx-text-700))] hover:bg-[hsl(var(--nx-bg))] transition-all duration-[var(--nx-dur-2)]"
                onClick={secondaryAction.onClick}
                asChild={!!secondaryAction.href}
              >
                {secondaryAction.href ? (
                  <a href={secondaryAction.href}>{secondaryAction.label}</a>
                ) : (
                  secondaryAction.label
                )}
              </Button>
            )}
          </div>
        )}
      </NexusCard>
    );
  }
);

NexusActionCard.displayName = "NexusActionCard";

/* ========================================
   LIST CARD — Listes simples
   Pour listes sans décoration excessive
   ======================================== */

interface ListItem {
  icon?: LucideIcon;
  label: string;
  value?: string;
  href?: string;
}

interface NexusListCardProps extends Omit<NexusCardProps, 'children'> {
  title?: string;
  items: ListItem[];
  showDividers?: boolean;
}

const NexusListCard = React.forwardRef<HTMLDivElement, NexusListCardProps>(
  ({ title, items, showDividers = true, className, ...props }, ref) => {
    return (
      <NexusCard ref={ref} padding="sm" className={className} {...props}>
        {title && (
          <h3 className="font-semibold text-base text-[hsl(var(--nx-text-900))] px-2 pb-3 mb-1">
            {title}
          </h3>
        )}
        <ul className="space-y-0.5">
          {items.map((item, index) => {
            const ItemIcon = item.icon;
            const content = (
              <div className="flex items-center justify-between gap-3 px-2 py-2.5 rounded-[var(--nx-radius-sm)] hover:bg-[hsl(var(--nx-bg))] transition-colors duration-[var(--nx-dur-1)]">
                <div className="flex items-center gap-3 min-w-0">
                  {ItemIcon && (
                    <ItemIcon className="h-4 w-4 text-[hsl(var(--nx-text-500))] flex-shrink-0" />
                  )}
                  <span className="text-sm text-[hsl(var(--nx-text-700))] truncate">
                    {item.label}
                  </span>
                </div>
                {item.value && (
                  <span className="text-sm font-medium text-[hsl(var(--nx-text-900))] flex-shrink-0">
                    {item.value}
                  </span>
                )}
              </div>
            );

            return (
              <li key={index}>
                {item.href ? (
                  <a href={item.href} className="block">
                    {content}
                  </a>
                ) : (
                  content
                )}
                {showDividers && index < items.length - 1 && (
                  <div className="mx-2 border-b border-[hsl(var(--nx-border)/0.5)]" />
                )}
              </li>
            );
          })}
        </ul>
      </NexusCard>
    );
  }
);

NexusListCard.displayName = "NexusListCard";

/* ========================================
   STAT CARD — Pour Couche 3 uniquement
   Chiffres contextualisés avec message
   ======================================== */

interface NexusStatCardProps extends Omit<NexusCardProps, 'children'> {
  label: string;
  value: string | number;
  context?: string;
  trend?: "up" | "down" | "stable";
  icon?: LucideIcon;
}

const NexusStatCard = React.forwardRef<HTMLDivElement, NexusStatCardProps>(
  ({ label, value, context, icon: Icon, className, ...props }, ref) => {
    return (
      <NexusCard ref={ref} padding="md" hover="none" className={className} {...props}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-[hsl(var(--nx-text-500))] mb-1">{label}</p>
            <p className="text-2xl font-semibold text-[hsl(var(--nx-text-900))]">{value}</p>
            {context && (
              <p className="text-xs text-[hsl(var(--nx-text-500))] mt-1">{context}</p>
            )}
          </div>
          {Icon && (
            <div className="flex-shrink-0 w-10 h-10 rounded-[var(--nx-radius-sm)] bg-[hsl(var(--nx-bg))] flex items-center justify-center">
              <Icon className="h-5 w-5 text-[hsl(var(--nx-text-500))]" />
            </div>
          )}
        </div>
      </NexusCard>
    );
  }
);

NexusStatCard.displayName = "NexusStatCard";

export { 
  NexusCard, 
  NexusNarrativeCard, 
  NexusActionCard, 
  NexusListCard,
  NexusStatCard 
};
