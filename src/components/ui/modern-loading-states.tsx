
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ModernSkeletonProps {
  className?: string;
  variant?: "default" | "rounded" | "circular";
}

export function ModernSkeleton({
  className,
  variant = "default"
}: ModernSkeletonProps) {
  const variantClasses = {
    default: "rounded-md",
    rounded: "rounded-lg",
    circular: "rounded-full"
  };

  return (
    <div className={cn(
      "animate-pulse bg-gradient-to-r from-muted/50 via-muted/80 to-muted/50",
      "bg-[length:200%_100%] animate-[shimmer_2s_infinite]",
      variantClasses[variant],
      className
    )} />
  );
}

interface ModernLoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ModernLoadingSpinner({
  size = "md",
  className
}: ModernLoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <Loader2 className={cn(
      "animate-spin text-primary",
      sizeClasses[size],
      className
    )} />
  );
}

interface ModernLoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

export function ModernLoadingOverlay({
  isVisible,
  message = "Chargement...",
  className
}: ModernLoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center",
      "bg-background/80 backdrop-blur-sm animate-fade-in",
      className
    )}>
      <div className="flex flex-col items-center space-y-4 p-8 bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 shadow-lg">
        <ModernLoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground font-medium">{message}</p>
      </div>
    </div>
  );
}

interface ModernCardSkeletonProps {
  className?: string;
}

export function ModernCardSkeleton({
  className
}: ModernCardSkeletonProps) {
  return (
    <div className={cn(
      "p-6 space-y-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50",
      className
    )}>
      <div className="flex items-start space-x-4">
        <ModernSkeleton variant="circular" className="h-10 w-10" />
        <div className="space-y-2 flex-1">
          <ModernSkeleton className="h-4 w-3/4" />
          <ModernSkeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <ModernSkeleton className="h-3 w-full" />
        <ModernSkeleton className="h-3 w-4/5" />
        <ModernSkeleton className="h-3 w-3/5" />
      </div>
      <div className="flex items-center space-x-2">
        <ModernSkeleton className="h-6 w-16" />
        <ModernSkeleton className="h-6 w-20" />
      </div>
    </div>
  );
}

interface ModernTableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function ModernTableSkeleton({
  rows = 5,
  columns = 4,
  className
}: ModernTableSkeletonProps) {
  return (
    <div className={cn(
      "space-y-4 p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50",
      className
    )}>
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <ModernSkeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      
      {/* Rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <ModernSkeleton key={colIndex} className="h-3 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
