
import { useSecurity } from '../../hooks/useSecurity';
import { SectionCard } from '@/components/layout/SectionCard';
import { Badge } from '@/components/ui/badge';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckCircle, AlertCircle, XCircle, Clock, Info, LogOut } from 'lucide-react';

const AuditLog = () => {
  const { auditLogs } = useSecurity();

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'login':
      case 'signin':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'logout':
      case 'signout':
        return <LogOut className="h-4 w-4 text-primary" />;
      case 'login_failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <SectionCard 
      title="Journal d'audit" 
      description="Historique des activités de sécurité sur votre compte"
      variant="default"
    >
      {auditLogs?.length === 0 ? (
        <div className="text-muted-foreground text-center py-4">
          Aucune activité trouvée
        </div>
      ) : (
        <div className="space-y-3">
          {auditLogs?.map((log) => (
            <div 
              key={log.id} 
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              {getActionIcon(log.action_type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium capitalize">
                    {log.action_type.replace('_', ' ')}
                  </p>
                  <StatusIndicator 
                    status={log.success ? 'success' : 'error'} 
                    label={log.success ? 'Succès' : 'Échec'}
                  />
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
    </SectionCard>
  );
};

export default AuditLog;
