import { MapPin } from "lucide-react";
import { DashboardWidget } from "../DashboardWidget";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface Region {
  name: string;
  projects: number;
  completion: number;
}

interface RegionalProgressWidgetProps {
  id: string;
  regions: Region[];
  onRemove?: (id: string) => void;
  onRegionClick?: (region: Region) => void;
}

export const RegionalProgressWidget = ({ 
  id, 
  regions, 
  onRemove,
  onRegionClick 
}: RegionalProgressWidgetProps) => {
  const isMobile = useIsMobile();

  return (
    <DashboardWidget
      id={id}
      title="Progression par Région"
      icon={<MapPin className="h-5 w-5 text-primary" />}
      isRemovable
      onRemove={onRemove}
      className="lg:col-span-2"
    >
      <div className="space-y-4">
        {regions.map((region, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between p-3 rounded-lg border border-border/50 
              transition-all duration-200 hover:border-primary/30 hover:bg-muted/30 cursor-pointer
              ${isMobile ? 'flex-col space-y-3' : ''}`}
            onClick={() => onRegionClick?.(region)}
          >
            <div className={`flex items-center space-x-3 ${isMobile ? 'w-full justify-between' : ''}`}>
              <Badge variant="secondary" className="font-medium">{region.name}</Badge>
              <span className="text-sm text-muted-foreground">
                {region.projects} projet{region.projects > 1 ? 's' : ''}
              </span>
            </div>
            
            <div className={`flex items-center space-x-3 ${isMobile ? 'w-full' : ''}`}>
              <div className={`bg-muted rounded-full h-2 ${isMobile ? 'flex-1' : 'w-24'}`}>
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${region.completion}%` }}
                />
              </div>
              <span className="text-sm font-medium min-w-[3rem] text-right">
                {region.completion}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </DashboardWidget>
  );
};