import { TrendingUp } from "lucide-react";
import { DashboardWidget } from "../DashboardWidget";
import { Button } from "@/components/ui/button";

interface Activity {
  title: string;
  description: string;
  time: string;
  type: 'project' | 'report' | 'training';
}

interface RecentActivityWidgetProps {
  id: string;
  activities: Activity[];
  onRemove?: (id: string) => void;
  onViewAll?: () => void;
  onActivityClick?: (activity: Activity) => void;
}

export const RecentActivityWidget = ({ 
  id, 
  activities, 
  onRemove,
  onViewAll,
  onActivityClick 
}: RecentActivityWidgetProps) => {
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'project': return 'bg-primary';
      case 'report': return 'bg-[hsl(var(--fsu-gold))]';
      case 'training': return 'bg-secondary';
      default: return 'bg-muted-foreground';
    }
  };

  return (
    <DashboardWidget
      id={id}
      title="Activités Récentes"
      icon={<TrendingUp className="h-5 w-5 text-[hsl(var(--fsu-blue))]" />}
      isRemovable
      onRemove={onRemove}
    >
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={index} 
            className="flex space-x-3 p-2 rounded-lg transition-all duration-200 
              hover:bg-muted/50 cursor-pointer group"
            onClick={() => onActivityClick?.(activity)}
          >
            <div className="flex-shrink-0">
              <div className={`w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.type)}`} />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {activity.title}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {onViewAll && (
        <Button 
          variant="outline" 
          className="w-full mt-4 transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
          onClick={onViewAll}
        >
          Voir toutes les activités
        </Button>
      )}
    </DashboardWidget>
  );
};