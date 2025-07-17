import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, X, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface DashboardWidgetProps {
  id: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  isRemovable?: boolean;
  isConfigurable?: boolean;
  onRemove?: (id: string) => void;
  onConfigure?: (id: string) => void;
  className?: string;
}

export const DashboardWidget = ({
  id,
  title,
  icon,
  children,
  isRemovable = false,
  isConfigurable = false,
  onRemove,
  onConfigure,
  className = ""
}: DashboardWidgetProps) => {
  const showActions = isRemovable || isConfigurable;

  return (
    <Card className={`border-border transition-all duration-200 hover:shadow-md ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center text-sm font-medium">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </CardTitle>
        
        {showActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {isConfigurable && (
                <DropdownMenuItem onClick={() => onConfigure?.(id)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurer
                </DropdownMenuItem>
              )}
              {isRemovable && (
                <DropdownMenuItem 
                  onClick={() => onRemove?.(id)}
                  className="text-destructive focus:text-destructive"
                >
                  <X className="mr-2 h-4 w-4" />
                  Masquer
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};