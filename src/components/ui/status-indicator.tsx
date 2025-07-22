
import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, XCircle, Clock, Info } from "lucide-react";

interface StatusIndicatorProps {
  status: "success" | "warning" | "error" | "pending" | "info";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  label?: string;
  className?: string;
}

export const StatusIndicator = React.forwardRef<
  HTMLDivElement,
  StatusIndicatorProps
>(({
  status,
  size = "md",
  showIcon = true,
  label,
  className,
  ...props
}, ref) => {
  const statusConfig = {
    success: {
      icon: CheckCircle,
      color: "text-success",
      bg: "bg-success/10",
      border: "border-success/20"
    },
    warning: {
      icon: AlertCircle,
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/20"
    },
    error: {
      icon: XCircle,
      color: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-destructive/20"
    },
    pending: {
      icon: Clock,
      color: "text-muted-foreground",
      bg: "bg-muted/10",
      border: "border-muted/20"
    },
    info: {
      icon: Info,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20"
    }
  };

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  if (label) {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center space-x-2 px-2 py-1 rounded-full border",
          config.bg,
          config.border,
          className
        )}
        {...props}
      >
        {showIcon && (
          <Icon className={cn(sizeClasses[size], config.color)} />
        )}
        <span className={cn("text-sm font-medium", config.color)}>
          {label}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full border",
        config.bg,
        config.border,
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {showIcon && (
        <Icon className={cn("h-3 w-3", config.color)} />
      )}
    </div>
  );
});

StatusIndicator.displayName = "StatusIndicator";

export { StatusIndicator };
