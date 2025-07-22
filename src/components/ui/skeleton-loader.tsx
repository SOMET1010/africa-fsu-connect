
import * as React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "card" | "text" | "avatar" | "button" | "chart";
  lines?: number;
  width?: string;
  height?: string;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(({
  className,
  variant = "default",
  lines = 1,
  width,
  height,
  ...props
}, ref) => {
  const baseClasses = "animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] rounded-md";
  
  const variantClasses = {
    default: "h-4 w-full",
    card: "h-32 w-full",
    text: "h-3 w-full",
    avatar: "h-10 w-10 rounded-full",
    button: "h-10 w-24",
    chart: "h-64 w-full"
  };

  if (variant === "text" && lines > 1) {
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses.text,
              index === lines - 1 && "w-3/4" // Last line is shorter
            )}
            style={{ width: index === lines - 1 ? "75%" : width, height }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(baseClasses, variantClasses[variant], className)}
      style={{ width, height }}
      {...props}
    />
  );
});

Skeleton.displayName = "Skeleton";

// Preset skeleton layouts
export const SkeletonCard = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("border rounded-lg p-6 space-y-4", className)} {...props}>
    <div className="flex items-center space-x-3">
      <Skeleton variant="avatar" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
    <Skeleton variant="text" lines={3} />
    <div className="flex space-x-2">
      <Skeleton variant="button" />
      <Skeleton variant="button" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, ...props }: { rows?: number } & React.HTMLAttributes<HTMLDivElement>) => (
  <div className="space-y-3" {...props}>
    <div className="flex space-x-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex space-x-4">
        {Array.from({ length: 4 }).map((_, j) => (
          <Skeleton key={j} className="h-3 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export { Skeleton };
