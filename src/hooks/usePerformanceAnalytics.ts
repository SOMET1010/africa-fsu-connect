import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/utils/logger';

interface PerformanceMetricRow {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_type: 'timing' | 'counter' | 'gauge';
  user_id: string | null;
  page_url: string | null;
  user_agent: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
}

interface UserInteractionRow {
  id: string;
  action_type: string;
  element_type: string;
  element_id: string | null;
  page_url: string | null;
  user_id: string | null;
  duration: number | null;
  metadata: Record<string, any> | null;
  created_at: string;
}

interface AnalyticsData {
  performance_metrics: PerformanceMetricRow[];
  user_interactions: UserInteractionRow[];
  page_views: number;
  active_users: number;
  avg_load_time: number;
  error_rate: number;
}

const WINDOW_DURATION_MS = 24 * 60 * 60 * 1000;

export const usePerformanceAnalytics = () => {
  const queryClient = useQueryClient();
  const performanceObserverRef = useRef<PerformanceObserver | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const { user } = useAuth();

  const analyticsQuery = useQuery<AnalyticsData>({
    queryKey: ['performance-analytics'],
    queryFn: async (): Promise<AnalyticsData> => {
      const since = new Date(Date.now() - WINDOW_DURATION_MS).toISOString();

      const [metricsResponse, interactionsResponse] = await Promise.all([
        supabase
          .from('performance_metrics')
          .select('*')
          .gte('created_at', since),
        supabase
          .from('user_interactions')
          .select('*')
          .gte('created_at', since),
      ]);

      if (metricsResponse.error || interactionsResponse.error) {
        throw metricsResponse.error || interactionsResponse.error;
      }

      const metrics = (metricsResponse.data ?? []) as PerformanceMetricRow[];
      const interactions = (interactionsResponse.data ?? []) as UserInteractionRow[];

      const pageViews = metrics.filter(metric => metric.metric_name === 'page_view').length;
      const timingMetrics = metrics.filter(metric => metric.metric_type === 'timing');
      const avgLoadTime = timingMetrics.length
        ? timingMetrics.reduce((acc, metric) => acc + Number(metric.metric_value), 0) / timingMetrics.length
        : 0;
      const errorMetrics = metrics.filter(metric => metric.metric_name === 'error').length;
      const errorRate = metrics.length ? (errorMetrics / metrics.length) * 100 : 0;

      const activeUsers = new Set<string>();
      metrics.forEach(metric => metric.user_id && activeUsers.add(metric.user_id));
      interactions.forEach(interaction => interaction.user_id && activeUsers.add(interaction.user_id));

      return {
        performance_metrics: metrics,
        user_interactions: interactions,
        page_views: pageViews,
        active_users: activeUsers.size,
        avg_load_time: Number(avgLoadTime.toFixed(2)),
        error_rate: Number(errorRate.toFixed(2)),
      };
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });

  const recordMetricMutation = useMutation({
    mutationFn: async (metric: {
      metric_name: string;
      metric_value: number;
      metric_type: 'timing' | 'counter' | 'gauge';
      page_url: string;
      user_agent: string;
      metadata?: Record<string, any>;
    }) => {
      const payload = {
        ...metric,
        user_id: user?.id ?? null,
        metadata: metric.metadata ?? null,
      };

      const { data, error } = await supabase
        .from('performance_metrics')
        .insert(payload)
        .select('*')
        .single();

      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ['performance-analytics'] });
      return data as PerformanceMetricRow;
    },
  });

  const recordInteractionMutation = useMutation({
    mutationFn: async (interaction: {
      action_type: string;
      element_type: string;
      element_id?: string;
      duration?: number;
      page_url: string;
      metadata?: Record<string, any>;
    }) => {
      const payload = {
        ...interaction,
        user_id: user?.id ?? null,
        metadata: interaction.metadata ?? null,
      };

      const { data, error } = await supabase
        .from('user_interactions')
        .insert(payload)
        .select('*')
        .single();

      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ['performance-analytics'] });
      return data as UserInteractionRow;
    },
  });

  const recordMetric = (metric: {
    metric_name: string;
    metric_value: number;
    metric_type: 'timing' | 'counter' | 'gauge';
    page_url?: string;
    user_agent?: string;
    metadata?: Record<string, any>;
  }) => {
    const pageUrl = typeof window !== 'undefined' ? window.location.pathname : metric.page_url ?? '/';
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : metric.user_agent ?? 'unknown';

    logger.performance(`Performance metric: ${metric.metric_name}`, metric.metric_value, {
      metadata: {
        type: metric.metric_type,
        page: pageUrl,
      },
    });

    recordMetricMutation.mutate({
      metric_name: metric.metric_name,
      metric_value: metric.metric_value,
      metric_type: metric.metric_type,
      page_url: pageUrl,
      user_agent: userAgent,
      metadata: metric.metadata,
    });
  };

  const recordInteraction = (interaction: {
    action_type: string;
    element_type: string;
    element_id?: string;
    duration?: number;
    metadata?: Record<string, any>;
  }) => {
    const pageUrl = typeof window !== 'undefined' ? window.location.pathname : undefined;

    logger.info(`User interaction: ${interaction.action_type}`, {
      metadata: {
        element: interaction.element_type,
        page: pageUrl,
      },
    });

    recordInteractionMutation.mutate({
      ...interaction,
      page_url: pageUrl ?? interaction.metadata?.page_url ?? '/',
    });
  };

  useEffect(() => {
    if (!isTracking && typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
              recordMetric({
                metric_name: 'page_load_time',
                metric_value: entry.responseEnd - entry.startTime,
                metric_type: 'timing',
              });
            }

            if (entry.entryType === 'paint') {
              recordMetric({
                metric_name: entry.name,
                metric_value: entry.startTime,
                metric_type: 'timing',
              });
            }

            if (entry.entryType === 'largest-contentful-paint') {
              recordMetric({
                metric_name: 'largest_contentful_paint',
                metric_value: entry.startTime,
                metric_type: 'timing',
              });
            }
          });
        });

        observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
        performanceObserverRef.current = observer;
        setIsTracking(true);

        logger.info('Performance monitoring started');
      } catch (error) {
        logger.error('Failed to start performance monitoring', error);
      }
    }

    return () => {
      if (performanceObserverRef.current) {
        performanceObserverRef.current.disconnect();
        performanceObserverRef.current = null;
        setIsTracking(false);
      }
    };
  }, [isTracking]);

  const trackPageView = (url: string) => {
    recordMetric({
      metric_name: 'page_view',
      metric_value: 1,
      metric_type: 'counter',
      page_url: url,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    });
  };

  const trackInteraction = (actionType: string, elementType: string, elementId?: string, duration?: number) => {
    recordInteraction({
      action_type: actionType,
      element_type: elementType,
      element_id: elementId,
      duration,
    });
  };

  const trackError = (error: Error, context?: Record<string, any>) => {
    recordMetric({
      metric_name: 'error',
      metric_value: 1,
      metric_type: 'counter',
      metadata: context,
    });
    logger.error('Tracked error', error, { context });
  };

  const insights = useMemo(() => {
    const metrics = analyticsQuery.data?.performance_metrics ?? [];
    const interactions = analyticsQuery.data?.user_interactions ?? [];
    const slowThreshold = 2000;

    const slowPages = metrics.filter((metric) => {
      const metricName = metric.metric_name?.toLowerCase();
      const value = Number(metric.metric_value ?? 0);
      const isLoadMetric = metricName?.includes('page_load') || metricName?.includes('largest_contentful_paint');
      return isLoadMetric && value > slowThreshold;
    }).length;

    const totalInteractions = metrics.length + interactions.length;

    return {
      avgLoadTime: analyticsQuery.data?.avg_load_time ?? 0,
      errorRate: analyticsQuery.data?.error_rate ?? 0,
      totalInteractions,
      slowPages,
      activeUsers: analyticsQuery.data?.active_users ?? 0,
      pageViews: analyticsQuery.data?.page_views ?? 0,
    };
  }, [analyticsQuery.data]);

  const getPerformanceInsights = () => insights;

  return {
    analyticsData: analyticsQuery.data,
    isLoading: analyticsQuery.isLoading,
    isTracking,
    recordMetric,
    trackPageView,
    trackInteraction,
    trackError,
    getPerformanceInsights,
  };
};
