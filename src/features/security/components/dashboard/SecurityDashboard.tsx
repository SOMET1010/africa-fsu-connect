
import { Shield, Users, Clock, Settings, Eye, FileText } from 'lucide-react';
import { ModernTabsWithIcon } from '@/components/ui/modern-tabs';
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

  const tabs = [
    {
      value: "preferences",
      label: "Préférences",
      icon: <Settings className="h-4 w-4" />,
      content: <SecurityPreferences />
    },
    {
      value: "sessions",
      label: "Sessions",
      icon: <Eye className="h-4 w-4" />,
      content: <ActiveSessions />
    },
    {
      value: "audit",
      label: "Journal d'audit",
      icon: <FileText className="h-4 w-4" />,
      content: <AuditLog />
    }
  ];

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

      <ModernTabsWithIcon tabs={tabs} defaultValue="preferences" />
    </div>
  );
};

export default SecurityDashboard;
