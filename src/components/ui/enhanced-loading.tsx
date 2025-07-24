import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2, Sparkles, Zap } from "lucide-react";

interface EnhancedLoadingProps {
  variant?: "spinner" | "dots" | "pulse" | "wave" | "sparkle";
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const EnhancedLoading: React.FC<EnhancedLoadingProps> = ({
  variant = "spinner",
  size = "md",
  text,
  className,
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  const renderLoader = () => {
    switch (variant) {
      case "spinner":
        return (
          <Loader2 
            className={cn(
              "animate-spin text-primary",
              sizeClasses[size]
            )} 
          />
        );

      case "dots":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "bg-primary rounded-full animate-pulse",
                  size === "sm" && "w-1 h-1",
                  size === "md" && "w-2 h-2",
                  size === "lg" && "w-3 h-3"
                )}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1s"
                }}
              />
            ))}
          </div>
        );

      case "pulse":
        return (
          <div 
            className={cn(
              "bg-primary/20 rounded-full animate-ping",
              sizeClasses[size]
            )}
          />
        );

      case "wave":
        return (
          <div className="flex items-center space-x-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  "bg-primary rounded-sm animate-pulse",
                  size === "sm" && "w-0.5 h-3",
                  size === "md" && "w-1 h-4",
                  size === "lg" && "w-1.5 h-6"
                )}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "0.8s"
                }}
              />
            ))}
          </div>
        );

      case "sparkle":
        return (
          <div className="relative">
            <Sparkles 
              className={cn(
                "animate-pulse text-primary",
                sizeClasses[size]
              )} 
            />
            <div className="absolute inset-0 animate-ping">
              <Zap 
                className={cn(
                  "text-primary/50",
                  sizeClasses[size]
                )} 
              />
            </div>
          </div>
        );

      default:
        return (
          <Loader2 
            className={cn(
              "animate-spin text-primary",
              sizeClasses[size]
            )} 
          />
        );
    }
  };

  const content = (
    <div className={cn(
      "flex flex-col items-center justify-center gap-3",
      className
    )}>
      {renderLoader()}
      {text && (
        <p className={cn(
          "text-muted-foreground font-medium",
          size === "sm" && "text-sm",
          size === "md" && "text-base",
          size === "lg" && "text-lg"
        )}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

export { EnhancedLoading };