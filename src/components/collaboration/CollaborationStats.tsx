import { TrendingUp, Clock, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCollaborationStats } from '@/hooks/useCollaborationStats';
import { CollaborationEvent, UserPresence } from '@/hooks/useRealTimeCollaboration';
import { formatDuration } from '@/utils/timeUtils';
import { AnimatedCounter } from '@/components/ui/animated-counter';

interface CollaborationStatsProps {
  events: CollaborationEvent[];
  connectedUsers: UserPresence[];
  currentUserId?: string;
  className?: string;
}

export const CollaborationStats = ({ 
  events, 
  connectedUsers, 
  currentUserId, 
  className 
}: CollaborationStatsProps) => {
  const {
    sessionStats,
    collaborationStats,
    userPresenceDurations,
    getBestCollaborationTimes,
  } = useCollaborationStats(events, connectedUsers, currentUserId);

  const getPatternPercentage = (pattern: { morning: number; afternoon: number; evening: number; night: number }) => {
    const max = Math.max(pattern.morning, pattern.afternoon, pattern.evening, pattern.night);
    return {
      morning: max > 0 ? (pattern.morning / max) * 100 : 0,
      afternoon: max > 0 ? (pattern.afternoon / max) * 100 : 0,
      evening: max > 0 ? (pattern.evening / max) * 100 : 0,
      night: max > 0 ? (pattern.night / max) * 100 : 0,
    };
  };

  const patternPercentages = getPatternPercentage(collaborationStats.currentUserPattern);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Session Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            Session actuelle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Durée</span>
            <Badge variant="outline">
              {formatDuration(sessionStats.sessionStart)}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Sessions aujourd'hui</span>
            <AnimatedCounter 
              value={sessionStats.totalSessionsToday} 
              className="text-sm font-medium"
            />
          </div>
        </CardContent>
      </Card>

      {/* Collaboration Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4" />
            Aperçu de la collaboration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Aujourd'hui</div>
              <div className="flex items-center gap-2">
                <AnimatedCounter 
                  value={collaborationStats.eventsToday} 
                  className="text-lg font-bold"
                />
                <span className="text-xs text-muted-foreground">événements</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Cette semaine</div>
              <div className="flex items-center gap-2">
                <AnimatedCounter 
                  value={collaborationStats.eventsThisWeek} 
                  className="text-lg font-bold"
                />
                <span className="text-xs text-muted-foreground">événements</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Utilisateurs actifs aujourd'hui</div>
              <AnimatedCounter 
                value={collaborationStats.uniqueUsersToday} 
                className="text-sm font-medium"
              />
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Utilisateurs cette semaine</div>
              <AnimatedCounter 
                value={collaborationStats.uniqueUsersThisWeek} 
                className="text-sm font-medium"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Presence Durations */}
      {userPresenceDurations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              Durée de présence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userPresenceDurations.slice(0, 5).map((user) => (
                <div key={user.user_id} className="flex items-center justify-between">
                  <span className="text-sm truncate">{user.user_name}</span>
                  <Badge variant="outline" className="text-xs">
                    {user.presenceDuration > 0 ? `${user.presenceDuration}m` : 'Nouveau'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Pattern */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            Votre modèle d'activité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Matin (6h-12h)</span>
              <span className="text-xs font-medium">{Math.round(collaborationStats.currentUserPattern.morning)}%</span>
            </div>
            <Progress value={patternPercentages.morning} className="h-1" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Après-midi (12h-18h)</span>
              <span className="text-xs font-medium">{Math.round(collaborationStats.currentUserPattern.afternoon)}%</span>
            </div>
            <Progress value={patternPercentages.afternoon} className="h-1" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Soirée (18h-22h)</span>
              <span className="text-xs font-medium">{Math.round(collaborationStats.currentUserPattern.evening)}%</span>
            </div>
            <Progress value={patternPercentages.evening} className="h-1" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Nuit (22h-6h)</span>
              <span className="text-xs font-medium">{Math.round(collaborationStats.currentUserPattern.night)}%</span>
            </div>
            <Progress value={patternPercentages.night} className="h-1" />
          </div>

          <div className="mt-4 p-2 bg-muted rounded-md">
            <p className="text-xs text-muted-foreground">
              💡 {getBestCollaborationTimes()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};