
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ModernButton } from "./modern-button";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  children?: ReactNode;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "ghost";
    icon?: ReactNode;
  }>;
  backgroundPattern?: boolean;
  className?: string;
}

export function HeroSection({
  title,
  subtitle,
  description,
  children,
  actions,
  backgroundPattern = true,
  className
}: HeroSectionProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-3xl border border-border/50",
      "bg-gradient-to-br from-card via-card/95 to-card/90",
      "shadow-2xl",
      className
    )}>
      {backgroundPattern && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      )}
      
      <div className="relative z-10 p-8 md:p-12 lg:p-16">
        <div className="max-w-4xl">
          {subtitle && (
            <div className="mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                {subtitle}
              </span>
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          
          {description && (
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl">
              {description}
            </p>
          )}
          
          {actions && actions.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-8">
              {actions.map((action, index) => (
                <ModernButton
                  key={index}
                  variant={action.variant || "default"}
                  size="lg"
                  onClick={action.onClick}
                  className="flex items-center gap-2"
                >
                  {action.icon}
                  {action.label}
                </ModernButton>
              ))}
            </div>
          )}
          
          {children}
        </div>
      </div>
    </div>
  );
}
