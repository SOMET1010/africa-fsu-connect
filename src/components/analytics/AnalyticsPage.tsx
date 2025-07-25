import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PerformanceDashboard } from './PerformanceDashboard';
import { RealTimeAnalytics } from './RealTimeAnalytics';
import { Badge } from '@/components/ui/badge';
import { usePerformanceAnalytics } from '@/hooks/usePerformanceAnalytics';
import { useAdvancedLazyLoading } from '@/hooks/useAdvancedLazyLoading';
import { useIntelligentCache } from '@/hooks/useIntelligentCache';
import { 
  BarChart3, 
  Activity, 
  Database, 
  Zap, 
  Download, 
  Trash2,
  Settings,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react';

export const AnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { trackPageView, isTracking } = usePerformanceAnalytics();
  const { getStats: getLazyLoadStats, clearQueue } = useAdvancedLazyLoading();
  const { clearCache, getCacheStats } = useIntelligentCache();

  React.useEffect(() => {
    trackPageView('/analytics');
  }, [trackPageView]);

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Avancées</h1>
          <p className="text-muted-foreground">
            Monitoring des performances et analytics en temps réel
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-sm text-muted-foreground">
              {isTracking ? 'Actif' : 'Inactif'}
            </span>
          </div>
          
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

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Système de Tracking</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={isTracking ? "default" : "destructive"}>
                {isTracking ? 'Actif' : 'Inactif'}
              </Badge>
              {isTracking && <Zap className="h-4 w-4 text-green-500" />}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Performance</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">
                {cacheStats ? Math.round(cacheStats.hitRate) : 0}%
              </span>
              <Badge variant="secondary">Hit Rate</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lazy Loading</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">
                {lazyLoadStats.loadedCount}
              </span>
              <Badge variant="secondary">Chargés</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimisation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="bg-green-500">
                Phase 6
              </Badge>
              <span className="text-sm text-muted-foreground">Actif</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Vue d'ensemble</span>
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Temps réel</span>
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Optimisation</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <PerformanceDashboard />
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <RealTimeAnalytics />
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          {/* Optimization Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques de Cache</CardTitle>
                <CardDescription>
                  Performance du système de cache intelligent
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cacheStats ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {Math.round(cacheStats.hitRate)}%
                        </div>
                        <p className="text-sm text-muted-foreground">Taux de réussite</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {cacheStats.itemCount}
                        </div>
                        <p className="text-sm text-muted-foreground">Éléments</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Taille utilisée:</span>
                        <span>{Math.round(cacheStats.currentSize / 1024 / 1024)}MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Requêtes totales:</span>
                        <span>{cacheStats.totalRequests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Succès/Échecs:</span>
                        <span>{cacheStats.totalHits}/{cacheStats.totalMisses}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Cache non initialisé</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lazy Loading Stats</CardTitle>
                <CardDescription>
                  Performance du chargement différé
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {lazyLoadStats.loadedCount}
                      </div>
                      <p className="text-sm text-muted-foreground">Éléments chargés</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-500">
                        {lazyLoadStats.queueLength}
                      </div>
                      <p className="text-sm text-muted-foreground">En attente</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Chargements actifs:</span>
                      <span>{lazyLoadStats.activeLoads}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>En cours:</span>
                      <span>{lazyLoadStats.loadingCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Erreurs:</span>
                      <span className={lazyLoadStats.errorCount > 0 ? 'text-red-500' : ''}>
                        {lazyLoadStats.errorCount}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Optimization Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions d'Optimisation</CardTitle>
              <CardDescription>
                Outils pour optimiser les performances de l'application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  onClick={clearCache}
                  className="flex items-center space-x-2"
                >
                  <Database className="h-4 w-4" />
                  <span>Vider le Cache</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={clearQueue}
                  className="flex items-center space-x-2"
                >
                  <Clock className="h-4 w-4" />
                  <span>Vider la Queue</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="flex items-center space-x-2"
                >
                  <Zap className="h-4 w-4" />
                  <span>Redémarrer App</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};