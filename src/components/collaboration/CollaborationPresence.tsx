
import { useState } from 'react';
import { Users, Eye, MessageCircle, Activity } from 'lucide-react';
import { useRealTimeCollaboration, UserPresence } from '@/hooks/useRealTimeCollaboration';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CollaborationPresenceProps {
  roomId: string;
  className?: string;
  showDetails?: boolean;
}

export const CollaborationPresence = ({ 
  roomId, 
  className, 
  showDetails = false 
}: CollaborationPresenceProps) => {
  const {
    connectedUsers,
    collaborationEvents,
    isConnected,
    getUsersByPage,
    getActiveUsers,
  } = useRealTimeCollaboration(roomId);

  const [showAllUsers, setShowAllUsers] = useState(false);

  const activeUsers = getActiveUsers();
  const currentPageUsers = getUsersByPage(window.location.pathname);
  const displayUsers = showAllUsers ? connectedUsers : activeUsers;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isConnected && displayUsers.length === 0) {
    return null;
  }

  if (!showDetails) {
    // Compact view - just avatars
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-primary">
              Collaboration en temps réel
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
               <div className="flex flex-wrap gap-2">
                {displayUsers.map((user) => (
                  <Tooltip key={user.user_id}>
                    <TooltipTrigger asChild>
                      <button className="relative">
                        <Avatar className="h-8 w-8 border-2 border-background ring-2 ring-primary/20 transition-all hover:ring-primary/40">
                          <AvatarImage 
                            src={user.avatar_url || ''} 
                            alt={user.user_name || 'Utilisateur'} 
                          />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {(user.user_name || 'U').charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className={cn(
                          "absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background",
                          getStatusColor(user.status)
                        )} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        <p className="font-medium">{user.user_name || 'Utilisateur'}</p>
                        <p className="text-muted-foreground">
                          En ligne
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
              
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">{displayUsers.length}</span> utilisateur{displayUsers.length > 1 ? 's' : ''} en ligne
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Detailed view
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Collaboration
          </div>
          <div className="flex items-center gap-2">
            {isConnected && (
              <Badge variant="outline" className="text-xs">
                <Activity className="h-3 w-3 mr-1 text-green-500" />
                Connecté
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs">
              {activeUsers.length} utilisateur{activeUsers.length > 1 ? 's' : ''}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Active users on current page */}
        {currentPageUsers.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Sur cette page ({currentPageUsers.length})
            </h4>
            <div className="space-y-2">
              {currentPageUsers.map((user) => (
                <div key={user.user_id} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar_url} alt={user.user_name} />
                      <AvatarFallback className="text-xs">
                        {getInitials(user.user_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div 
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-background",
                        getStatusColor(user.status)
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.user_name}</p>
                    {user.current_action && (
                      <p className="text-xs text-muted-foreground truncate">
                        {user.current_action}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(user.last_seen), 'HH:mm', { locale: fr })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All connected users */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              Tous les utilisateurs connectés
            </h4>
            {connectedUsers.length > 3 && (
              <button
                onClick={() => setShowAllUsers(!showAllUsers)}
                className="text-xs text-primary hover:underline"
              >
                {showAllUsers ? 'Réduire' : `Voir tous (${connectedUsers.length})`}
              </button>
            )}
          </div>
          
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {displayUsers.slice(0, showAllUsers ? undefined : 3).map((user) => (
              <div key={user.user_id} className="flex items-center gap-2 text-sm">
                <div className="relative">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={user.avatar_url} alt={user.user_name} />
                    <AvatarFallback className="text-xs">
                      {getInitials(user.user_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div 
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full border border-background",
                      getStatusColor(user.status)
                    )}
                  />
                </div>
                <span className="flex-1 truncate">{user.user_name}</span>
                <span className="text-xs text-muted-foreground">
                  {user.page.split('/').pop() || 'Accueil'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent collaboration events */}
        {collaborationEvents.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Activité récente
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {collaborationEvents.slice(0, 5).map((event, index) => (
                <div key={index} className="text-xs text-muted-foreground">
                  <span className="font-medium">{event.user_name}</span>
                  {event.type === 'user_joined' && ' a rejoint'}
                  {event.type === 'user_left' && ' a quitté'}
                  {event.type === 'action_performed' && ` • ${event.data?.action}`}
                  <span className="ml-2">
                    {format(new Date(event.timestamp), 'HH:mm', { locale: fr })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
