import * as React from "react";
import { Plus, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FABAction {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface FloatingActionButtonProps {
  actions?: FABAction[];
  primaryAction?: () => void;
  primaryLabel?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  className?: string;
}

export function FloatingActionButton({
  actions = [],
  primaryAction,
  primaryLabel = "Add",
  position = "bottom-right",
  className
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "bottom-6 left-6";
      case "top-right":
        return "top-6 right-6";
      case "top-left":
        return "top-6 left-6";
      default:
        return "bottom-6 right-6";
    }
  };

  const handlePrimaryClick = () => {
    if (actions.length > 0) {
      setIsExpanded(!isExpanded);
    } else if (primaryAction) {
      primaryAction();
    }
  };

  return (
    <TooltipProvider>
      <div className={cn("fixed z-50", getPositionClasses(), className)}>
        <div className="flex flex-col items-end gap-2">
          {/* Secondary Actions */}
          {isExpanded && actions.length > 0 && (
            <div className="flex flex-col gap-2 animate-fade-in">
              {actions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="secondary"
                        className={cn(
                          "h-12 w-12 rounded-full shadow-medium",
                          "transition-all duration-200 hover:scale-105",
                          "animate-scale-in"
                        )}
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => {
                          action.onClick();
                          setIsExpanded(false);
                        }}
                        disabled={action.disabled}
                        aria-label={action.label}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>{action.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          )}

          {/* Primary Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="lg"
                className={cn(
                  "h-14 w-14 rounded-full shadow-strong",
                  "transition-all duration-200 hover:scale-105 hover:shadow-lg",
                  "bg-primary hover:bg-primary/90",
                  isExpanded && "rotate-45"
                )}
                onClick={handlePrimaryClick}
                aria-label={isExpanded ? "Close actions menu" : primaryLabel}
                aria-expanded={actions.length > 0 ? isExpanded : undefined}
              >
                {isExpanded && actions.length > 0 ? (
                  <ChevronUp className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Plus className="h-6 w-6" aria-hidden="true" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{primaryLabel}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}