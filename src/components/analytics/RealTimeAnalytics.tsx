import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePerformanceAnalytics } from '@/hooks/usePerformanceAnalytics';
import { useIntelligentCache } from '@/hooks/useIntelligentCache';
import { Activity, Database, Cpu, Network, RefreshCw } from 'lucide-react';

export const RealTimeAnalytics = () => {
  const { isTracking, getPerformanceInsights } = usePerformanceAnalytics();
  const { getCacheStats, updateStats } = useIntelligentCache();
  const [realtimeData, setRealtimeData] = useState({
    activeConnections: 0,
    currentLoad: 0,
    memoryUsage: 0,
    networkLatency: 0,
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData({
        activeConnections: Math.floor(Math.random() * 50) + 10,
        currentLoad: Math.random() * 100,
        memoryUsage: Math.random() * 80 + 20,
        networkLatency: Math.random() * 200 + 50,
      });
      updateStats();
    }, 2000);

    return () => clearInterval(interval);
  }, [updateStats]);

  const cacheStats = getCacheStats();
  const performanceInsights = getPerformanceInsights();

  const getStatusColor = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return 'text-green-500';
    if (value <= thresholds[1]) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusBadge = (value: number, thresholds: [number, number], unit: string = '') => {
    const color = getStatusColor(value, thresholds);
    const variant = color.includes('green') ? 'default' : 
                   color.includes('yellow') ? 'secondary' : 'destructive';
    
    return <Badge variant={variant}>{Math.round(value)}{unit}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Real-time Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <h2 className="text-lg font-semibold">Analytics Temps Réel</h2>
          {isTracking && (
            <Badge variant="default" className="bg-green-500">
              Actif
            </Badge>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.location.reload()}
          className="flex items-center space-x-1"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Actualiser</span>
        </Button>
      </div>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Connections */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connexions Actives</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {realtimeData.activeConnections}
            </div>
            <p className="text-xs text-muted-foreground">
              Utilisateurs connectés
            </p>
          </CardContent>
        </Card>

        {/* CPU Load */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Charge Système</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`text-2xl font-bold ${getStatusColor(realtimeData.currentLoad, [50, 80])}`}>
                {Math.round(realtimeData.currentLoad)}%
              </div>
              {getStatusBadge(realtimeData.currentLoad, [50, 80], '%')}
            </div>
          </CardContent>
        </Card>

        {/* Memory Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mémoire</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`text-2xl font-bold ${getStatusColor(realtimeData.memoryUsage, [60, 85])}`}>
                {Math.round(realtimeData.memoryUsage)}%
              </div>
              {getStatusBadge(realtimeData.memoryUsage, [60, 85], '%')}
            </div>
          </CardContent>
        </Card>

        {/* Network Latency */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latence Réseau</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`text-2xl font-bold ${getStatusColor(realtimeData.networkLatency, [100, 200])}`}>
                {Math.round(realtimeData.networkLatency)}ms
              </div>
              {getStatusBadge(realtimeData.networkLatency, [100, 200], 'ms')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cache Performance */}
      {cacheStats && (
        <Card>
          <CardHeader>
            <CardTitle>Performance du Cache</CardTitle>
            <CardDescription>
              Statistiques en temps réel du système de cache intelligent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {cacheStats.hitRate.toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground">Taux de réussite</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {cacheStats.itemCount}
                </div>
                <p className="text-sm text-muted-foreground">Éléments en cache</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {Math.round(cacheStats.currentSize / 1024 / 1024)}MB
                </div>
                <p className="text-sm text-muted-foreground">Taille utilisée</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Requêtes totales:</span>
                <span className="ml-2 font-medium">{cacheStats.totalRequests}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Succès:</span>
                <span className="ml-2 font-medium text-green-500">{cacheStats.totalHits}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Échecs:</span>
                <span className="ml-2 font-medium text-red-500">{cacheStats.totalMisses}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Efficacité:</span>
                <span className="ml-2 font-medium">
                  {cacheStats.hitRate > 80 ? '🚀 Excellente' : 
                   cacheStats.hitRate > 60 ? '✅ Bonne' : '⚠️ À améliorer'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé des Performances</CardTitle>
          <CardDescription>
            État général de l'application en temps réel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {performanceInsights.avgLoadTime > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Temps de chargement moyen:</span>
                <span className={`text-sm font-medium ${getStatusColor(performanceInsights.avgLoadTime, [2000, 5000])}`}>
                  {Math.round(performanceInsights.avgLoadTime)}ms
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Taux d'erreur:</span>
              <span className={`text-sm font-medium ${getStatusColor(performanceInsights.errorRate, [2, 5])}`}>
                {performanceInsights.errorRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Interactions utilisateur:</span>
              <span className="text-sm font-medium text-primary">
                {performanceInsights.totalInteractions}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Pages lentes:</span>
              <span className={`text-sm font-medium ${performanceInsights.slowPages > 0 ? 'text-yellow-500' : 'text-green-500'}`}>
                {performanceInsights.slowPages}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};