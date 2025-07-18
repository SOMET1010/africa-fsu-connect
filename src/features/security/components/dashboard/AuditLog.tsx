
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useSecurity } from '../../hooks/useSecurity';
import ActionIcon from '../shared/ActionIcon';

const AuditLog = () => {
  const { auditLogs } = useSecurity();

  return (
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
                <ActionIcon actionType={log.action_type} success={log.success} />
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
  );
};

export default AuditLog;
