import { useMemo } from 'react';
import { Activity, Users, MessageCircle, Clock } from 'lucide-react';
import { CollaborationEvent } from '@/hooks/useRealTimeCollaboration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCollaborationTime, formatDetailedTime } from '@/utils/timeUtils';
import { cn } from '@/lib/utils';

interface CollaborationTimelineProps {
  events: CollaborationEvent[];
  className?: string;
  maxEvents?: number;
}

export const CollaborationTimeline = ({ 
  events, 
  className, 
  maxEvents = 10 
}: CollaborationTimelineProps) => {
  const sortedEvents = useMemo(() => {
    return events
      .slice(0, maxEvents)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [events, maxEvents]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'user_joined': return <Users className="h-3 w-3 text-green-500" />;
      case 'user_left': return <Users className="h-3 w-3 text-red-500" />;
      case 'action_performed': return <Activity className="h-3 w-3 text-primary" />;
      default: return <MessageCircle className="h-3 w-3 text-gray-500" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'user_joined': return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950';
      case 'user_left': return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950';
      case 'action_performed': return 'border-uat-info-border bg-uat-info-bg dark:border-uat-info-border dark:bg-uat-info-bg';
      default: return 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950';
    }
  };

  const getEventText = (event: CollaborationEvent) => {
    switch (event.type) {
      case 'user_joined': return `${event.user_name} a rejoint la collaboration`;
      case 'user_left': return `${event.user_name} a quitté la collaboration`;
      case 'action_performed': return `${event.user_name} • ${event.data?.action || 'Action non spécifiée'}`;
      default: return `${event.user_name} • Activité inconnue`;
    }
  };

  if (sortedEvents.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            Timeline de collaboration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground text-center py-4">
            Aucune activité récente
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            Timeline de collaboration
          </div>
          <Badge variant="secondary" className="text-xs">
            {sortedEvents.length} événement{sortedEvents.length > 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
          
          <div className="space-y-3">
            {sortedEvents.map((event, index) => (
              <div key={`${event.user_id}-${event.timestamp}-${index}`} className="relative flex items-start gap-3">
                {/* Timeline dot */}
                <div className={cn(
                  "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2",
                  getEventColor(event.type)
                )}>
                  {getEventIcon(event.type)}
                </div>
                
                {/* Event content */}
                <div className="flex-1 min-w-0 pb-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      {getEventText(event)}
                    </p>
                    <div className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                      {formatCollaborationTime(event.timestamp)}
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDetailedTime(event.timestamp)}
                  </div>
                  
                  {event.data && Object.keys(event.data).length > 1 && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        {Object.entries(event.data)
                          .filter(([key]) => key !== 'action')
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(', ')}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};