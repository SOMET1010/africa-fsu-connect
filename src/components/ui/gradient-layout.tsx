import * as React from "react";
import { cn } from "@/lib/utils";

interface GradientLayoutProps {
  children: React.ReactNode;
  variant?: "blue" | "green" | "purple" | "orange" | "custom";
  className?: string;
  contentClassName?: string;
  fullHeight?: boolean;
}

const GradientLayout: React.FC<GradientLayoutProps> = ({
  children,
  variant = "blue",
  className,
  contentClassName,
  fullHeight = false
}) => {
  const getGradientClasses = () => {
    switch (variant) {
      case "blue":
        return "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800";
      case "green":
        return "bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800";
      case "purple":
        return "bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800";
      case "orange":
        return "bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800";
      default:
        return "bg-gradient-to-br from-primary via-primary-dark to-accent";
    }
  };

  return (
    <div className={cn(
      "relative overflow-hidden",
      getGradientClasses(),
      fullHeight && "min-h-screen",
      className
    )}>
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-32" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-2xl translate-y-16" />
      <div className="absolute top-1/2 left-0 w-32 h-32 bg-white/5 rounded-full blur-xl -translate-x-16" />
      
      <div className={cn("relative z-10", contentClassName)}>
        {children}
      </div>
    </div>
  );
};

export { GradientLayout };