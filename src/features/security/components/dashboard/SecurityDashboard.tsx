
import { Shield, Users, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSecurity } from '../../hooks/useSecurity';
import { formatSessionTimeout } from '../../core/utils';
import SecurityStatusCard from '../shared/SecurityStatusCard';
import SecurityPreferences from './SecurityPreferences';
import ActiveSessions from './ActiveSessions';
import AuditLog from './AuditLog';

const SecurityDashboard = () => {
  const { securityPreferences, activeSessions, isLoading } = useSecurity();

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

      <Tabs defaultValue="preferences" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="audit">Journal d'audit</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences">
          <SecurityPreferences />
        </TabsContent>

        <TabsContent value="sessions">
          <ActiveSessions />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLog />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;
