import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { LucideIcon } from "lucide-react";

interface GradientHeroSectionProps {
  title: string;
  subtitle?: string;
  description: string;
  variant?: "blue" | "green" | "purple" | "orange" | "custom";
  className?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "default" | "secondary" | "outline";
    icon?: LucideIcon;
  }>;
  children?: React.ReactNode;
}

const GradientHeroSection: React.FC<GradientHeroSectionProps> = ({
  title,
  subtitle,
  description,
  variant = "blue",
  className,
  actions = [],
  children
}) => {
  const getGradientClasses = () => {
    switch (variant) {
      case "blue":
        return "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800";
      case "green":
        return "bg-gradient-to-br from-green-600 via-green-700 to-green-800";
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
      "relative overflow-hidden rounded-3xl text-white p-8 lg:p-12",
      getGradientClasses(),
      className
    )}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-32 translate-x-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl translate-y-16 -translate-x-16" />
      
      <div className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            {subtitle && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20">
                <span className="text-sm font-medium text-white/90">{subtitle}</span>
              </div>
            )}
            
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              {title}
            </h1>
            
            <p className="text-lg lg:text-xl text-white/90 leading-relaxed">
              {description}
            </p>
            
            {actions.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={action.onClick}
                    variant={action.variant || "secondary"}
                    size="lg"
                    className={cn(
                      "font-semibold transition-all duration-200",
                      action.variant === "outline" 
                        ? "border-white/30 text-white hover:bg-white/10" 
                        : action.variant === "secondary"
                        ? "bg-white text-gray-900 hover:bg-white/90"
                        : ""
                    )}
                  >
                    {action.icon && <action.icon className="w-5 h-5 mr-2" />}
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
          
          {children && (
            <div className="relative">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { GradientHeroSection };