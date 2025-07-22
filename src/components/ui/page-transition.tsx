
import * as React from "react";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "fade" | "slide" | "scale" | "blur";
  direction?: "up" | "down" | "left" | "right";
  duration?: "fast" | "normal" | "slow";
  delay?: number;
}

export function PageTransition({
  children,
  className,
  variant = "fade",
  direction = "up",
  duration = "normal",
  delay = 0
}: PageTransitionProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const durations = {
    fast: "duration-300",
    normal: "duration-500",
    slow: "duration-700"
  };

  const getInitialClasses = () => {
    if (isVisible) return "opacity-100 translate-x-0 translate-y-0 scale-100 blur-0";
    
    switch (variant) {
      case "slide":
        switch (direction) {
          case "up": return "opacity-0 translate-y-8";
          case "down": return "opacity-0 -translate-y-8";
          case "left": return "opacity-0 translate-x-8";
          case "right": return "opacity-0 -translate-x-8";
        }
        break;
      case "scale":
        return "opacity-0 scale-95";
      case "blur":
        return "opacity-0 blur-sm";
      default:
        return "opacity-0";
    }
  };

  return (
    <div
      className={cn(
        "transition-all ease-out",
        durations[duration],
        getInitialClasses(),
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
