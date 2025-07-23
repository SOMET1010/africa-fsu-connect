
import * as React from "react";
import { Plus, ChevronUp, X } from "lucide-react";
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
    <div className={cn("fixed z-50", getPositionClasses(), className)}>
      {/* Secondary actions */}
      {actions && isExpanded && (
        <div className="space-y-2 mb-4">
          {actions.map((action, index) => (
            <div key={index} className="flex justify-end">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    onClick={() => {
                      action.onClick();
                      setIsExpanded(false);
                    }}
                  >
                    <action.icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{action.label}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
        </div>
      )}

      {/* Main button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="lg"
            className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={primaryAction || (() => setIsExpanded(!isExpanded))}
          >
            {actions && actions.length > 0 ? (
              isExpanded ? (
                <X className="h-6 w-6" />
              ) : (
                <Plus className="h-6 w-6" />
              )
            ) : (
              <Plus className="h-6 w-6" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{primaryLabel}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
