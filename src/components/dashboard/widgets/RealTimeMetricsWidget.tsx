import { useState, useEffect } from "react";
import { Activity, Zap, Users, Globe, Server, Wifi, Clock } from "lucide-react";
import { DashboardWidget } from "../DashboardWidget";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

interface RealTimeMetricsWidgetProps {
  id: string;
  onRemove?: (id: string) => void;
}

interface RealTimeMetrics {
  onlineUsers: number;
  activeConnections: number;
  serverLoad: number;
  responseTime: number;
  dataTransfer: number;
  errorRate: number;
  lastUpdate: Date;
}

export const RealTimeMetricsWidget = ({ id, onRemove }: RealTimeMetricsWidgetProps) => {
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    onlineUsers: 0,
    activeConnections: 0,
    serverLoad: 0,
    responseTime: 0,
    dataTransfer: 0,
    errorRate: 0,
    lastUpdate: new Date()
  });

  const [isConnected, setIsConnected] = useState(false);

  // Simulate real-time data updates
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(prev => ({
        onlineUsers: Math.floor(Math.random() * 50) + 20,
        activeConnections: Math.floor(Math.random() * 100) + 50,
        serverLoad: Math.floor(Math.random() * 40) + 30,
        responseTime: Math.floor(Math.random() * 100) + 150,
        dataTransfer: Math.floor(Math.random() * 1000) + 500,
        errorRate: Math.random() * 2,
        lastUpdate: new Date()
      }));
    };

    // Initial update
    updateMetrics();
    setIsConnected(true);

    // Set up real-time updates every 5 seconds
    const interval = setInterval(updateMetrics, 5000);

    // Set up Supabase real-time subscription for actual data
    const subscription = supabase
      .channel('dashboard-metrics')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' },
        () => updateMetrics()
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      subscription.unsubscribe();
    };
  }, []);

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'bg-green-500';
    if (value <= thresholds.warning) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <DashboardWidget
      id={id}
      title="Métriques Temps Réel"
      icon={
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        </div>
      }
      isRemovable
      onRemove={onRemove}
    >
      <div className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Statut de Connexion</span>
          <Badge variant={isConnected ? "default" : "destructive"} className="gap-1">
            <Wifi className="h-3 w-3" />
            {isConnected ? 'En Ligne' : 'Hors Ligne'}
          </Badge>
        </div>

        {/* Live Metrics */}
        <div className="space-y-4">
          {/* Online Users */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Utilisateurs Connectés</span>
            </div>
            <span className="text-lg font-bold text-blue-600">{metrics.onlineUsers}</span>
          </div>

          {/* Active Connections */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Connexions Actives</span>
            </div>
            <span className="text-lg font-bold text-green-600">{metrics.activeConnections}</span>
          </div>

          {/* Server Load */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Charge Serveur</span>
              </div>
              <span className={`text-sm font-bold ${getStatusColor(metrics.serverLoad, { good: 50, warning: 80 })}`}>
                {metrics.serverLoad}%
              </span>
            </div>
            <Progress 
              value={metrics.serverLoad} 
              className="h-2" 
              style={{
                background: `linear-gradient(to right, ${getProgressColor(metrics.serverLoad, { good: 50, warning: 80 })} 0%, ${getProgressColor(metrics.serverLoad, { good: 50, warning: 80 })} ${metrics.serverLoad}%, rgb(var(--muted)) ${metrics.serverLoad}%)`
              }}
            />
          </div>

          {/* Response Time */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Temps de Réponse</span>
              </div>
              <span className={`text-sm font-bold ${getStatusColor(metrics.responseTime, { good: 200, warning: 500 })}`}>
                {metrics.responseTime}ms
              </span>
            </div>
            <Progress 
              value={Math.min((metrics.responseTime / 1000) * 100, 100)} 
              className="h-2"
            />
          </div>

          {/* Data Transfer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium">Transfert de Données</span>
            </div>
            <span className="text-sm font-bold text-indigo-600">
              {(metrics.dataTransfer / 1024).toFixed(1)} MB/s
            </span>
          </div>

          {/* Error Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Taux d'Erreur</span>
              <span className={`text-sm font-bold ${getStatusColor(metrics.errorRate, { good: 1, warning: 5 })}`}>
                {metrics.errorRate.toFixed(2)}%
              </span>
            </div>
            <Progress 
              value={Math.min(metrics.errorRate * 10, 100)} 
              className="h-2"
            />
          </div>
        </div>

        {/* Last Update */}
        <div className="pt-4 border-t text-center">
          <span className="text-xs text-muted-foreground">
            Dernière mise à jour: {metrics.lastUpdate.toLocaleTimeString('fr-FR')}
          </span>
        </div>
      </div>
    </DashboardWidget>
  );
};