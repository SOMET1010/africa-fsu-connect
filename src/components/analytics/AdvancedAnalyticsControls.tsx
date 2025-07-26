import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RealTimeAnalytics } from './RealTimeAnalytics';
import { PerformanceDashboard } from './PerformanceDashboard';
import { usePerformanceAnalytics } from '@/hooks/usePerformanceAnalytics';
import { useAdvancedLazyLoading } from '@/hooks/useAdvancedLazyLoading';
import { useIntelligentCache } from '@/hooks/useIntelligentCache';
import { 
  BarChart3, 
  Activity, 
  Download, 
  Trash2
} from 'lucide-react';

export const AdvancedAnalyticsControls = () => {
  const { trackPageView } = usePerformanceAnalytics();
  const { getStats: getLazyLoadStats, clearQueue } = useAdvancedLazyLoading();
  const { clearCache, getCacheStats } = useIntelligentCache();

  const lazyLoadStats = getLazyLoadStats();
  const cacheStats = getCacheStats();

  const exportAnalytics = () => {
    const data = {
      timestamp: new Date().toISOString(),
      performance_metrics: JSON.parse(localStorage.getItem('performance_metrics') || '[]'),
      user_interactions: JSON.parse(localStorage.getItem('user_interactions') || '[]'),
      lazy_load_stats: lazyLoadStats,
      cache_stats: cacheStats,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAllData = () => {
    localStorage.removeItem('performance_metrics');
    localStorage.removeItem('user_interactions');
    clearCache();
    clearQueue();
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Advanced Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Analytics Avancées</h3>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={exportAnalytics}>
            <Download className="h-4 w-4 mr-1" />
            Exporter
          </Button>
          
          <Button variant="outline" size="sm" onClick={clearAllData}>
            <Trash2 className="h-4 w-4 mr-1" />
            Nettoyer
          </Button>
        </div>
      </div>

      {/* Advanced Analytics Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="performance" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Performance</span>
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Temps réel</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <PerformanceDashboard />
        </TabsContent>

        <TabsContent value="realtime">
          <RealTimeAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};