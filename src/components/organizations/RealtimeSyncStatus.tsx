import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { 
  Wifi, 
  WifiOff, 
  Activity, 
  Clock, 
  MessageSquare, 
  RotateCcw,
  Play,
  Square
} from 'lucide-react';

interface RealtimeSyncStatusProps {
  agencyId: string;
  connectorId?: string;
  className?: string;
}

export const RealtimeSyncStatus: React.FC<RealtimeSyncStatusProps> = ({
  agencyId,
  connectorId,
  className
}) => {
  const {
    isConnected,
    isConnecting,
    sessionId,
    connectionId,
    connect,
    disconnect,
    connectionStats
  } = useRealtimeSync({
    agencyId,
    connectorId,
    autoReconnect: true
  });

  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getStatusColor = () => {
    if (isConnected) return 'text-green-600';
    if (isConnecting) return 'text-amber-600';
    return 'text-red-600';
  };

  const getStatusIcon = () => {
    if (isConnected) return <Wifi className="h-4 w-4" />;
    if (isConnecting) return <Activity className="h-4 w-4 animate-pulse" />;
    return <WifiOff className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (isConnected) return 'Connecté';
    if (isConnecting) return 'Connexion...';
    return 'Déconnecté';
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm flex items-center gap-2">
              <span className={getStatusColor()}>
                {getStatusIcon()}
              </span>
              Synchronisation Temps Réel
            </CardTitle>
            <CardDescription className="text-xs">
              Status: {getStatusText()}
            </CardDescription>
          </div>
          
          <div className="flex gap-1">
            {!isConnected && !isConnecting && (
              <Button
                size="sm"
                onClick={connect}
                className="h-7 px-2 gap-1"
              >
                <Play className="h-3 w-3" />
                Connecter
              </Button>
            )}
            
            {isConnected && (
              <Button
                size="sm"
                variant="outline"
                onClick={disconnect}
                className="h-7 px-2 gap-1"
              >
                <Square className="h-3 w-3" />
                Déconnecter
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">État de la connexion</span>
          <Badge 
            variant={isConnected ? "default" : "secondary"}
            className="text-xs"
          >
            {getStatusText()}
          </Badge>
        </div>

        {/* Session Info */}
        {sessionId && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">ID de Session</span>
              <code className="text-xs bg-muted px-1 rounded">
                {sessionId.slice(0, 8)}...
              </code>
            </div>
            
            {connectionId && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">ID de Connexion</span>
                <code className="text-xs bg-muted px-1 rounded">
                  {connectionId.slice(0, 8)}...
                </code>
              </div>
            )}
          </div>
        )}

        {/* Connection Stats */}
        {isConnected && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageSquare className="h-3 w-3" />
                  Messages
                </div>
                <div className="flex justify-between">
                  <span>Reçus:</span>
                  <span className="font-mono">{connectionStats.messagesReceived}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envoyés:</span>
                  <span className="font-mono">{connectionStats.messagesSent}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Durée
                </div>
                <div className="flex justify-between">
                  <span>Uptime:</span>
                  <span className="font-mono">{formatUptime(connectionStats.uptime)}</span>
                </div>
                {connectionStats.reconnections > 0 && (
                  <div className="flex justify-between">
                    <span>Reconnexions:</span>
                    <span className="font-mono">{connectionStats.reconnections}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Connection Quality Indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Qualité de la connexion</span>
                <span className="text-green-600">Excellente</span>
              </div>
              <Progress value={95} className="h-1" />
            </div>
          </div>
        )}

        {/* Reconnection Info */}
        {!isConnected && connectionStats.reconnections > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <RotateCcw className="h-3 w-3" />
            <span>Tentatives de reconnexion: {connectionStats.reconnections}</span>
          </div>
        )}

        {/* Connection Tips */}
        {!isConnected && !isConnecting && (
          <div className="p-2 bg-muted/50 rounded text-xs text-muted-foreground">
            💡 La synchronisation temps réel permet la propagation instantanée des changements entre les systèmes.
          </div>
        )}
      </CardContent>
    </Card>
  );
};