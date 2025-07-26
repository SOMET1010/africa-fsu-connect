
import { useState } from "react";
import { Shield, Key, UserCheck, Clock, AlertTriangle, CheckCircle, Eye, Lock } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ModernButton } from "@/components/ui/modern-button";
import { AdaptiveInterface } from "@/components/layout/AdaptiveInterface";
import { SimplifiedSecurity } from "@/components/security/SimplifiedSecurity";
import { AdvancedSecurityControls } from "@/components/security/AdvancedSecurityControls";
import { ModernLoadingSpinner } from "@/components/ui/modern-loading-states";
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
        <AdaptiveInterface
          title="Configuration de Sécurité"
          description="Interface adaptée à votre niveau d'expertise"
          advancedContent={
            <AdvancedSecurityControls
              securityMetrics={securityMetrics}
              activeSessions={activeSessions || []}
              auditLogs={auditLogs}
              twoFactorEnabled={twoFactorEnabled}
              sessionTimeout={sessionTimeout}
              notifications={notifications}
              onToggleTwoFactor={handleTwoFactorToggle}
              onPasswordChange={handlePasswordChange}
              setSessionTimeout={setSessionTimeout}
              setNotifications={setNotifications}
            />
          }
        >
          <SimplifiedSecurity
            securityMetrics={securityMetrics}
            twoFactorEnabled={twoFactorEnabled}
            onToggleTwoFactor={() => handleTwoFactorToggle(!twoFactorEnabled)}
            onPasswordChange={handlePasswordChange}
          />
        </AdaptiveInterface>
      </PageContainer>
    </div>
  );
};

export default Security;
