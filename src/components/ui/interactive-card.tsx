import * as React from "react";
import { cn } from "@/lib/utils";
import { useMicroInteractions } from "@/hooks/useMicroInteractions";
import { Card } from "./card";

interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "elevated" | "glow";
  interactive?: boolean;
  hapticFeedback?: boolean;
  children: React.ReactNode;
}

const InteractiveCard = React.forwardRef<HTMLDivElement, InteractiveCardProps>(
  ({ 
    className, 
    variant = "default", 
    interactive = true, 
    hapticFeedback = false,
    children,
    ...props 
  }, ref) => {
    const { getInteractionProps } = useMicroInteractions();

    const variantClasses = {
      default: "bg-card border border-border/50",
      subtle: "bg-card/50 border border-border/30 backdrop-blur-sm",
      elevated: "bg-card border border-border/50 shadow-lg",
      glow: "bg-card border border-primary/20 shadow-[0_0_20px_rgba(var(--primary)_/_0.1)]"
    };

    const interactionProps = interactive 
      ? getInteractionProps({ haptic: hapticFeedback })
      : {};

    return (
      <Card
        ref={ref}
        className={cn(
          "transition-all duration-300 ease-out",
          variantClasses[variant],
          interactive && [
            "cursor-pointer",
            "hover:shadow-md hover:border-border",
            "active:scale-[0.98]",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          ],
          className
        )}
        {...interactionProps}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

InteractiveCard.displayName = "InteractiveCard";

export { InteractiveCard };