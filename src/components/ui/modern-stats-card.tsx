
import { LucideIcon } from "lucide-react";
import { ModernCard } from "./modern-card";
import { AnimatedCounter } from "./animated-counter";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ModernStatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  prefix?: string;
  suffix?: string;
  description?: string;
  variant?: "default" | "gradient" | "glass";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ModernStatsCard({
  title,
  value,
  icon: Icon,
  trend,
  prefix,
  suffix,
  description,
  variant = "gradient",
  size = "md",
  className
}: ModernStatsCardProps) {
  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };

  const titleSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  const valueSizes = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl"
  };

  const iconSizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10", 
    lg: "h-12 w-12"
  };

  return (
    <ModernCard 
      variant={variant}
      hover="lift"
      className={cn(sizeClasses[size], "group", className)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className={cn(
            "relative rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/20",
            iconSizes[size]
          )}>
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        
        {trend && (
          <span className={cn(
            "flex items-center gap-1 text-xs font-medium",
            trend.positive ? "text-emerald-500" : "text-red-500"
          )}>
            {trend.positive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trend.value > 0 ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className={cn(
          "font-extrabold text-white drop-shadow-sm group-hover:text-primary transition-colors duration-200",
          valueSizes[size]
        )}>
          <AnimatedCounter 
            value={value}
            prefix={prefix}
            suffix={suffix}
            duration={1200}
          />
        </div>
        
        <h3 className={cn(
          "font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-200",
          titleSizes[size]
        )}>
          {title}
        </h3>
        
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
        
        {trend && (
          <p className="text-xs text-muted-foreground">
            {trend.label}
          </p>
        )}
      </div>
    </ModernCard>
  );
}
