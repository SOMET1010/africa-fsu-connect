import { useState, useEffect, useMemo } from 'react';
import { CollaborationEvent, UserPresence } from '@/hooks/useRealTimeCollaboration';
import { getCollaborationStats, getPeakCollaborationHours, getActivityPattern } from '@/utils/timeUtils';

export interface SessionStats {
  sessionStart: string;
  currentSessionDuration: number;
  totalSessionsToday: number;
  averageSessionDuration: number;
}

export interface CollaborationStats {
  eventsToday: number;
  eventsThisWeek: number;
  uniqueUsersToday: number;
  uniqueUsersThisWeek: number;
  peakHours: number[];
  currentUserPattern: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
}

export const useCollaborationStats = (
  events: CollaborationEvent[],
  connectedUsers: UserPresence[],
  currentUserId?: string
) => {
  const [sessionStart] = useState(new Date().toISOString());
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    sessionStart,
    currentSessionDuration: 0,
    totalSessionsToday: 1,
    averageSessionDuration: 0,
  });

  // Calculate collaboration stats
  const collaborationStats = useMemo((): CollaborationStats => {
    const stats = getCollaborationStats(events);
    const peakHours = getPeakCollaborationHours(events);
    
    const currentUserEvents = currentUserId 
      ? events.filter(event => event.user_id === currentUserId)
      : [];
    const currentUserPattern = getActivityPattern(currentUserEvents) as {
      morning: number;
      afternoon: number;
      evening: number;
      night: number;
    };

    return {
      ...stats,
      peakHours,
      currentUserPattern,
    };
  }, [events, currentUserId]);

  // Update session duration every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(sessionStart);
      const duration = Math.floor((now.getTime() - start.getTime()) / (1000 * 60));
      
      setSessionStats(prev => ({
        ...prev,
        currentSessionDuration: duration,
      }));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [sessionStart]);

  // Calculate presence duration for each user
  const userPresenceDurations = useMemo(() => {
    return connectedUsers.map(user => {
      const userJoinEvent = events
        .filter(event => event.user_id === user.user_id && event.type === 'user_joined')
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

      if (!userJoinEvent) return { ...user, presenceDuration: 0 };

      const joinTime = new Date(userJoinEvent.timestamp);
      const now = new Date();
      const duration = Math.floor((now.getTime() - joinTime.getTime()) / (1000 * 60));

      return {
        ...user,
        presenceDuration: duration,
      };
    });
  }, [connectedUsers, events]);

  // Get best collaboration times suggestion
  const getBestCollaborationTimes = () => {
    const { peakHours } = collaborationStats;
    
    if (peakHours.length === 0) {
      return 'Données insuffisantes pour des recommandations';
    }

    const timeRanges = peakHours.map(hour => {
      if (hour >= 6 && hour < 12) return 'matin';
      if (hour >= 12 && hour < 18) return 'après-midi';
      if (hour >= 18 && hour < 22) return 'soirée';
      return 'nuit';
    });

    const uniqueRanges = [...new Set(timeRanges)];
    
    if (uniqueRanges.length === 1) {
      return `Les meilleures heures de collaboration sont le ${uniqueRanges[0]}`;
    }

    return `Les meilleures heures de collaboration sont le ${uniqueRanges.slice(0, -1).join(', ')} et le ${uniqueRanges[uniqueRanges.length - 1]}`;
  };

  return {
    sessionStats,
    collaborationStats,
    userPresenceDurations,
    getBestCollaborationTimes,
  };
};