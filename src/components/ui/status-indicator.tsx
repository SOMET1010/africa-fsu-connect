import * as React from "react";
import { Check, X, AlertTriangle, Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status: "loading" | "success" | "error" | "warning" | "info";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  message?: string;
}

const StatusIndicator = React.forwardRef<HTMLDivElement, StatusIndicatorProps>(
  ({ className, status, size = "md", showIcon = true, message, ...props }, ref) => {
    const getStatusConfig = () => {
      switch (status) {
        case "loading":
          return {
            icon: Loader2,
            bgColor: "bg-muted",
            iconColor: "text-muted-foreground",
            animation: "animate-spin"
          };
        case "success":
          return {
            icon: Check,
            bgColor: "bg-green-100 dark:bg-green-900/20",
            iconColor: "text-green-600 dark:text-green-400",
            animation: "animate-scale-in"
          };
        case "error":
          return {
            icon: X,
            bgColor: "bg-destructive/10",
            iconColor: "text-destructive",
            animation: "animate-pulse-glow"
          };
        case "warning":
          return {
            icon: AlertTriangle,
            bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
            iconColor: "text-yellow-600 dark:text-yellow-400",
            animation: "animate-bounce-subtle"
          };
        case "info":
          return {
            icon: Info,
            bgColor: "bg-blue-100 dark:bg-blue-900/20",
            iconColor: "text-blue-600 dark:text-blue-400",
            animation: "animate-fade-in"
          };
        default:
          return {
            icon: Info,
            bgColor: "bg-muted",
            iconColor: "text-muted-foreground",
            animation: ""
          };
      }
    };

    const getSizeConfig = () => {
      switch (size) {
        case "sm":
          return {
            container: "h-6 w-6",
            icon: "h-3 w-3",
            text: "text-xs"
          };
        case "lg":
          return {
            container: "h-12 w-12",
            icon: "h-6 w-6",
            text: "text-base"
          };
        default:
          return {
            container: "h-8 w-8",
            icon: "h-4 w-4",
            text: "text-sm"
          };
      }
    };

    const statusConfig = getStatusConfig();
    const sizeConfig = getSizeConfig();
    const Icon = statusConfig.icon;

    if (message) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200",
            statusConfig.bgColor,
            statusConfig.animation,
            className
          )}
          {...props}
        >
          {showIcon && (
            <Icon className={cn(sizeConfig.icon, statusConfig.iconColor, statusConfig.animation)} />
          )}
          <span className={cn(sizeConfig.text, statusConfig.iconColor)}>
            {message}
          </span>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center rounded-full transition-all duration-200",
          statusConfig.bgColor,
          sizeConfig.container,
          statusConfig.animation,
          className
        )}
        {...props}
      >
        {showIcon && (
          <Icon className={cn(sizeConfig.icon, statusConfig.iconColor, statusConfig.animation)} />
        )}
      </div>
    );
  }
);

StatusIndicator.displayName = "StatusIndicator";

export { StatusIndicator };