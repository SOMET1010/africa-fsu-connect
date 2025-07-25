import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface PerformanceMetric {
  id?: string;
  metric_name: string;
  metric_value: number;
  metric_type: 'timing' | 'counter' | 'gauge';
  user_id?: string;
  page_url: string;
  user_agent: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface UserInteraction {
  id?: string;
  action_type: string;
  element_type: string;
  element_id?: string;
  page_url: string;
  user_id?: string;
  timestamp: string;
  duration?: number;
  metadata?: Record<string, any>;
}

interface AnalyticsData {
  performance_metrics: PerformanceMetric[];
  user_interactions: UserInteraction[];
  page_views: number;
  active_users: number;
  avg_load_time: number;
  error_rate: number;
}

export const usePerformanceAnalytics = () => {
  const queryClient = useQueryClient();
  const performanceObserverRef = useRef<PerformanceObserver | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  // Fetch analytics data
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['performance-analytics'],
    queryFn: async (): Promise<AnalyticsData> => {
      const now = new Date();
      const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Mock data for now - would come from actual analytics tables
      return {
        performance_metrics: [],
        user_interactions: [],
        page_views: Math.floor(Math.random() * 1000) + 500,
        active_users: Math.floor(Math.random() * 50) + 20,
        avg_load_time: Math.random() * 1000 + 500,
        error_rate: Math.random() * 5,
      };
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // 1 minute
  });

  // Record performance metric
  const recordMetricMutation = useMutation({
    mutationFn: async (metric: Omit<PerformanceMetric, 'id' | 'timestamp'>) => {
      const data = {
        ...metric,
        timestamp: new Date().toISOString(),
      };
      
      logger.performance(`Performance metric: ${metric.metric_name}`, metric.metric_value, {
        metadata: {
          type: metric.metric_type,
          page: metric.page_url,
        }
      });

      // Store in localStorage for now (would be sent to backend)
      const stored = JSON.parse(localStorage.getItem('performance_metrics') || '[]');
      stored.push(data);
      if (stored.length > 100) stored.shift(); // Keep only last 100
      localStorage.setItem('performance_metrics', JSON.stringify(stored));

      return data;
    },
  });

  // Record user interaction
  const recordInteractionMutation = useMutation({
    mutationFn: async (interaction: Omit<UserInteraction, 'id' | 'timestamp'>) => {
      const data = {
        ...interaction,
        timestamp: new Date().toISOString(),
      };

      logger.info(`User interaction: ${interaction.action_type}`, {
        metadata: {
          element: interaction.element_type,
          page: interaction.page_url,
        }
      });

      // Store in localStorage for now
      const stored = JSON.parse(localStorage.getItem('user_interactions') || '[]');
      stored.push(data);
      if (stored.length > 200) stored.shift(); // Keep only last 200
      localStorage.setItem('user_interactions', JSON.stringify(stored));

      return data;
    },
  });

  // Performance monitoring setup
  useEffect(() => {
    if (!isTracking && typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
              const nav = entry as PerformanceNavigationTiming;
              recordMetricMutation.mutate({
                metric_name: 'page_load_time',
                metric_value: nav.loadEventEnd - nav.fetchStart,
                metric_type: 'timing',
                page_url: window.location.pathname,
                user_agent: navigator.userAgent,
              });
            }

            if (entry.entryType === 'paint') {
              recordMetricMutation.mutate({
                metric_name: entry.name,
                metric_value: entry.startTime,
                metric_type: 'timing',
                page_url: window.location.pathname,
                user_agent: navigator.userAgent,
              });
            }

            if (entry.entryType === 'largest-contentful-paint') {
              recordMetricMutation.mutate({
                metric_name: 'largest_contentful_paint',
                metric_value: entry.startTime,
                metric_type: 'timing',
                page_url: window.location.pathname,
                user_agent: navigator.userAgent,
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
  }, []);

  // Track page views
  const trackPageView = (url: string) => {
    recordMetricMutation.mutate({
      metric_name: 'page_view',
      metric_value: 1,
      metric_type: 'counter',
      page_url: url,
      user_agent: navigator.userAgent,
    });
  };

  // Track user interactions
  const trackInteraction = (actionType: string, elementType: string, elementId?: string, duration?: number) => {
    recordInteractionMutation.mutate({
      action_type: actionType,
      element_type: elementType,
      element_id: elementId,
      page_url: window.location.pathname,
      duration,
    });
  };

  // Track errors
  const trackError = (error: Error, context?: Record<string, any>) => {
    recordMetricMutation.mutate({
      metric_name: 'error',
      metric_value: 1,
      metric_type: 'counter',
      page_url: window.location.pathname,
      user_agent: navigator.userAgent,
      metadata: {
        error_message: error.message,
        error_stack: error.stack,
        ...context,
      },
    });
  };

  // Get performance insights
  const getPerformanceInsights = () => {
    const metrics = JSON.parse(localStorage.getItem('performance_metrics') || '[]');
    const interactions = JSON.parse(localStorage.getItem('user_interactions') || '[]');
    
    const loadTimes = metrics
      .filter((m: PerformanceMetric) => m.metric_name === 'page_load_time')
      .map((m: PerformanceMetric) => m.metric_value);
    
    const avgLoadTime = loadTimes.length > 0 
      ? loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length 
      : 0;

    const errorCount = metrics.filter((m: PerformanceMetric) => m.metric_name === 'error').length;
    const totalEvents = metrics.length;
    const errorRate = totalEvents > 0 ? (errorCount / totalEvents) * 100 : 0;

    return {
      avgLoadTime,
      errorRate,
      totalMetrics: metrics.length,
      totalInteractions: interactions.length,
      slowPages: loadTimes.filter(time => time > 3000).length,
    };
  };

  return {
    analyticsData,
    isLoading,
    trackPageView,
    trackInteraction,
    trackError,
    getPerformanceInsights,
    isTracking,
  };
};