
import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glassmorphism" | "elevated" | "minimal" | "gradient";
  hover?: "lift" | "glow" | "scale" | "none";
  interactive?: boolean;
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(({
  className,
  variant = "default",
  hover = "lift",
  interactive = false,
  children,
  ...props
}, ref) => {
  const variants = {
    default: "bg-card border border-border",
    glassmorphism: "bg-card border border-border shadow-sm",
    elevated: "bg-card border border-border shadow-sm",
    minimal: "bg-transparent border-0",
    gradient: "bg-card border border-border"
  };

  const hoverEffects = {
    lift: "hover:-translate-y-1 hover:shadow-md",
    glow: "hover:shadow-md",
    scale: "hover:scale-[1.01]",
    none: ""
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl transition-all duration-300",
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

EnhancedCard.displayName = "EnhancedCard";

interface IconCardProps extends EnhancedCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  iconColor?: string;
  badge?: React.ReactNode;
}

export const IconCard = React.forwardRef<HTMLDivElement, IconCardProps>(({
  icon: Icon,
  title,
  description,
  iconColor = "text-primary",
  badge,
  className,
  children,
  ...props
}, ref) => {
  return (
    <EnhancedCard
      ref={ref}
      className={cn("p-6", className)}
      {...props}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>
        {badge}
      </div>
      {children}
    </EnhancedCard>
  );
});

IconCard.displayName = "IconCard";

export { EnhancedCard };
