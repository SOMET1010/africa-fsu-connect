import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Activity,
  MapPin,
  Clock,
  Monitor,
  Ban,
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SecurityApiService } from '@/features/security/services/securityApi';
import { NetworkSecurityEvent } from '@/features/security/core/types';

const NetworkSecurity = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<NetworkSecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const networkEvents = await SecurityApiService.getNetworkSecurityEvents();
        setEvents(networkEvents);
      } catch (error) {
        console.error('Error loading network events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [user]);

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'intrusion_attempt':
        return <Ban className="h-4 w-4 text-red-500" />;
      case 'ddos_attack':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'malware_detected':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'suspicious_traffic':
        return <Activity className="h-4 w-4 text-yellow-500" />;
      case 'firewall_breach':
        return <Ban className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'high':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Événements de sécurité réseau
          </CardTitle>
          <CardDescription>
            Surveillance en temps réel des tentatives d'attaque réseau
          </CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p className="font-medium">Aucune menace réseau détectée</p>
              <p className="text-sm">Votre infrastructure est sécurisée</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  {getEventIcon(event.event_type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium capitalize">
                        {event.event_type.replace('_', ' ')}
                      </p>
                      <div className="flex gap-2">
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity.toUpperCase()}
                        </Badge>
                        <Badge variant={event.blocked ? 'destructive' : 'default'}>
                          {event.blocked ? 'Bloqué' : 'Surveillé'}
                        </Badge>
                        {event.resolved && (
                          <Badge variant="outline">Résolu</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm mb-1">{event.description}</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      {event.source_ip && (
                        <p>IP source: {event.source_ip}</p>
                      )}
                      {event.target_ip && (
                        <p>IP cible: {event.target_ip}</p>
                      )}
                      <p>
                        {new Date(event.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Alert */}
      <Alert>
        <Zap className="h-4 w-4" />
        <AlertDescription>
          Surveillance réseau activée. Détection automatique des intrusions et attaques DDoS.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default NetworkSecurity;