import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface GradientStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "blue" | "green" | "purple" | "orange" | "teal" | "custom";
  className?: string;
  size?: "sm" | "md" | "lg";
}

const GradientStatsCard: React.FC<GradientStatsCardProps> = ({
  title,
  value,
  icon: Icon,
  variant = "blue",
  className,
  size = "md"
}) => {
  const getGradientClasses = () => {
    switch (variant) {
      case "blue":
        return "bg-gradient-to-br from-primary/20 via-primary/30 to-primary-dark/20 border-primary/30";
      case "green":
        return "bg-gradient-to-br from-emerald-500/20 via-emerald-600/20 to-emerald-700/20 border-emerald-500/30";
      case "purple":
        return "bg-gradient-to-br from-purple-500/20 via-purple-600/20 to-purple-700/20 border-purple-500/30";
      case "orange":
        return "bg-gradient-to-br from-orange-500/20 via-orange-600/20 to-orange-700/20 border-orange-500/30";
      case "teal":
        return "bg-gradient-to-br from-teal-500/20 via-cyan-600/20 to-cyan-700/20 border-teal-500/30";
      default:
        return "bg-gradient-to-br from-primary/20 via-primary/30 to-accent/20 border-primary/30";
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "blue":
        return "text-primary";
      case "green":
        return "text-emerald-600";
      case "purple":
        return "text-purple-600";
      case "orange":
        return "text-orange-600";
      case "teal":
        return "text-teal-600";
      default:
        return "text-primary";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "p-4";
      case "lg":
        return "p-8";
      default:
        return "p-6";
    }
  };

  const getValueSize = () => {
    switch (size) {
      case "sm":
        return "text-2xl";
      case "lg":
        return "text-5xl";
      default:
        return "text-4xl";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "w-6 h-6";
      case "lg":
        return "w-10 h-10";
      default:
        return "w-8 h-8";
    }
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 hover:shadow-lg group",
      getGradientClasses(),
      getSizeClasses(),
      className
    )}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-xl -translate-y-6 translate-x-6" />
      
      <div className="relative z-10 text-center space-y-3">
        <div className="flex justify-center">
          <div className={cn(
            "p-3 rounded-xl bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors duration-300",
            size === "sm" ? "p-2" : size === "lg" ? "p-4" : "p-3"
          )}>
            <Icon className={cn(getIconSize(), getIconColor())} />
          </div>
        </div>
        
        <div className={cn(
          "font-bold text-white",
          getValueSize()
        )}>
          {value}
        </div>
        
        <div className={cn(
          "text-white/80 font-medium",
          size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base"
        )}>
          {title}
        </div>
      </div>
    </div>
  );
};

export { GradientStatsCard };