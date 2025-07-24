import * as React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

interface SmartSkeletonProps {
  variant?: "text" | "avatar" | "card" | "table" | "dashboard" | "custom";
  lines?: number;
  width?: string | number;
  height?: string | number;
  className?: string;
  animated?: boolean;
}

const SmartSkeleton: React.FC<SmartSkeletonProps> = ({
  variant = "text",
  lines = 3,
  width,
  height,
  className,
  animated = true
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "avatar":
        return "rounded-full w-10 h-10";
      case "card":
        return "rounded-lg w-full h-32";
      case "table":
        return "rounded-sm w-full h-4";
      case "dashboard":
        return "rounded-lg w-full h-24";
      default:
        return "rounded w-full h-4";
    }
  };

  const renderSkeleton = () => {
    const baseClasses = cn(
      getVariantClasses(),
      animated && "animate-pulse",
      className
    );

    const style = {
      width: width,
      height: height
    };

    if (variant === "text") {
      return (
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, index) => (
            <Skeleton
              key={index}
              className={cn(
                baseClasses,
                index === lines - 1 && "w-3/4" // Last line shorter
              )}
              style={style}
            />
          ))}
        </div>
      );
    }

    if (variant === "card") {
      return (
        <div className="space-y-3">
          <Skeleton className={cn(baseClasses, "h-32")} style={style} />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      );
    }

    if (variant === "dashboard") {
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Skeleton className="rounded-full w-8 h-8" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className={cn(baseClasses, "h-40")} style={style} />
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </div>
      );
    }

    if (variant === "table") {
      return (
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, index) => (
            <div key={index} className="grid grid-cols-4 gap-4">
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      );
    }

    return <Skeleton className={baseClasses} style={style} />;
  };

  return renderSkeleton();
};

export { SmartSkeleton };