import { useEffect, useMemo, useState } from 'react';
import { logger } from '@/utils/logger';
import { fetchLearningCourses, fetchLearningWebinars } from '@/services/learningContentService';
import type { LearningCourse, LearningWebinar } from '@/services/learningContentService';

export const useLearningContent = () => {
  const [courses, setCourses] = useState<LearningCourse[]>([]);
  const [webinars, setWebinars] = useState<LearningWebinar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadContent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [courseResults, webinarResults] = await Promise.all([
          fetchLearningCourses(8),
          fetchLearningWebinars(12),
        ]);

        if (!cancelled) {
          setCourses(courseResults);
          setWebinars(webinarResults);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Erreur lors du chargement des contenus';
          setError(message);
          logger.error('Failed to load learning content', err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadContent();

    return () => {
      cancelled = true;
    };
  }, []);

  const { upcomingWebinars, replayWebinars } = useMemo(() => {
    const sorted = [...webinars].sort((a, b) => new Date(a.startTimestamp).getTime() - new Date(b.startTimestamp).getTime());
    const upcoming = sorted.filter(w => w.isUpcoming || w.isLive).slice(0, 6);
    const replays = sorted.filter(w => !w.isUpcoming && !w.isLive).slice(-6).reverse();
    return { upcomingWebinars: upcoming, replayWebinars: replays };
  }, [webinars]);

  return {
    courses,
    upcomingWebinars,
    replayWebinars,
    isLoading,
    error,
  };
};
