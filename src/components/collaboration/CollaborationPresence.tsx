import { useState } from 'react';
import { Users, Eye, MessageCircle, Activity, Clock, BarChart3 } from 'lucide-react';
import { useRealTimeCollaboration, UserPresence } from '@/hooks/useRealTimeCollaboration';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { formatCollaborationTime, formatDetailedTime, formatTimeWithTimezone } from '@/utils/timeUtils';
import { RealTimeClock } from './RealTimeClock';
import { CollaborationTimeline } from './CollaborationTimeline';
import { CollaborationStats } from './CollaborationStats';
import { useAuth } from '@/contexts/AuthContext';

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
  
  const { user } = useAuth();
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
      <TooltipProvider>
        <div className={cn("flex items-center gap-2", className)}>
          <div className="flex -space-x-2">
            {displayUsers.slice(0, 5).map((user) => (
              <Tooltip key={user.user_id}>
                <TooltipTrigger>
                  <div className="relative">
                    <Avatar className="h-8 w-8 border-2 border-background">
                      <AvatarImage src={user.avatar_url} alt={user.user_name} />
                      <AvatarFallback className="text-xs">
                        {getInitials(user.user_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div 
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background",
                        getStatusColor(user.status)
                      )}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <p className="font-medium">{user.user_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.status === 'online' ? 'En ligne' : 
                       user.status === 'away' ? 'Absent' : 'Hors ligne'}
                    </p>
                    {user.current_action && (
                      <p className="text-xs">
                        Action: {user.current_action}
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          
          {displayUsers.length > 5 && (
            <Badge variant="secondary" className="text-xs">
              +{displayUsers.length - 5}
            </Badge>
          )}
          
          {isConnected && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Activity className="h-3 w-3 text-green-500" />
              <span>{activeUsers.length} actif{activeUsers.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </TooltipProvider>
    );
  }

  // Enhanced detailed view with temporal features
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Collaboration avancée
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
        
        {/* Real-time clock */}
        <div className="pt-2">
          <RealTimeClock showTimezone={true} className="justify-center" />
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="presence" className="w-full">
          <TabsList className="grid w-full grid-cols-4 text-xs">
            <TabsTrigger value="presence" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              Présence
            </TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-xs">
              <BarChart3 className="h-3 w-3 mr-1" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">
              <Activity className="h-3 w-3 mr-1" />
              Activité
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="presence" className="space-y-4 mt-4">
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
                        {formatTimeWithTimezone(user.last_seen)}
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
          </TabsContent>
          
          <TabsContent value="timeline" className="mt-4">
            <CollaborationTimeline 
              events={collaborationEvents} 
              maxEvents={15}
            />
          </TabsContent>
          
          <TabsContent value="stats" className="mt-4">
            <CollaborationStats 
              events={collaborationEvents}
              connectedUsers={connectedUsers}
              currentUserId={user?.id}
            />
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4 mt-4">
            {/* Recent collaboration events */}
            {collaborationEvents.length > 0 ? (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Activité récente en temps réel
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {collaborationEvents.slice(0, 10).map((event, index) => (
                    <div key={index} className="p-2 rounded-md bg-muted/50 border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{event.user_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatCollaborationTime(event.timestamp)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {event.type === 'user_joined' && 'A rejoint la collaboration'}
                        {event.type === 'user_left' && 'A quitté la collaboration'}
                        {event.type === 'action_performed' && event.data?.action}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDetailedTime(event.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aucune activité récente</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};