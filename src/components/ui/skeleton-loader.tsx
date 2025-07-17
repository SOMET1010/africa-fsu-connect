import * as React from "react";
import { cn } from "@/lib/utils";

interface SkeletonLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "card" | "text" | "avatar" | "button" | "table";
  rows?: number;
}

const SkeletonLoader = React.forwardRef<HTMLDivElement, SkeletonLoaderProps>(
  ({ className, variant = "text", rows = 3, ...props }, ref) => {
    const renderSkeleton = () => {
      switch (variant) {
        case "card":
          return (
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded-md animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]" />
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]" />
                <div className="h-3 bg-muted rounded w-3/4 animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]" />
              </div>
            </div>
          );
        
        case "avatar":
          return (
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-muted rounded-full animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]" />
                <div className="h-3 bg-muted rounded w-3/4 animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]" />
              </div>
            </div>
          );
        
        case "button":
          return (
            <div className="h-10 bg-muted rounded-md w-24 animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]" />
          );
        
        case "table":
          return (
            <div className="space-y-2">
              {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="h-4 bg-muted rounded flex-1 animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]" />
                  <div className="h-4 bg-muted rounded flex-1 animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]" />
                  <div className="h-4 bg-muted rounded w-20 animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]" />
                </div>
              ))}
            </div>
          );
        
        default:
          return (
            <div className="space-y-2">
              {Array.from({ length: rows }).map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-4 bg-muted rounded animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]",
                    i === rows - 1 && "w-3/4"
                  )} 
                />
              ))}
            </div>
          );
      }
    };

    return (
      <div
        ref={ref}
        className={cn("animate-fade-in", className)}
        {...props}
      >
        {renderSkeleton()}
      </div>
    );
  }
);

SkeletonLoader.displayName = "SkeletonLoader";

export { SkeletonLoader };