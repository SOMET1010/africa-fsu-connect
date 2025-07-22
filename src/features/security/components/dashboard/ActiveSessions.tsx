
import { useSecurity } from '../../hooks/useSecurity';
import { SectionCard } from '@/components/layout/SectionCard';
import { Button } from '@/components/ui/button';
import { ProfessionalCard } from '@/components/ui/professional-card';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Monitor, Smartphone, MapPin, LogOut } from 'lucide-react';

const ActiveSessions = () => {
  const { activeSessions, terminateSession } = useSecurity();

  const getDeviceIcon = (userAgent?: string) => {
    if (!userAgent) return Monitor;
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
      return Smartphone;
    }
    return Monitor;
  };

  const getBrowserName = (userAgent?: string) => {
    if (!userAgent) return 'Navigateur inconnu';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Navigateur inconnu';
  };

  return (
    <SectionCard 
      title="Sessions actives" 
      description="Gérez vos sessions de connexion actives"
      variant="default"
    >
      {activeSessions?.length === 0 ? (
        <div className="text-muted-foreground text-center py-4">
          Aucune session active trouvée
        </div>
      ) : (
        <div className="grid gap-4">
          {activeSessions?.map((session) => (
            <ProfessionalCard
              key={session.id}
              title={getBrowserName(session.user_agent)}
              description={
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{session.location || session.ip_address || 'Localisation inconnue'}</span>
                </div>
              }
              icon={getDeviceIcon(session.user_agent)}
              variant="default"
              size="sm"
              actions={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => terminateSession.mutate(session.id)}
                  disabled={terminateSession.isPending}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Terminer
                </Button>
              }
            >
              <p className="text-sm text-muted-foreground">
                Dernière activité: {formatDistanceToNow(new Date(session.last_activity), { 
                  addSuffix: true, 
                  locale: fr 
                })}
              </p>
            </ProfessionalCard>
          ))}
        </div>
      )}
    </SectionCard>
  );
};

export default ActiveSessions;
