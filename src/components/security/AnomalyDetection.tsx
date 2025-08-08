import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Brain,
  AlertTriangle,
  MapPin,
  Clock,
  Monitor,
  TrendingUp,
  Shield,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SecurityApiService } from '@/features/security/services/securityApi';
import { AnomalyAlert, AnomalySettings } from '@/features/security/core/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const AnomalyDetection = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<AnomalyAlert[]>([]);
  const [settings, setSettings] = useState<AnomalySettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    
    const loadData = async () => {
      try {
        const [anomalyAlerts, anomalySettings] = await Promise.all([
          SecurityApiService.getAnomalyAlerts(user.id),
          SecurityApiService.getAnomalySettings(user.id)
        ]);
        
        setAlerts(anomalyAlerts);
        setSettings(anomalySettings);
      } catch (error) {
        logger.error('Error loading anomaly data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleUpdateSettings = async (newSettings: Partial<AnomalySettings>) => {
    try {
      const updated = await SecurityApiService.updateAnomalySettings(user!.id, newSettings);
      setSettings(updated);
    } catch (error) {
      logger.error('Error updating settings:', error);
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'suspicious_login':
        return <AlertTriangle className="h-4 w-4" />;
      case 'unusual_location':
        return <MapPin className="h-4 w-4" />;
      case 'multiple_failures':
        return <XCircle className="h-4 w-4" />;
      case 'device_change':
        return <Monitor className="h-4 w-4" />;
      case 'time_anomaly':
        return <Clock className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
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
      {/* Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Détection d'anomalies IA
          </CardTitle>
          <CardDescription>
            Configuration de la surveillance intelligente des activités suspectes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monitoring Options */}
            <div className="space-y-4">
              <h4 className="font-medium">Options de surveillance</h4>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Surveillance géographique</Label>
                  <p className="text-sm text-muted-foreground">
                    Détecter les connexions depuis des lieux inhabituels
                  </p>
                </div>
                <Switch
                  checked={settings?.location_monitoring ?? true}
                  onCheckedChange={(checked) => handleUpdateSettings({ location_monitoring: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Surveillance des appareils</Label>
                  <p className="text-sm text-muted-foreground">
                    Alertes pour nouveaux appareils ou navigateurs
                  </p>
                </div>
                <Switch
                  checked={settings?.device_monitoring ?? true}
                  onCheckedChange={(checked) => handleUpdateSettings({ device_monitoring: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Analyse des horaires</Label>
                  <p className="text-sm text-muted-foreground">
                    Détecter les connexions à des heures inhabituelles
                  </p>
                </div>
                <Switch
                  checked={settings?.time_pattern_monitoring ?? true}
                  onCheckedChange={(checked) => handleUpdateSettings({ time_pattern_monitoring: checked })}
                />
              </div>
            </div>

            {/* Security Actions */}
            <div className="space-y-4">
              <h4 className="font-medium">Actions de sécurité</h4>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Blocage automatique</Label>
                  <p className="text-sm text-muted-foreground">
                    Bloquer automatiquement les activités suspectes
                  </p>
                </div>
                <Switch
                  checked={settings?.auto_block_enabled ?? false}
                  onCheckedChange={(checked) => handleUpdateSettings({ auto_block_enabled: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Seuil d'échecs de connexion</Label>
                <select
                  value={settings?.failed_login_threshold ?? 5}
                  onChange={(e) => handleUpdateSettings({ failed_login_threshold: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value={3}>3 tentatives</option>
                  <option value={5}>5 tentatives</option>
                  <option value={10}>10 tentatives</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Niveau de sensibilité</Label>
                <select
                  value={settings?.sensitivity_level ?? 'medium'}
                  onChange={(e) => handleUpdateSettings({ sensitivity_level: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="low">Faible</option>
                  <option value="medium">Moyen</option>
                  <option value="high">Élevé</option>
                </select>
                <p className="text-sm text-muted-foreground">
                  Plus le niveau est élevé, plus les détections sont sensibles
                </p>
              </div>
            </div>
          </div>

          {settings?.auto_block_enabled && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Le blocage automatique est activé. Les activités hautement suspectes seront automatiquement bloquées.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Alerts Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Alertes de sécurité récentes
          </CardTitle>
          <CardDescription>
            Activités suspectes détectées par l'intelligence artificielle
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p className="font-medium">Aucune activité suspecte détectée</p>
              <p className="text-sm">Votre compte est sécurisé</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border rounded-lg ${alert.resolved ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getTypeIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          {alert.auto_blocked && (
                            <Badge variant="destructive">Bloqué automatiquement</Badge>
                          )}
                          {alert.resolved && (
                            <Badge variant="outline">Résolu</Badge>
                          )}
                        </div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(alert.created_at), {
                            addSuffix: true,
                            locale: fr
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnomalyDetection;