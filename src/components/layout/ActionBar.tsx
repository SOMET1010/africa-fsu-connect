
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ActionBarProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "minimal";
  position?: "top" | "bottom" | "floating";
}

export const ActionBar = ({
  children,
  className,
  variant = "default",
  position = "bottom"
}: ActionBarProps) => {
  const variantClasses = {
    default: "bg-muted/30 border-t border-border",
    elevated: "bg-background border border-border shadow-md",
    minimal: "bg-transparent"
  };

  const positionClasses = {
    top: "border-b border-t-0",
    bottom: "border-t",
    floating: "rounded-lg shadow-lg border"
  };

  return (
    <div className={cn(
      "action-bar flex items-center justify-between gap-4 p-4",
      variantClasses[variant],
      positionClasses[position],
      position === "floating" && "m-4",
      className
    )}>
      {children}
    </div>
  );
};
