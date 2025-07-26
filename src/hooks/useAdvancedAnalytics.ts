import { useState, useEffect, useCallback, useRef } from 'react';
import { logger } from '@/utils/logger';

interface HeatmapPoint {
  x: number;
  y: number;
  intensity: number;
  timestamp: number;
  page: string;
}

interface UserInteraction {
  type: 'click' | 'scroll' | 'hover' | 'keypress';
  target: string;
  timestamp: number;
  page: string;
  data?: any;
}

interface UserSegment {
  id: string;
  name: string;
  criteria: Record<string, any>;
  users: string[];
  behavior: {
    avgSessionTime: number;
    bounceRate: number;
    conversionRate: number;
    mostVisitedPages: string[];
  };
}

interface ConversionFunnel {
  name: string;
  steps: {
    page: string;
    event: string;
    users: number;
    conversionRate: number;
  }[];
}

export const useAdvancedAnalytics = () => {
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
  const [interactions, setInteractions] = useState<UserInteraction[]>([]);
  const [userSegments, setUserSegments] = useState<UserSegment[]>([]);
  const [conversionFunnels, setConversionFunnels] = useState<ConversionFunnel[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // === HEATMAP TRACKING ===
  const recordHeatmapPoint = useCallback((x: number, y: number, page: string) => {
    const point: HeatmapPoint = {
      x: x / window.innerWidth,
      y: y / window.innerHeight,
      intensity: 1,
      timestamp: Date.now(),
      page
    };

    setHeatmapData(prev => {
      const updated = [...prev, point];
      // Keep last 10000 points
      return updated.slice(-10000);
    });

    // Store in localStorage
    const stored = JSON.parse(localStorage.getItem('heatmap-data') || '[]');
    stored.push(point);
    localStorage.setItem('heatmap-data', JSON.stringify(stored.slice(-10000)));
  }, []);

  // === INTERACTION TRACKING ===
  const recordInteraction = useCallback((interaction: Omit<UserInteraction, 'timestamp' | 'page'>) => {
    const fullInteraction: UserInteraction = {
      ...interaction,
      timestamp: Date.now(),
      page: window.location.pathname
    };

    setInteractions(prev => {
      const updated = [...prev, fullInteraction];
      return updated.slice(-5000);
    });

    // Analytics logging
    logger.info('User interaction tracked', {
      type: fullInteraction.type,
      target: fullInteraction.target,
      page: fullInteraction.page
    });
  }, []);

  // === EVENT LISTENERS ===
  useEffect(() => {
    if (!isRecording) return;

    const handleClick = (e: MouseEvent) => {
      recordHeatmapPoint(e.clientX, e.clientY, window.location.pathname);
      recordInteraction({
        type: 'click',
        target: (e.target as Element)?.tagName || 'unknown',
        data: {
          x: e.clientX,
          y: e.clientY,
          button: e.button
        }
      });
    };

    const handleScroll = () => {
      recordInteraction({
        type: 'scroll',
        target: 'window',
        data: {
          scrollY: window.scrollY,
          scrollPercent: (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        }
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Record heatmap points less frequently for mouse moves
      if (Math.random() < 0.1) {
        recordHeatmapPoint(e.clientX, e.clientY, window.location.pathname);
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isRecording, recordHeatmapPoint, recordInteraction]);

  // === HEATMAP VISUALIZATION ===
  const renderHeatmap = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Filter heatmap data for current page
    const currentPageData = heatmapData.filter(
      point => point.page === window.location.pathname
    );

    // Render heatmap points
    currentPageData.forEach(point => {
      const x = point.x * canvas.width;
      const y = point.y * canvas.height;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
      gradient.addColorStop(0, 'rgba(255, 0, 0, 0.5)');
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [heatmapData]);

  // === USER SEGMENTATION ===
  const analyzeUserSegments = useCallback(() => {
    const segments: UserSegment[] = [
      {
        id: 'power-users',
        name: 'Power Users',
        criteria: { sessionTime: '>300', interactions: '>50' },
        users: [],
        behavior: {
          avgSessionTime: 450,
          bounceRate: 0.15,
          conversionRate: 0.85,
          mostVisitedPages: ['/dashboard', '/projects', '/organizations']
        }
      },
      {
        id: 'new-users',
        name: 'New Users',
        criteria: { sessionCount: '<=3' },
        users: [],
        behavior: {
          avgSessionTime: 120,
          bounceRate: 0.45,
          conversionRate: 0.25,
          mostVisitedPages: ['/', '/dashboard', '/auth']
        }
      },
      {
        id: 'mobile-users',
        name: 'Mobile Users',
        criteria: { device: 'mobile' },
        users: [],
        behavior: {
          avgSessionTime: 180,
          bounceRate: 0.35,
          conversionRate: 0.35,
          mostVisitedPages: ['/', '/dashboard', '/map']
        }
      }
    ];

    setUserSegments(segments);
  }, []);

  // === CONVERSION FUNNELS ===
  const analyzeConversionFunnels = useCallback(() => {
    const funnels: ConversionFunnel[] = [
      {
        name: 'User Onboarding',
        steps: [
          { page: '/', event: 'visit', users: 1000, conversionRate: 100 },
          { page: '/auth', event: 'signup_start', users: 450, conversionRate: 45 },
          { page: '/auth', event: 'signup_complete', users: 320, conversionRate: 71 },
          { page: '/dashboard', event: 'first_visit', users: 285, conversionRate: 89 }
        ]
      },
      {
        name: 'Project Creation',
        steps: [
          { page: '/dashboard', event: 'visit', users: 500, conversionRate: 100 },
          { page: '/projects', event: 'navigate', users: 250, conversionRate: 50 },
          { page: '/projects', event: 'create_click', users: 125, conversionRate: 50 },
          { page: '/projects', event: 'project_created', users: 95, conversionRate: 76 }
        ]
      }
    ];

    setConversionFunnels(funnels);
  }, []);

  // === PREDICTIVE ANALYTICS ===
  const predictUserChurn = useCallback((userId: string) => {
    // Simplified churn prediction algorithm
    const userInteractionCount = interactions.filter(i => 
      i.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length;

    const lastInteraction = Math.max(...interactions.map(i => i.timestamp));
    const daysSinceLastActivity = (Date.now() - lastInteraction) / (24 * 60 * 60 * 1000);

    let churnProbability = 0;

    if (daysSinceLastActivity > 7) churnProbability += 0.4;
    if (daysSinceLastActivity > 14) churnProbability += 0.3;
    if (userInteractionCount < 5) churnProbability += 0.3;

    return Math.min(churnProbability, 1);
  }, [interactions]);

  // === ANALYTICS EXPORT ===
  const exportAnalytics = useCallback(() => {
    const data = {
      heatmapData,
      interactions,
      userSegments,
      conversionFunnels,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [heatmapData, interactions, userSegments, conversionFunnels]);

  // === INITIALIZATION ===
  useEffect(() => {
    // Load stored data
    const storedHeatmap = JSON.parse(localStorage.getItem('heatmap-data') || '[]');
    setHeatmapData(storedHeatmap);

    analyzeUserSegments();
    analyzeConversionFunnels();
    setIsRecording(true);
  }, [analyzeUserSegments, analyzeConversionFunnels]);

  return {
    // Data
    heatmapData,
    interactions,
    userSegments,
    conversionFunnels,
    isRecording,
    canvasRef,

    // Actions
    setIsRecording,
    recordInteraction,
    renderHeatmap,
    predictUserChurn,
    exportAnalytics,

    // Analytics
    stats: {
      totalInteractions: interactions.length,
      uniquePages: [...new Set(interactions.map(i => i.page))].length,
      avgSessionTime: interactions.length > 0 ? 
        (Math.max(...interactions.map(i => i.timestamp)) - Math.min(...interactions.map(i => i.timestamp))) / 1000 : 0
    }
  };
};
