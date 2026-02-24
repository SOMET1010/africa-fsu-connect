import { useEffect, useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { logger } from '@/utils/logger';
import { fetchActivityFeed, type ActivityFeedItem } from '@/services/activityFeedService';

export interface NetworkActivityItem {
  id: string;
  type: 'project' | 'document' | 'event' | 'discussion';
  country: string;
  action: string;
  title: string;
  timeAgo: string;
  timestamp: number;
  flag: string;
}

const mapActivity = (item: ActivityFeedItem): NetworkActivityItem => {
  const timestamp = new Date(item.timestamp || Date.now()).getTime();
  return {
    id: item.id,
    type: item.type,
    country: item.country,
    action: item.action,
    title: item.title,
    timeAgo: formatDistanceToNow(new Date(timestamp), { addSuffix: true }),
    timestamp,
    flag: item.flag,
  };
};

export const useNetworkActivity = (maxItems: number = 6) => {
  const [activities, setActivities] = useState<NetworkActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadActivity = async () => {
      try {
        setLoading(true);
        setError(null);
        const feedItems = await fetchActivityFeed(maxItems);
        if (!cancelled) {
          setActivities(feedItems.map(mapActivity));
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Erreur lors de la récupération de l’activité réseau';
          setError(message);
          logger.error('Failed to load network activity', err, { component: 'useNetworkActivity' });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadActivity();

    return () => {
      cancelled = true;
    };
  }, [maxItems]);

  const hasError = Boolean(error);

  return useMemo(() => ({ activities, loading, error, hasError }), [activities, error, hasError, loading]);
};
