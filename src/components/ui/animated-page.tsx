import * as React from "react";
import { cn } from "@/lib/utils";

interface AnimatedPageProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "fade" | "slide" | "scale";
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
}

export function AnimatedPage({
  children,
  className,
  variant = "fade",
  direction = "up",
  delay = 0,
  ...props
}: AnimatedPageProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getAnimationClasses = () => {
    if (!isVisible) {
      switch (variant) {
        case "slide":
          switch (direction) {
            case "up":
              return "translate-y-4 opacity-0";
            case "down":
              return "-translate-y-4 opacity-0";
            case "left":
              return "translate-x-4 opacity-0";
            case "right":
              return "-translate-x-4 opacity-0";
          }
          break;
        case "scale":
          return "scale-95 opacity-0";
        default:
          return "opacity-0";
      }
    }

    return "translate-y-0 translate-x-0 scale-100 opacity-100";
  };

  return (
    <div
      className={cn(
        "transition-all duration-500 ease-out",
        getAnimationClasses(),
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  );
}