import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Eye, 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Monitor,
  Smartphone,
  MapPin,
  LogOut
} from 'lucide-react';
import { useSecurity } from '@/hooks/useSecurity';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import WebAuthnManager from './WebAuthnManager';
import AnomalyDetection from './AnomalyDetection';
import AdvancedEncryption from './AdvancedEncryption';
import ComplianceReports from './ComplianceReports';
import NetworkSecurity from './NetworkSecurity';

const SecurityDashboard = () => {
  const {
    securityPreferences,
    auditLogs,
    activeSessions,
    isLoading,
    updateSecurityPreferences,
    terminateSession,
  } = useSecurity();

  const [localPreferences, setLocalPreferences] = useState(securityPreferences);

  const handlePreferenceChange = (key: string, value: boolean | number) => {
    const updatedPrefs = { ...localPreferences, [key]: value };
    setLocalPreferences(updatedPrefs);
    updateSecurityPreferences.mutate(updatedPrefs);
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'login':
      case 'signin':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'logout':
      case 'signout':
        return <LogOut className="h-4 w-4 text-blue-500" />;
      case 'login_failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDeviceIcon = (userAgent?: string) => {
    if (!userAgent) return <Monitor className="h-4 w-4" />;
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Sécurité et Authentification</h1>
          <p className="text-muted-foreground">
            Gérez vos paramètres de sécurité et surveillez votre activité
          </p>
        </div>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">État de sécurité</p>
                <p className="font-semibold text-green-600 dark:text-green-400">Protégé</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sessions actives</p>
                <p className="font-semibold">{activeSessions?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Délai d'expiration</p>
                <p className="font-semibold">
                  {Math.floor((securityPreferences?.session_timeout || 7200) / 3600)}h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="preferences" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="audit">Journal d'audit</TabsTrigger>
          <TabsTrigger value="webauthn">WebAuthn</TabsTrigger>
          <TabsTrigger value="anomaly">Anomalies IA</TabsTrigger>
          <TabsTrigger value="encryption">Chiffrement</TabsTrigger>
          <TabsTrigger value="compliance">Conformité</TabsTrigger>
          <TabsTrigger value="network">Réseau</TabsTrigger>
        </TabsList>

        {/* Security Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de sécurité</CardTitle>
              <CardDescription>
                Configurez vos préférences de sécurité et d'authentification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Authentification à deux facteurs</Label>
                  <p className="text-sm text-muted-foreground">
                    Sécurisez votre compte avec une couche supplémentaire de protection
                  </p>
                </div>
                <Switch
                  checked={localPreferences?.two_factor_enabled || false}
                  onCheckedChange={(checked) => handlePreferenceChange('two_factor_enabled', checked)}
                />
              </div>

              {/* Login Notifications */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Notifications de connexion</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevez des alertes lors de nouvelles connexions
                  </p>
                </div>
                <Switch
                  checked={localPreferences?.login_notifications ?? true}
                  onCheckedChange={(checked) => handlePreferenceChange('login_notifications', checked)}
                />
              </div>

              {/* Security Alerts */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Alertes de sécurité</Label>
                  <p className="text-sm text-muted-foreground">
                    Soyez averti des activités suspectes
                  </p>
                </div>
                <Switch
                  checked={localPreferences?.security_alerts ?? true}
                  onCheckedChange={(checked) => handlePreferenceChange('security_alerts', checked)}
                />
              </div>

              {/* Session Timeout */}
              <div className="space-y-2">
                <Label>Délai d'expiration de session (minutes)</Label>
                <Input
                  type="number"
                  min="15"
                  max="1440"
                  value={Math.floor((localPreferences?.session_timeout || 7200) / 60)}
                  onChange={(e) => handlePreferenceChange('session_timeout', parseInt(e.target.value) * 60)}
                  className="w-32"
                />
                <p className="text-sm text-muted-foreground">
                  Temps avant déconnexion automatique
                </p>
              </div>

              {/* Max Concurrent Sessions */}
              <div className="space-y-2">
                <Label>Sessions simultanées maximum</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={localPreferences?.max_concurrent_sessions || 3}
                  onChange={(e) => handlePreferenceChange('max_concurrent_sessions', parseInt(e.target.value))}
                  className="w-32"
                />
                <p className="text-sm text-muted-foreground">
                  Nombre maximum de connexions simultanées autorisées
                </p>
              </div>
            </CardContent>
          </Card>

          {localPreferences?.two_factor_enabled && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                L'authentification à deux facteurs est activée. Assurez-vous de conserver vos codes de récupération en lieu sûr.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Active Sessions */}
        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sessions actives</CardTitle>
              <CardDescription>
                Gérez vos sessions de connexion actives
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeSessions?.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Aucune session active trouvée
                </p>
              ) : (
                <div className="space-y-4">
                  {activeSessions?.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        {getDeviceIcon(session.user_agent)}
                        <div>
                          <p className="font-medium">
                            {session.user_agent?.includes('Chrome') ? 'Chrome' :
                             session.user_agent?.includes('Firefox') ? 'Firefox' :
                             session.user_agent?.includes('Safari') ? 'Safari' : 'Navigateur inconnu'}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{session.location || session.ip_address || 'Localisation inconnue'}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Dernière activité: {formatDistanceToNow(new Date(session.last_activity), { 
                              addSuffix: true, 
                              locale: fr 
                            })}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => terminateSession.mutate(session.id)}
                        disabled={terminateSession.isPending}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Terminer
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Logs */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Journal d'audit</CardTitle>
              <CardDescription>
                Historique des activités de sécurité sur votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              {auditLogs?.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Aucune activité trouvée
                </p>
              ) : (
                <div className="space-y-3">
                  {auditLogs?.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50">
                      {getActionIcon(log.action_type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium capitalize">
                            {log.action_type.replace('_', ' ')}
                          </p>
                          <Badge variant={log.success ? 'default' : 'destructive'}>
                            {log.success ? 'Succès' : 'Échec'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(log.created_at), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </p>
                        {log.ip_address && (
                          <p className="text-xs text-muted-foreground">
                            IP: {log.ip_address}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* WebAuthn Tab */}
        <TabsContent value="webauthn">
          <WebAuthnManager />
        </TabsContent>

        {/* Anomaly Detection Tab */}
        <TabsContent value="anomaly">
          <AnomalyDetection />
        </TabsContent>

        {/* Advanced Encryption Tab */}
        <TabsContent value="encryption">
          <AdvancedEncryption />
        </TabsContent>

        {/* Compliance Reports Tab */}
        <TabsContent value="compliance">
          <ComplianceReports />
        </TabsContent>

        {/* Network Security Tab */}
        <TabsContent value="network">
          <NetworkSecurity />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;