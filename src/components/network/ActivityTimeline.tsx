// Timeline narrative — design institutionnel clair

import { FileText, MessageCircle, Calendar, FolderOpen } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import type { LucideIcon } from "lucide-react";
import { ActivityType, ActivityFeedItem } from "@/services/activityFeedService";
import { useActivityFeed } from "@/hooks/useActivityFeed";

const getIcon = (type: ActivityType): LucideIcon => {
  const icons: Record<ActivityType, LucideIcon> = {
    project: FolderOpen,
    document: FileText,
    event: Calendar,
    discussion: MessageCircle
  };
  return icons[type];
};

const getIconStyle = (type: ActivityType): string => {
  if (type === 'project') {
    return 'bg-primary/10 text-primary';
  }
  return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500';
};

interface ActivityTimelineProps {
  maxItems?: number;
  activities?: ActivityFeedItem[];
  loading?: boolean;
  error?: string | null;
}

const formatTimeAgo = (timestamp: string) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '';
  const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSeconds < 60) return `${diffSeconds}s`;
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}j`;
};

export const ActivityTimeline = ({ maxItems = 5, activities: externalActivities, loading: externalLoading, error: externalError }: ActivityTimelineProps) => {
  const { t } = useTranslation();
  const { activities: feedActivities, loading, error } = useActivityFeed(maxItems);

  const timelineActivities = externalActivities ?? feedActivities;
  const timelineLoading = externalLoading ?? loading;
  const timelineError = externalError ?? error;

  return (
    <div className="divide-y divide-gray-100 dark:divide-border rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-card shadow-sm overflow-hidden">
      {timelineLoading && (
        <div className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        </div>
      )}
      {!timelineLoading && timelineError && (
        <div className="p-6 text-center text-sm text-destructive">
          {timelineError}
        </div>
      )}
      {!timelineLoading && !timelineError && timelineActivities.length === 0 && (
        <div className="p-6 text-center text-sm text-muted-foreground">
          {t('activity.empty') || 'Aucune activité récente disponible.'}
        </div>
      )}

      {!timelineLoading && !timelineError && timelineActivities.map((activity, index) => {
        const Icon = getIcon(activity.type);
        const iconStyle = getIconStyle(activity.type);
        
        return (
          <div 
            key={activity.id}
            className="p-4 hover:bg-gray-50 dark:hover:bg-muted/50 transition-colors duration-200 animate-fade-in"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-start gap-4">
              {/* Icône */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconStyle}`}>
                <Icon className="w-5 h-5" />
              </div>
              
              {/* Contenu narratif */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-foreground">
                  <span className="font-medium">{activity.flag} {activity.country}</span>
                  <span className="text-gray-500 dark:text-muted-foreground"> {activity.action} </span>
                </p>
                <p className="text-gray-900 dark:text-foreground font-medium mt-0.5 truncate">
                  {activity.title}
                </p>
                {activity.meta && (
                  <p className="text-xs text-muted-foreground mt-1">{activity.meta}</p>
                )}
              </div>

              {/* Temps */}
              <span className="text-xs text-gray-400 dark:text-muted-foreground flex-shrink-0">
                {formatTimeAgo(activity.timestamp)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
