
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, MapPin, LogOut } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useSecurity } from '../../hooks/useSecurity';
import { getDeviceInfo } from '../../core/utils';

const ActiveSessions = () => {
  const { activeSessions, terminateSession } = useSecurity();

  const getDeviceIcon = (userAgent?: string) => {
    const deviceInfo = getDeviceInfo(userAgent);
    return deviceInfo.type === 'mobile' ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />;
  };

  const getDeviceName = (userAgent?: string) => {
    return getDeviceInfo(userAgent).name;
  };

  return (
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
                      {getDeviceName(session.user_agent)}
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
  );
};

export default ActiveSessions;
