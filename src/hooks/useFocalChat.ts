import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useCallback, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';

// Types
export interface FocalConversation {
  id: string;
  type: 'country_team' | 'direct' | 'group';
  country_code: string | null;
  name: string | null;
  created_at: string;
  updated_at: string;
  unread_count?: number;
  last_message?: FocalMessage;
  participants?: FocalParticipant[];
}

export interface FocalParticipant {
  id: string;
  conversation_id: string;
  focal_point_id: string;
  user_id: string;
  joined_at: string;
  last_read_at: string | null;
  is_muted: boolean;
  focal_point?: {
    first_name: string;
    last_name: string;
    country_code: string;
  };
}

export interface FocalMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_user_id: string;
  content: string;
  attachment_url: string | null;
  attachment_type: string | null;
  indicator_reference: string | null;
  is_system_message: boolean;
  created_at: string;
  edited_at: string | null;
  sender?: {
    first_name: string;
    last_name: string;
  };
}

// Hook pour récupérer les conversations
export function useConversations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['focal-conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: conversations, error } = await supabase
        .from('focal_conversations')
        .select(`
          *,
          focal_conversation_participants!inner(
            id,
            focal_point_id,
            user_id,
            last_read_at,
            is_muted,
            focal_points(first_name, last_name, country_code)
          )
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Récupérer le dernier message et le compteur non lus pour chaque conversation
      const conversationsWithDetails = await Promise.all(
        (conversations || []).map(async (conv) => {
          // Dernier message
          const { data: lastMessage } = await supabase
            .from('focal_messages')
            .select('*, focal_points!focal_messages_sender_id_fkey(first_name, last_name)')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Compteur non lus
          const myParticipant = conv.focal_conversation_participants.find(
            (p: any) => p.user_id === user.id
          );
          
          let unreadCount = 0;
          if (myParticipant?.last_read_at) {
            const { count } = await supabase
              .from('focal_messages')
              .select('*', { count: 'exact', head: true })
              .eq('conversation_id', conv.id)
              .gt('created_at', myParticipant.last_read_at);
            unreadCount = count || 0;
          } else {
            const { count } = await supabase
              .from('focal_messages')
              .select('*', { count: 'exact', head: true })
              .eq('conversation_id', conv.id);
            unreadCount = count || 0;
          }

          return {
            ...conv,
            last_message: lastMessage,
            unread_count: unreadCount,
            participants: conv.focal_conversation_participants.map((p: any) => ({
              ...p,
              focal_point: p.focal_points
            }))
          } as FocalConversation;
        })
      );

      return conversationsWithDetails;
    },
    enabled: !!user,
  });
}

// Hook pour récupérer les messages d'une conversation
export function useMessages(conversationId: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['focal-messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];

      const { data, error } = await supabase
        .from('focal_messages')
        .select(`
          *,
          focal_points!focal_messages_sender_id_fkey(first_name, last_name)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []).map((msg: any) => ({
        ...msg,
        sender: msg.focal_points
      })) as FocalMessage[];
    },
    enabled: !!conversationId && !!user,
  });
}

// Hook pour envoyer un message
export function useSendMessage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      conversationId,
      content,
      indicatorReference,
    }: {
      conversationId: string;
      content: string;
      indicatorReference?: string;
    }) => {
      if (!user) throw new Error('Non authentifié');

      // Récupérer le focal point de l'utilisateur
      const { data: focalPoint, error: fpError } = await supabase
        .from('focal_points')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (fpError || !focalPoint) throw new Error('Point focal non trouvé');

      const { data, error } = await supabase
        .from('focal_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: focalPoint.id,
          sender_user_id: user.id,
          content,
          indicator_reference: indicatorReference || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour le timestamp de la conversation
      await supabase
        .from('focal_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['focal-messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['focal-conversations'] });
    },
  });
}

// Hook pour marquer les messages comme lus
export function useMarkAsRead() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      if (!user) throw new Error('Non authentifié');

      const { error } = await supabase
        .from('focal_conversation_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focal-conversations'] });
      queryClient.invalidateQueries({ queryKey: ['focal-unread-count'] });
    },
  });
}

// Hook pour le compteur total de messages non lus
export function useUnreadCount() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['focal-unread-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;

      const { data: conversations } = await supabase
        .from('focal_conversations')
        .select(`
          id,
          focal_conversation_participants!inner(
            user_id,
            last_read_at
          )
        `);

      if (!conversations) return 0;

      let totalUnread = 0;
      for (const conv of conversations) {
        const myParticipant = conv.focal_conversation_participants.find(
          (p: any) => p.user_id === user.id
        );

        if (myParticipant?.last_read_at) {
          const { count } = await supabase
            .from('focal_messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .gt('created_at', myParticipant.last_read_at);
          totalUnread += count || 0;
        } else {
          const { count } = await supabase
            .from('focal_messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id);
          totalUnread += count || 0;
        }
      }

      return totalUnread;
    },
    enabled: !!user,
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
  });
}

// Hook pour les mises à jour en temps réel
export function useRealtimeMessages(conversationId: string | null) {
  const queryClient = useQueryClient();
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    const newChannel = supabase
      .channel(`focal-messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'focal_messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['focal-messages', conversationId] });
          queryClient.invalidateQueries({ queryKey: ['focal-conversations'] });
          queryClient.invalidateQueries({ queryKey: ['focal-unread-count'] });
        }
      )
      .subscribe();

    setChannel(newChannel);

    return () => {
      newChannel.unsubscribe();
    };
  }, [conversationId, queryClient]);

  return channel;
}

// Hook pour créer une nouvelle conversation directe
export function useCreateDirectConversation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (targetFocalPointId: string) => {
      if (!user) throw new Error('Non authentifié');

      // Récupérer le focal point de l'utilisateur
      const { data: myFocalPoint, error: fpError } = await supabase
        .from('focal_points')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (fpError || !myFocalPoint) throw new Error('Point focal non trouvé');

      // Vérifier si une conversation directe existe déjà
      const { data: existingConv } = await supabase
        .from('focal_conversations')
        .select(`
          id,
          focal_conversation_participants!inner(focal_point_id)
        `)
        .eq('type', 'direct');

      // Chercher une conversation existante avec ces deux participants
      const existing = existingConv?.find((conv) => {
        const participantIds = conv.focal_conversation_participants.map((p: any) => p.focal_point_id);
        return (
          participantIds.includes(myFocalPoint.id) &&
          participantIds.includes(targetFocalPointId) &&
          participantIds.length === 2
        );
      });

      if (existing) {
        return existing.id;
      }

      // Créer une nouvelle conversation
      const { data: newConv, error: convError } = await supabase
        .from('focal_conversations')
        .insert({
          type: 'direct',
          created_by: user.id,
        })
        .select()
        .single();

      if (convError) throw convError;

      // Récupérer le user_id du focal point cible
      const { data: targetFP } = await supabase
        .from('focal_points')
        .select('user_id')
        .eq('id', targetFocalPointId)
        .single();

      // Ajouter les participants
      const { error: partError } = await supabase
        .from('focal_conversation_participants')
        .insert([
          {
            conversation_id: newConv.id,
            focal_point_id: myFocalPoint.id,
            user_id: user.id,
          },
          {
            conversation_id: newConv.id,
            focal_point_id: targetFocalPointId,
            user_id: targetFP?.user_id,
          },
        ]);

      if (partError) throw partError;

      return newConv.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focal-conversations'] });
    },
  });
}
