
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  badge?: string;
  showBackButton?: boolean;
  className?: string;
  gradient?: boolean;
}

export const PageHeader = ({
  title,
  description,
  actions,
  badge,
  showBackButton = false,
  className,
  gradient = false
}: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className={cn(
      "page-header border-b border-border bg-background/95 backdrop-blur-sm",
      className
    )}>
      <div className="page-container py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            
            <div className="space-y-1.5">
              <div className="flex items-center space-x-3">
                <h1 className={cn(
                  "text-2xl font-bold tracking-tight text-foreground",
                  gradient && "gradient-text"
                )}>
                  {title}
                </h1>
                {badge && (
                  <Badge variant="secondary" className="text-xs font-medium">
                    {badge}
                  </Badge>
                )}
              </div>
              {description && (
                <p className="text-base text-muted-foreground max-w-2xl">
                  {description}
                </p>
              )}
            </div>
          </div>
          
          {actions && (
            <div className="flex items-center space-x-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
