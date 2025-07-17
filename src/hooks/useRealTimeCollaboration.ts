import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserPresence {
  user_id: string;
  user_name: string;
  avatar_url?: string;
  page: string;
  last_seen: string;
  status: 'online' | 'away' | 'offline';
  cursor_position?: { x: number; y: number };
  current_action?: string;
}

export interface CollaborationEvent {
  type: 'user_joined' | 'user_left' | 'cursor_moved' | 'action_performed';
  user_id: string;
  user_name: string;
  data?: any;
  timestamp: string;
}

export const useRealTimeCollaboration = (roomId: string) => {
  const [connectedUsers, setConnectedUsers] = useState<UserPresence[]>([]);
  const [collaborationEvents, setCollaborationEvents] = useState<CollaborationEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { user, profile } = useAuth();

  const channel = supabase.channel(`collaboration_${roomId}`);

  // Track user presence
  const updatePresence = useCallback(async (updates: Partial<UserPresence>) => {
    if (!user || !profile) return;

    const presence: UserPresence = {
      user_id: user.id,
      user_name: `${profile.first_name} ${profile.last_name}`.trim() || profile.email || 'Utilisateur',
      avatar_url: profile.avatar_url || undefined,
      page: window.location.pathname,
      last_seen: new Date().toISOString(),
      status: 'online',
      ...updates,
    };

    await channel.track(presence);
  }, [user, profile, channel]);

  // Handle presence sync
  const handlePresenceSync = useCallback(() => {
    const state = channel.presenceState<UserPresence>();
    const users = Object.values(state).flat();
    setConnectedUsers(users);
  }, [channel]);

  // Handle user joining
  const handlePresenceJoin = useCallback(({ newPresences }: { newPresences: UserPresence[] }) => {
    newPresences.forEach((presence) => {
      const event: CollaborationEvent = {
        type: 'user_joined',
        user_id: presence.user_id,
        user_name: presence.user_name,
        timestamp: new Date().toISOString(),
      };
      setCollaborationEvents(prev => [event, ...prev.slice(0, 49)]);
    });
  }, []);

  // Handle user leaving
  const handlePresenceLeave = useCallback(({ leftPresences }: { leftPresences: UserPresence[] }) => {
    leftPresences.forEach((presence) => {
      const event: CollaborationEvent = {
        type: 'user_left',
        user_id: presence.user_id,
        user_name: presence.user_name,
        timestamp: new Date().toISOString(),
      };
      setCollaborationEvents(prev => [event, ...prev.slice(0, 49)]);
    });
  }, []);

  // Broadcast collaboration event
  const broadcastEvent = useCallback(async (eventData: Omit<CollaborationEvent, 'timestamp'>) => {
    const event: CollaborationEvent = {
      ...eventData,
      timestamp: new Date().toISOString(),
    };

    await channel.send({
      type: 'broadcast',
      event: 'collaboration_event',
      payload: event,
    });
  }, [channel]);

  // Handle received collaboration events
  const handleCollaborationEvent = useCallback((payload: { payload: CollaborationEvent }) => {
    const event = payload.payload;
    setCollaborationEvents(prev => [event, ...prev.slice(0, 49)]);
  }, []);

  // Track cursor movement
  const trackCursorMovement = useCallback((x: number, y: number) => {
    updatePresence({
      cursor_position: { x, y },
      last_seen: new Date().toISOString(),
    });
  }, [updatePresence]);

  // Track user action
  const trackUserAction = useCallback(async (action: string, data?: any) => {
    await updatePresence({
      current_action: action,
      last_seen: new Date().toISOString(),
    });

    await broadcastEvent({
      type: 'action_performed',
      user_id: user?.id || '',
      user_name: `${profile?.first_name} ${profile?.last_name}`.trim() || profile?.email || 'Utilisateur',
      data: { action, ...data },
    });
  }, [updatePresence, broadcastEvent, user, profile]);

  // Set user status
  const setUserStatus = useCallback((status: 'online' | 'away' | 'offline') => {
    updatePresence({ status });
  }, [updatePresence]);

  // Get users by page
  const getUsersByPage = useCallback((page: string) => {
    return connectedUsers.filter(user => user.page === page);
  }, [connectedUsers]);

  // Get active users (online in last 5 minutes)
  const getActiveUsers = useCallback(() => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return connectedUsers.filter(user => 
      new Date(user.last_seen) > fiveMinutesAgo && user.status !== 'offline'
    );
  }, [connectedUsers]);

  // Initialize real-time collaboration
  useEffect(() => {
    if (!user || !profile) return;

    // Set up presence tracking
    channel
      .on('presence', { event: 'sync' }, handlePresenceSync)
      .on('presence', { event: 'join' }, handlePresenceJoin)
      .on('presence', { event: 'leave' }, handlePresenceLeave)
      .on('broadcast', { event: 'collaboration_event' }, handleCollaborationEvent)
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          await updatePresence({});
        }
      });

    // Track mouse movement (throttled)
    let mouseTimeout: NodeJS.Timeout;
    const handleMouseMove = (e: MouseEvent) => {
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        trackCursorMovement(e.clientX, e.clientY);
      }, 100);
    };

    // Track page visibility
    const handleVisibilityChange = () => {
      setUserStatus(document.hidden ? 'away' : 'online');
    };

    // Track page unload
    const handleBeforeUnload = () => {
      setUserStatus('offline');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearTimeout(mouseTimeout);
      
      // Set user offline before cleanup
      setUserStatus('offline');
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [user, profile, roomId]);

  return {
    connectedUsers,
    collaborationEvents,
    isConnected,
    updatePresence,
    broadcastEvent,
    trackUserAction,
    setUserStatus,
    getUsersByPage,
    getActiveUsers,
    trackCursorMovement,
  };
};