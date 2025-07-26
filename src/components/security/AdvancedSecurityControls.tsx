import { ModernButton } from "@/components/ui/modern-button";
import { ModernCard } from "@/components/ui/modern-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Key, 
  UserCheck, 
  Clock, 
  AlertTriangle,
  Eye,
  Settings,
  BarChart3,
  Lock
} from "lucide-react";

interface AdvancedSecurityControlsProps {
  securityMetrics: any[];
  activeSessions: any[];
  auditLogs: any[];
  twoFactorEnabled: boolean;
  sessionTimeout: string;
  notifications: boolean;
  onToggleTwoFactor: (enabled: boolean) => void;
  onPasswordChange: () => void;
  setSessionTimeout: (timeout: string) => void;
  setNotifications: (enabled: boolean) => void;
}

export const AdvancedSecurityControls = ({
  securityMetrics,
  activeSessions,
  auditLogs,
  twoFactorEnabled,
  sessionTimeout,
  notifications,
  onToggleTwoFactor,
  onPasswordChange,
  setSessionTimeout,
  setNotifications
}: AdvancedSecurityControlsProps) => {
  return (
    <div className="space-y-6">
      {/* Advanced Tools */}
      <ModernCard variant="glass" className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Outils Avancés</h3>
            <p className="text-sm text-muted-foreground">
              Configuration détaillée et monitoring sécurisé
            </p>
          </div>
          <div className="flex gap-2">
            <ModernButton variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Exporter rapport
            </ModernButton>
            <ModernButton variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configuration
            </ModernButton>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <ModernButton variant="outline" size="sm" className="justify-start">
            <Shield className="h-4 w-4 mr-2" />
            Audit Sécurité
          </ModernButton>
          <ModernButton variant="outline" size="sm" className="justify-start">
            <Key className="h-4 w-4 mr-2" />
            2FA Avancé
          </ModernButton>
          <ModernButton variant="outline" size="sm" className="justify-start">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </ModernButton>
          <ModernButton variant="outline" size="sm" className="justify-start">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Alertes
          </ModernButton>
        </div>
      </ModernCard>

      {/* Advanced Security Interface */}
      <ModernCard variant="glass" className="overflow-hidden">
        <Tabs defaultValue="settings" className="w-full">
          <div className="border-b border-border/30 px-6 pt-6">
            <TabsList className="grid w-full max-w-lg grid-cols-3 bg-muted/30">
              <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-background">
                <Settings className="h-4 w-4" />
                Paramètres
              </TabsTrigger>
              <TabsTrigger value="sessions" className="flex items-center gap-2 data-[state=active]:bg-background">
                <UserCheck className="h-4 w-4" />
                Sessions
              </TabsTrigger>
              <TabsTrigger value="audit" className="flex items-center gap-2 data-[state=active]:bg-background">
                <BarChart3 className="h-4 w-4" />
                Journal d'audit
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="settings" className="p-6 mt-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Paramètres de Sécurité Avancés</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configuration complète des options de sécurité
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-medium mb-2">Authentification à deux facteurs</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Sécurisez votre compte avec une couche supplémentaire
                    </p>
                    <ModernButton 
                      onClick={() => onToggleTwoFactor(!twoFactorEnabled)}
                      variant={twoFactorEnabled ? "outline" : "default"}
                      size="sm"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      {twoFactorEnabled ? 'Désactiver 2FA' : 'Activer 2FA'}
                    </ModernButton>
                  </div>
                  
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-medium mb-2">Mot de passe</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Modifier votre mot de passe principal
                    </p>
                    <ModernButton onClick={onPasswordChange} variant="outline" size="sm">
                      <Lock className="h-4 w-4 mr-2" />
                      Changer le mot de passe
                    </ModernButton>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-medium mb-2">Délai d'expiration</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Temps avant déconnexion automatique
                    </p>
                    <select 
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      className="w-full p-2 border border-border rounded-lg"
                    >
                      <option value="1800">30 minutes</option>
                      <option value="3600">1 heure</option>
                      <option value="7200">2 heures</option>
                      <option value="14400">4 heures</option>
                    </select>
                  </div>
                  
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-medium mb-2">Notifications</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Alertes de sécurité par email
                    </p>
                    <ModernButton 
                      onClick={() => setNotifications(!notifications)}
                      variant={notifications ? "default" : "outline"}
                      size="sm"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      {notifications ? 'Activées' : 'Désactivées'}
                    </ModernButton>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sessions" className="p-6 mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Sessions Actives Détaillées</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Gestion avancée des connexions actives
                </p>
              </div>
              
              <div className="space-y-3">
                {activeSessions?.length > 0 ? activeSessions.map((session) => (
                  <div key={session.id} className="p-4 bg-muted/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{session.user_agent || "Appareil inconnu"}</p>
                        <p className="text-sm text-muted-foreground">
                          IP: {session.ip_address} • Localisation: {session.location}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Dernière activité: {new Date(session.last_activity).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <ModernButton variant="outline" size="sm">
                          Détails
                        </ModernButton>
                        <ModernButton variant="destructive" size="sm">
                          Révoquer
                        </ModernButton>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-muted-foreground py-8">
                    Aucune session active
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="audit" className="p-6 mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Journal d'Audit Complet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Historique détaillé des activités de sécurité
                </p>
              </div>
              
              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-4 p-4 bg-muted/20 rounded-lg">
                    <div className={`p-2 rounded-full ${
                      log.status === 'success' ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'
                    }`}>
                      {log.status === 'success' ? 
                        <UserCheck className="h-4 w-4" /> : 
                        <AlertTriangle className="h-4 w-4" />
                      }
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{log.action}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        IP: {log.ip} • Localisation: {log.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </ModernCard>
    </div>
  );
};