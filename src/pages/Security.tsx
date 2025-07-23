
import { useState } from "react";
import { Shield, Key, UserCheck, Clock, AlertTriangle, CheckCircle, Eye, Lock } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ModernButton } from "@/components/ui/modern-button";
import { GlassCard } from "@/components/ui/glass-card";
import { ModernSecurityCard } from "@/components/security/ModernSecurityCard";
import { ModernInput, ModernSelect, ModernSwitch } from "@/components/forms/ModernFormFields";
import { ModernModal, ModernModalFooter } from "@/components/ui/modern-modal";
import { ModernLoadingSpinner } from "@/components/ui/modern-loading-states";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { useSecurity } from "@/features/security/hooks/useSecurity";

const Security = () => {
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("7200");
  const [notifications, setNotifications] = useState(true);
  
  const { securityPreferences, activeSessions, isLoading } = useSecurity();

  const securityMetrics = [
    {
      title: "Niveau de sécurité",
      description: "État global de la sécurité",
      icon: Shield,
      status: "active" as const,
      value: "Élevé"
    },
    {
      title: "Authentification 2FA",
      description: "Double authentification",
      icon: Key,
      status: twoFactorEnabled ? "active" as const : "inactive" as const,
      value: twoFactorEnabled ? "Activée" : "Désactivée"
    },
    {
      title: "Sessions actives",
      description: "Connexions en cours",
      icon: UserCheck,
      status: "active" as const,
      value: activeSessions?.length || 0
    },
    {
      title: "Délai d'expiration",
      description: "Timeout de session",
      icon: Clock,
      status: "active" as const,
      value: `${parseInt(sessionTimeout) / 60}min`
    }
  ];

  const auditLogs = [
    {
      id: 1,
      action: "Connexion réussie",
      ip: "192.168.1.100",
      location: "Dakar, Sénégal",
      timestamp: new Date().toISOString(),
      status: "success"
    },
    {
      id: 2,
      action: "Modification mot de passe",
      ip: "192.168.1.100",
      location: "Dakar, Sénégal",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: "success"
    },
    {
      id: 3,
      action: "Tentative de connexion échouée",
      ip: "10.0.0.1",
      location: "Inconnu",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: "error"
    }
  ];

  const handleTwoFactorToggle = async (enabled: boolean) => {
    if (enabled) {
      setShowTwoFactorModal(true);
    } else {
      setLoading(true);
      // Simuler la désactivation
      setTimeout(() => {
        setTwoFactorEnabled(false);
        setLoading(false);
      }, 1000);
    }
  };

  const handlePasswordChange = () => {
    setShowPasswordModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <PageHeader
          title="Sécurité et Authentification"
          description="Gérez vos paramètres de sécurité et surveillez l'activité de votre compte"
          badge="Professionnel"
          gradient
        />
        <PageContainer>
          <div className="flex items-center justify-center h-64">
            <ModernLoadingSpinner size="lg" />
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Sécurité et Authentification"
        description="Gérez vos paramètres de sécurité et surveillez l'activité de votre compte"
        badge="Professionnel"
        gradient
        actions={
          <>
            <ModernButton variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Exporter rapport
            </ModernButton>
            <ModernButton size="sm">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Configurer alertes
            </ModernButton>
          </>
        }
      />
      
      <PageContainer>
        <div className="space-y-8">
          {/* Métriques de sécurité */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityMetrics.map((metric, index) => (
              <ModernSecurityCard
                key={index}
                title={metric.title}
                description={metric.description}
                icon={metric.icon}
                status={metric.status}
                value={metric.value}
                className="animate-fade-in"
              />
            ))}
          </div>

          {/* Contenu principal */}
          <Tabs defaultValue="settings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="audit">Journal d'audit</TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="space-y-6">
              <GlassCard variant="default" className="p-6">
                <h3 className="text-lg font-semibold mb-6">Paramètres de sécurité</h3>
                
                <div className="space-y-6">
                  <ModernSwitch
                    label="Authentification à deux facteurs"
                    description="Ajoutez une couche de sécurité supplémentaire avec un code de vérification"
                    checked={twoFactorEnabled}
                    onChange={handleTwoFactorToggle}
                  />
                  
                  <ModernSelect
                    label="Délai d'expiration de session"
                    description="Durée avant déconnexion automatique"
                    value={sessionTimeout}
                    onChange={setSessionTimeout}
                    options={[
                      { value: "1800", label: "30 minutes" },
                      { value: "3600", label: "1 heure" },
                      { value: "7200", label: "2 heures" },
                      { value: "14400", label: "4 heures" },
                      { value: "28800", label: "8 heures" }
                    ]}
                  />
                  
                  <ModernSwitch
                    label="Notifications de sécurité"
                    description="Recevez des alertes par email pour les activités suspectes"
                    checked={notifications}
                    onChange={setNotifications}
                  />
                  
                  <div className="pt-4 border-t border-border/50">
                    <ModernButton 
                      onClick={handlePasswordChange}
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Changer le mot de passe
                    </ModernButton>
                  </div>
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-6">
              <GlassCard variant="default" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Sessions actives</h3>
                  <Badge variant="secondary">
                    <AnimatedCounter value={activeSessions?.length || 0} className="mr-1" />
                    sessions
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {activeSessions?.length > 0 ? activeSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">Appareil inconnu</p>
                        <p className="text-sm text-muted-foreground">
                          {session.ip_address} • {session.location}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Dernière activité: {new Date(session.last_activity).toLocaleString()}
                        </p>
                      </div>
                      <ModernButton variant="outline" size="sm">
                        Révoquer
                      </ModernButton>
                    </div>
                  )) : (
                    <p className="text-center text-muted-foreground py-8">
                      Aucune session active
                    </p>
                  )}
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="audit" className="space-y-6">
              <GlassCard variant="default" className="p-6">
                <h3 className="text-lg font-semibold mb-6">Journal d'audit</h3>
                
                <div className="space-y-4">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg">
                      <div className={`p-2 rounded-full ${
                        log.status === 'success' ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'
                      }`}>
                        {log.status === 'success' ? 
                          <CheckCircle className="h-4 w-4" /> : 
                          <AlertTriangle className="h-4 w-4" />
                        }
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{log.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {log.ip} • {log.location}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>

      {/* Modal 2FA */}
      <ModernModal
        isOpen={showTwoFactorModal}
        onClose={() => setShowTwoFactorModal(false)}
        title="Configurer l'authentification à deux facteurs"
        description="Suivez les étapes pour sécuriser votre compte"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Scannez le QR code avec votre application d'authentification
          </p>
          <div className="flex justify-center p-8 bg-muted/30 rounded-lg">
            <div className="w-32 h-32 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-xs text-center">QR Code</span>
            </div>
          </div>
          <ModernInput
            label="Code de vérification"
            placeholder="Entrez le code à 6 chiffres"
            type="text"
          />
        </div>
        <ModernModalFooter>
          <ModernButton variant="outline" onClick={() => setShowTwoFactorModal(false)}>
            Annuler
          </ModernButton>
          <ModernButton onClick={() => {
            setTwoFactorEnabled(true);
            setShowTwoFactorModal(false);
          }}>
            Activer 2FA
          </ModernButton>
        </ModernModalFooter>
      </ModernModal>

      {/* Modal changement de mot de passe */}
      <ModernModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Changer le mot de passe"
        description="Créez un nouveau mot de passe sécurisé"
      >
        <div className="space-y-4">
          <ModernInput
            label="Mot de passe actuel"
            type="password"
            placeholder="Entrez votre mot de passe actuel"
          />
          <ModernInput
            label="Nouveau mot de passe"
            type="password"
            placeholder="Entrez votre nouveau mot de passe"
          />
          <ModernInput
            label="Confirmer le nouveau mot de passe"
            type="password"
            placeholder="Confirmez votre nouveau mot de passe"
          />
        </div>
        <ModernModalFooter>
          <ModernButton variant="outline" onClick={() => setShowPasswordModal(false)}>
            Annuler
          </ModernButton>
          <ModernButton onClick={() => setShowPasswordModal(false)}>
            Changer le mot de passe
          </ModernButton>
        </ModernModalFooter>
      </ModernModal>
    </div>
  );
};

export default Security;
