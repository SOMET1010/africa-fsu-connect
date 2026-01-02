import { useState } from "react";
import { ThemeIllustration, ThemeType } from "@/components/shared/ThemeIllustration";
import { cn } from "@/lib/utils";

interface PracticeCoverProps {
  imageUrl?: string;
  theme: ThemeType;
  height?: "sm" | "md" | "lg" | "xl";
  overlay?: boolean;
  overlayGradient?: "default" | "nexus";
  className?: string;
}

const heightMap = {
  sm: "h-32",
  md: "h-40",
  lg: "h-48",
  xl: "h-56",
};

export function PracticeCover({
  imageUrl,
  theme,
  height = "md",
  overlay = false,
  overlayGradient = "default",
  className,
}: PracticeCoverProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const showImage = imageUrl && !imageError;
  const heightClass = heightMap[height];
  
  const overlayClass = overlayGradient === "nexus" 
    ? "bg-gradient-to-br from-nx-night/70 via-nx-network/30 to-nx-gold/40"
    : "bg-gradient-to-t from-black/60 via-black/20 to-transparent";

  return (
    <div className={cn("relative overflow-hidden", heightClass, className)}>
      {/* Real image */}
      {showImage && (
        <>
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          <img
            src={imageUrl}
            alt=""
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        </>
      )}

      {/* Fallback: ThemeIllustration */}
      {!showImage && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted">
          <ThemeIllustration
            theme={theme}
            size="lg"
            showBackground={false}
            className="opacity-90"
          />
        </div>
      )}

      {/* Optional overlay gradient for text readability */}
      {overlay && (
        <div className={cn("absolute inset-0", overlayClass)} />
      )}
    </div>
  );
}
