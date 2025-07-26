import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

interface RealtimeSyncMessage {
  type: string;
  data?: any;
  timestamp: string;
  sessionId?: string;
  connectionId?: string;
}

interface RealtimeSyncOptions {
  agencyId: string;
  connectorId?: string;
  autoReconnect?: boolean;
  heartbeatInterval?: number;
}

interface UseRealtimeSyncReturn {
  isConnected: boolean;
  isConnecting: boolean;
  sessionId: string | null;
  connectionId: string | null;
  connect: () => void;
  disconnect: () => void;
  sendData: (data: any) => void;
  lastMessage: RealtimeSyncMessage | null;
  connectionStats: {
    messagesReceived: number;
    messagesSent: number;
    reconnections: number;
    uptime: number;
  };
}

export const useRealtimeSync = (options: RealtimeSyncOptions): UseRealtimeSyncReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<RealtimeSyncMessage | null>(null);
  const [connectionStats, setConnectionStats] = useState({
    messagesReceived: 0,
    messagesSent: 0,
    reconnections: 0,
    uptime: 0
  });

  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectTimeRef = useRef<number>(0);
  const { toast } = useToast();

  const { agencyId, connectorId, autoReconnect = true, heartbeatInterval = 30000 } = options;

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setIsConnecting(true);
    connectTimeRef.current = Date.now();

    try {
      // Use the full URL for the WebSocket endpoint
      const wsUrl = `wss://wsbawdvqfbmtjtdtyddy.functions.supabase.co/functions/v1/realtime-sync`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        logger.info('WebSocket connected', { component: 'RealtimeSync', action: 'connect' });
        setIsConnected(true);
        setIsConnecting(false);
        
        // Start sync session
        if (wsRef.current) {
          wsRef.current.send(JSON.stringify({
            type: 'sync_start',
            agencyId,
            connectorId
          }));
          
          setConnectionStats(prev => ({
            ...prev,
            messagesSent: prev.messagesSent + 1
          }));
        }

        // Start heartbeat
        startHeartbeat();

        toast({
          title: "Synchronisation temps réel activée",
          description: "Connexion WebSocket établie avec succès",
        });
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: RealtimeSyncMessage = JSON.parse(event.data);
          logger.debug('Received WebSocket message', { component: 'RealtimeSync', messageType: message.type });
          
          setLastMessage(message);
          setConnectionStats(prev => ({
            ...prev,
            messagesReceived: prev.messagesReceived + 1
          }));

          handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        logger.warn('WebSocket disconnected', { component: 'RealtimeSync', code: event.code, reason: event.reason });
        setIsConnected(false);
        setIsConnecting(false);
        setSessionId(null);
        
        stopHeartbeat();

        if (autoReconnect && event.code !== 1000) {
          // Auto-reconnect after delay
          const delay = Math.min(1000 * Math.pow(2, connectionStats.reconnections), 30000);
          reconnectTimeoutRef.current = setTimeout(() => {
            setConnectionStats(prev => ({
              ...prev,
              reconnections: prev.reconnections + 1
            }));
            connect();
          }, delay);

          toast({
            title: "Connexion perdue",
            description: `Reconnexion automatique dans ${delay / 1000}s...`,
            variant: "default",
          });
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Erreur de connexion",
          description: "Erreur de connexion WebSocket",
          variant: "destructive",
        });
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setIsConnecting(false);
      toast({
        title: "Erreur de connexion",
        description: "Impossible d'établir la connexion WebSocket",
        variant: "destructive",
      });
    }
  }, [agencyId, connectorId, autoReconnect, toast, connectionStats.reconnections]);

  const disconnect = useCallback(() => {
    stopHeartbeat();
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    setSessionId(null);
    setConnectionId(null);
  }, []);

  const sendData = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'sync_data',
        agencyId,
        data
      }));
      
      setConnectionStats(prev => ({
        ...prev,
        messagesSent: prev.messagesSent + 1
      }));
    } else {
      toast({
        title: "Connexion fermée",
        description: "Impossible d'envoyer les données - connexion WebSocket fermée",
        variant: "destructive",
      });
    }
  }, [agencyId, toast]);

  const handleMessage = useCallback((message: RealtimeSyncMessage) => {
    switch (message.type) {
      case 'connection_established':
        setConnectionId(message.connectionId || null);
        break;
      
      case 'sync_started':
        setSessionId(message.sessionId || null);
        break;
      
      case 'data_synced':
        // Handle real-time data updates
        logger.info('Data synced successfully', { component: 'RealtimeSync', action: 'sync_data' });
        break;
      
      case 'conflict_detected':
        toast({
          title: "Conflit détecté",
          description: "Un conflit de synchronisation a été détecté et nécessite une résolution",
          variant: "default",
        });
        break;
      
      case 'sync_error':
        toast({
          title: "Erreur de synchronisation",
          description: message.data?.message || "Erreur inconnue",
          variant: "destructive",
        });
        break;
      
      case 'heartbeat_ack':
        // Heartbeat acknowledged
        break;
      
      default:
        logger.warn('Unknown WebSocket message type received', { component: 'RealtimeSync', messageType: message.type });
    }
  }, [toast]);

  const startHeartbeat = useCallback(() => {
    heartbeatRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'heartbeat',
          agencyId
        }));
      }
    }, heartbeatInterval);
  }, [agencyId, heartbeatInterval]);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  }, []);

  // Update uptime stats
  useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected && connectTimeRef.current > 0) {
        setConnectionStats(prev => ({
          ...prev,
          uptime: Math.floor((Date.now() - connectTimeRef.current) / 1000)
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isConnecting,
    sessionId,
    connectionId,
    connect,
    disconnect,
    sendData,
    lastMessage,
    connectionStats
  };
};