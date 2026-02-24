import { useEffect, useMemo, useState } from 'react';
import { logger } from '@/utils/logger';
import { fetchActivityFeed, type ActivityFeedItem } from '@/services/activityFeedService';

export const useActivityFeed = (maxItems = 5) => {
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadActivityFeed = async () => {
      setLoading(true);
      setError(null);

      try {
        const feedItems = await fetchActivityFeed(maxItems);
        if (!cancelled) {
          setActivities(feedItems);
        }
      } catch (err) {
        if (!cancelled) {
          logger.error('Failed to load activity feed', err);
          const message = err instanceof Error ? err.message : 'Impossible de charger le flux d\'activité.';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadActivityFeed();

    return () => {
      cancelled = true;
    };
  }, [maxItems]);

  const hasMore = useMemo(() => activities.length >= maxItems, [activities, maxItems]);

  return {
    activities,
    loading,
    error,
    hasMore,
  };
};
