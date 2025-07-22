
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ProfessionalCardProps {
  title: string;
  description?: string | React.ReactNode;
  icon?: LucideIcon;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  children?: React.ReactNode;
  actions?: React.ReactNode;
  variant?: "default" | "featured" | "minimal" | "elevated";
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

const ProfessionalCard = React.forwardRef<
  HTMLDivElement,
  ProfessionalCardProps
>(({
  title,
  description,
  icon: Icon,
  badge,
  badgeVariant = "secondary",
  children,
  actions,
  variant = "default",
  size = "md",
  interactive = false,
  onClick,
  className,
  ...props
}, ref) => {
  const variantClasses = {
    default: "bg-card border border-border hover:border-primary/30",
    featured: "bg-gradient-to-br from-card to-card/80 border border-primary/20 shadow-elegant",
    minimal: "bg-transparent border border-border/50",
    elevated: "bg-card border border-border shadow-lg hover:shadow-xl"
  };

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };

  return (
    <Card
      ref={ref}
      className={cn(
        "transition-all duration-200 animate-fade-in-up",
        variantClasses[variant],
        interactive && "cursor-pointer hover:shadow-md hover:-translate-y-1",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <CardHeader className={cn("flex flex-row items-start justify-between space-y-0", sizeClasses[size])}>
        <div className="flex items-start space-x-3 flex-1">
          {Icon && (
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
          
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg font-semibold leading-tight">
                {title}
              </CardTitle>
              {badge && (
                <Badge variant={badgeVariant} className="text-xs">
                  {badge}
                </Badge>
              )}
            </div>
            {description && (
              <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
        
        {actions && (
          <div className="flex items-center space-x-2 flex-shrink-0">
            {actions}
          </div>
        )}
      </CardHeader>
      
      {children && (
        <CardContent className={cn("pt-0", sizeClasses[size])}>
          {children}
        </CardContent>
      )}
    </Card>
  );
});

ProfessionalCard.displayName = "ProfessionalCard";

export { ProfessionalCard };
