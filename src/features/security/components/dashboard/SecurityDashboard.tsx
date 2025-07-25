
import { Shield, Users, Clock, BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSecurity } from '../../hooks/useSecurity';
import { formatSessionTimeout } from '../../core/utils';
import SecurityStatusCard from '../shared/SecurityStatusCard';
import SecurityPreferences from './SecurityPreferences';
import ActiveSessions from './ActiveSessions';
import AuditLog from './AuditLog';
import SecurityAnalytics from '../advanced/SecurityAnalytics';
import EnhancedWebAuthn from '../advanced/EnhancedWebAuthn';
import AnomalyDetection from '@/components/security/AnomalyDetection';
import AdvancedEncryption from '@/components/security/AdvancedEncryption';
import ComplianceReports from '@/components/security/ComplianceReports';
import NetworkSecurity from '@/components/security/NetworkSecurity';

const SecurityDashboard = () => {
  const { securityPreferences, activeSessions, isLoading } = useSecurity();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
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
    <div className="space-y-6 animate-fade-in">
      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SecurityStatusCard
          title="État de sécurité"
          value="Protégé"
          icon={Shield}
          variant="success"
        />
        <SecurityStatusCard
          title="Sessions actives"
          value={activeSessions?.length || 0}
          icon={Users}
          variant="info"
        />
        <SecurityStatusCard
          title="Délai d'expiration"
          value={formatSessionTimeout(securityPreferences?.session_timeout || 7200)}
          icon={Clock}
          variant="warning"
        />
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="audit">Journal</TabsTrigger>
          <TabsTrigger value="webauthn">WebAuthn</TabsTrigger>
          <TabsTrigger value="anomaly">Anomalies</TabsTrigger>
          <TabsTrigger value="encryption">Chiffrement</TabsTrigger>
          <TabsTrigger value="compliance">Conformité</TabsTrigger>
          <TabsTrigger value="network">Réseau</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="animate-fade-in">
          <SecurityAnalytics />
        </TabsContent>

        <TabsContent value="preferences" className="animate-fade-in">
          <SecurityPreferences />
        </TabsContent>

        <TabsContent value="sessions" className="animate-fade-in">
          <ActiveSessions />
        </TabsContent>

        <TabsContent value="audit" className="animate-fade-in">
          <AuditLog />
        </TabsContent>

        <TabsContent value="webauthn" className="animate-fade-in">
          <EnhancedWebAuthn />
        </TabsContent>

        <TabsContent value="anomaly" className="animate-fade-in">
          <AnomalyDetection />
        </TabsContent>

        <TabsContent value="encryption" className="animate-fade-in">
          <AdvancedEncryption />
        </TabsContent>

        <TabsContent value="compliance" className="animate-fade-in">
          <ComplianceReports />
        </TabsContent>

        <TabsContent value="network" className="animate-fade-in">
          <NetworkSecurity />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;
