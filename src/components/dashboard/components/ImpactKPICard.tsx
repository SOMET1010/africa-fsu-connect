import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ImpactKPICardProps {
  title: string;
  value: string | number;
  target?: number;
  targetLabel?: string;
  trend?: number;
  trendLabel?: string;
  icon: LucideIcon;
  color?: "primary" | "success" | "warning" | "info" | "accent";
  format?: "number" | "percentage" | "currency" | "population";
  delay?: number;
}

const formatValue = (value: string | number, format?: string): string => {
  if (typeof value === "string") return value;
  
  switch (format) {
    case "percentage":
      return `${value}%`;
    case "currency":
      if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
      if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
      return `$${value.toLocaleString()}`;
    case "population":
      if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
      if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M`;
      if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
      return value.toLocaleString();
    default:
      return value.toLocaleString();
  }
};

const colorClasses = {
  primary: "bg-primary/10 text-primary border-primary/20",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  info: "bg-info/10 text-info border-info/20",
  accent: "bg-accent/10 text-accent border-accent/20",
};

const iconColorClasses = {
  primary: "bg-primary text-primary-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  info: "bg-info text-info-foreground",
  accent: "bg-accent text-accent-foreground",
};

export const ImpactKPICard = ({
  title,
  value,
  target,
  targetLabel = "Objectif",
  trend,
  trendLabel,
  icon: Icon,
  color = "primary",
  format,
  delay = 0,
}: ImpactKPICardProps) => {
  const formattedValue = formatValue(value, format);
  const progress = target && typeof value === "number" ? Math.min((value / target) * 100, 100) : null;

  const getTrendIcon = () => {
    if (!trend) return <Minus className="h-3 w-3" />;
    return trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />;
  };

  const getTrendColor = () => {
    if (!trend) return "text-muted-foreground";
    return trend > 0 ? "text-success" : "text-destructive";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
    >
      <Card className="premium-card hover-lift">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className={cn("p-2.5 rounded-xl", iconColorClasses[color])}>
              <Icon className="h-5 w-5" />
            </div>
            {trend !== undefined && (
              <div className={cn("flex items-center gap-1 text-sm font-medium", getTrendColor())}>
                {getTrendIcon()}
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
          </div>

          <div className="space-y-1 mb-3">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <p className="text-3xl font-bold tracking-tight">{formattedValue}</p>
          </div>

          {progress !== null && target && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{targetLabel}</span>
                <span className="font-medium">{formatValue(target, format)}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={cn("h-full rounded-full", `bg-${color}`)}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, delay: delay * 0.1 + 0.3 }}
                  style={{ backgroundColor: `hsl(var(--${color}))` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right">
                {progress.toFixed(0)}% {trendLabel || "atteint"}
              </p>
            </div>
          )}

          {!progress && trendLabel && (
            <p className="text-xs text-muted-foreground">{trendLabel}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
