import { useEffect } from "react";
import { useGlobalLoading } from "@/contexts/LoadingContext";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface GlobalLoadingIndicatorProps {
  className?: string;
  showProgress?: boolean;
}

export function GlobalLoadingIndicator({ 
  className,
  showProgress = true 
}: GlobalLoadingIndicatorProps) {
  const { isAnyLoading, loadingStates } = useGlobalLoading();
  
  const activeLoadingCount = Object.values(loadingStates).filter(Boolean).length;
  const totalLoadingKeys = Object.keys(loadingStates).length;
  const progress = totalLoadingKeys > 0 ? ((totalLoadingKeys - activeLoadingCount) / totalLoadingKeys) * 100 : 0;

  if (!isAnyLoading()) return null;

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-background",
      className
    )}>
      {showProgress ? (
        <Progress value={progress} className="w-full h-1 rounded-none" />
      ) : (
        <div className="h-1 bg-primary animate-pulse" />
      )}
      
      <div className="flex items-center justify-center p-2">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Chargement...</span>
        </div>
      </div>
    </div>
  );
}

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({ 
  isVisible, 
  message = "Chargement...",
  className 
}: LoadingOverlayProps) {
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 bg-background/95",
      "flex items-center justify-center",
      className
    )}>
      <div className="flex flex-col items-center space-y-4 p-8 bg-card rounded-lg border shadow-lg">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}