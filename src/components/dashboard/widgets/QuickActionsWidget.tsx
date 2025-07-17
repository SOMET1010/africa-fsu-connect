import { LucideIcon } from "lucide-react";
import { DashboardWidget } from "../DashboardWidget";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  variant?: "default" | "outline" | "secondary";
  onClick: () => void;
}

interface QuickActionsWidgetProps {
  id: string;
  actions: QuickAction[];
  onRemove?: (id: string) => void;
}

export const QuickActionsWidget = ({ 
  id, 
  actions, 
  onRemove 
}: QuickActionsWidgetProps) => {
  const isMobile = useIsMobile();

  return (
    <DashboardWidget
      id={id}
      title="Actions Rapides"
      isRemovable
      onRemove={onRemove}
    >
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'}`}>
        {actions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant || "outline"}
            className={`flex items-center justify-center space-x-2 transition-all duration-200 
              hover:scale-105 active:scale-95 ${isMobile ? 'h-16 text-sm' : 'h-20'}`}
            onClick={action.onClick}
          >
            <action.icon className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
            <span className={isMobile ? 'text-xs' : 'text-sm'}>{action.label}</span>
          </Button>
        ))}
      </div>
    </DashboardWidget>
  );
};