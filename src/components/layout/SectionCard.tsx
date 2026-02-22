
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SectionCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "gradient" | "bordered" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
  headerActions?: ReactNode;
}

export const SectionCard = ({
  title,
  description,
  children,
  className,
  variant = "default",
  padding = "md",
  headerActions
}: SectionCardProps) => {
  const variantClasses = {
    default: "bg-card border border-border",
    gradient: "bg-gradient-to-br from-card to-card/80 border border-border/50",
    bordered: "bg-card border-2 border-primary/20",
    elevated: "bg-card border border-border shadow-elegant hover:shadow-lg transition-shadow duration-200"
  };

  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-6",
    lg: "p-8"
  };

  return (
    <Card className={cn(
      "section-card animate-fade-in-up",
      variantClasses[variant],
      className
    )}>
      {(title || description || headerActions) && (
        <CardHeader className={cn(
          "flex flex-row items-center justify-between space-y-0 border-b border-border",
          padding !== "none" && "pb-4"
        )}>
          <div className="space-y-1">
            {title && (
              <CardTitle className="text-lg font-semibold">
                {title}
              </CardTitle>
            )}
            {description && (
              <CardDescription className="text-sm text-muted-foreground">
                {description}
              </CardDescription>
            )}
          </div>
          {headerActions && (
            <div className="flex items-center space-x-2">
              {headerActions}
            </div>
          )}
        </CardHeader>
      )}
      
      <CardContent className={cn(
        title || description || headerActions ? "pt-0" : "",
        paddingClasses[padding]
      )}>
        {children}
      </CardContent>
    </Card>
  );
};
