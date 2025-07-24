import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCallback, useMemo } from 'react';
import type { Event, CreateEventData, EventRegistration } from './useEvents';

// Query keys constants pour consistency
export const EVENT_QUERY_KEYS = {
  all: ['events'] as const,
  lists: () => [...EVENT_QUERY_KEYS.all, 'list'] as const,
  list: (filters: any) => [...EVENT_QUERY_KEYS.lists(), filters] as const,
  details: () => [...EVENT_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...EVENT_QUERY_KEYS.details(), id] as const,
  registrations: (userId?: string) => ['registrations', userId] as const,
  upcoming: () => [...EVENT_QUERY_KEYS.all, 'upcoming'] as const,
} as const;

interface UseOptimizedEventsOptions {
  filters?: {
    upcoming?: boolean;
    registered?: boolean;
    limit?: number;
  };
  prefetchUpcoming?: boolean;
  enableRealtime?: boolean;
}

export const useOptimizedEvents = (options: UseOptimizedEventsOptions = {}) => {
  const { filters = {}, prefetchUpcoming = true, enableRealtime = true } = options;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Optimized events query avec sélection spécifique
  const eventsQuery = useQuery({
    queryKey: EVENT_QUERY_KEYS.list(filters),
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
        .from('events')
        .select(`
          id,
          title,
          description,
          start_date,
          end_date,
          location,
          is_virtual,
          virtual_link,
          max_attendees,
          current_attendees,
          created_by,
          created_at,
          updated_at
        `)
        .order('start_date', { ascending: true });

      // Filtre pour upcoming events
      if (filters.upcoming) {
        query = query.gte('start_date', new Date().toISOString());
      }

      // Limite si spécifiée
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data: events, error } = await query;
      if (error) throw error;

      // Récupération optimisée des registrations utilisateur
      let userRegistrations: string[] = [];
      if (user) {
        const { data: regData } = await supabase
          .from('event_registrations')
          .select('event_id')
          .eq('user_id', user.id)
          .in('event_id', events?.map(e => e.id) || []);
        
        userRegistrations = regData?.map(r => r.event_id) || [];
      }

      // Enrichissement des données avec is_registered
      const enrichedEvents = events?.map(event => ({
        ...event,
        is_registered: userRegistrations.includes(event.id)
      })) || [];

      // Filtre pour registered events
      if (filters.registered && user) {
        return enrichedEvents.filter(e => e.is_registered);
      }

      return enrichedEvents;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // User registrations query
  const registrationsQuery = useQuery({
    queryKey: EVENT_QUERY_KEYS.registrations(),
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: true,
  });

  // Prefetch upcoming events si activé
  const prefetchUpcomingEvents = useCallback(() => {
    if (prefetchUpcoming) {
      queryClient.prefetchQuery({
        queryKey: EVENT_QUERY_KEYS.upcoming(),
        queryFn: async () => {
          const { data, error } = await supabase
            .from('events')
            .select('id, title, start_date, max_attendees, current_attendees')
            .gte('start_date', new Date().toISOString())
            .order('start_date', { ascending: true })
            .limit(5);

          if (error) throw error;
          return data || [];
        },
        staleTime: 2 * 60 * 1000, // 2 minutes pour upcoming
      });
    }
  }, [queryClient, prefetchUpcoming]);

  // Mutations optimisées
  const createEventMutation = useMutation({
    mutationFn: async (eventData: CreateEventData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { data, error } = await supabase
        .from('events')
        .insert([{ ...eventData, created_by: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidation optimisée des queries pertinentes
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.upcoming() });
      
      // Optimistic update pour la query actuelle
      queryClient.setQueryData(EVENT_QUERY_KEYS.list(filters), (old: Event[] = []) => {
        return [data, ...old];
      });

      toast({
        title: "Événement créé",
        description: "Votre événement a été créé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la création",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      // Vérification optimisée de l'inscription existante
      const { data: existingReg } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingReg) {
        throw new Error("Déjà inscrit à cet événement");
      }

      // Vérification de capacité avec select optimisé
      const { data: eventData } = await supabase
        .from('events')
        .select('max_attendees, current_attendees')
        .eq('id', eventId)
        .single();

      if (eventData?.max_attendees && eventData.current_attendees >= eventData.max_attendees) {
        throw new Error("Événement complet");
      }

      const { data, error } = await supabase
        .from('event_registrations')
        .insert([{ event_id: eventId, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, eventId) => {
      // Optimistic updates
      queryClient.setQueryData(EVENT_QUERY_KEYS.list(filters), (old: Event[] = []) => {
        return old.map(event => 
          event.id === eventId 
            ? { ...event, is_registered: true, current_attendees: event.current_attendees + 1 }
            : event
        );
      });

      // Invalidation des queries liées
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.registrations() });

      toast({
        title: "Inscription confirmée",
        description: "Vous êtes maintenant inscrit à cet événement.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de l'inscription",
        variant: "destructive",
      });
    },
  });

  const unregisterMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);

      if (error) throw error;
      return eventId;
    },
    onSuccess: (eventId) => {
      // Optimistic updates
      queryClient.setQueryData(EVENT_QUERY_KEYS.list(filters), (old: Event[] = []) => {
        return old.map(event => 
          event.id === eventId 
            ? { ...event, is_registered: false, current_attendees: Math.max(0, event.current_attendees - 1) }
            : event
        );
      });

      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.registrations() });

      toast({
        title: "Désinscription réussie",
        description: "Vous avez été désinscrit de cet événement.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la désinscription",
        variant: "destructive",
      });
    },
  });

  // Computed values mémorisés
  const upcomingEvents = useMemo(() => {
    if (!eventsQuery.data) return [];
    const now = new Date();
    return eventsQuery.data
      .filter(event => new Date(event.start_date) > now)
      .slice(0, 5);
  }, [eventsQuery.data]);

  const userRegisteredEvents = useMemo(() => {
    if (!eventsQuery.data) return [];
    return eventsQuery.data.filter(event => event.is_registered);
  }, [eventsQuery.data]);

  return {
    // Data
    events: eventsQuery.data || [],
    registrations: registrationsQuery.data || [],
    upcomingEvents,
    userRegisteredEvents,
    
    // States
    loading: eventsQuery.isLoading || registrationsQuery.isLoading,
    error: eventsQuery.error || registrationsQuery.error,
    
    // Actions
    createEvent: createEventMutation.mutate,
    registerForEvent: registerMutation.mutate,
    unregisterFromEvent: unregisterMutation.mutate,
    
    // Loading states
    isCreating: createEventMutation.isPending,
    isRegistering: registerMutation.isPending,
    isUnregistering: unregisterMutation.isPending,
    
    // Utils
    refetch: () => {
      eventsQuery.refetch();
      registrationsQuery.refetch();
    },
    prefetchUpcoming: prefetchUpcomingEvents,
    
    // Cache management
    invalidateEvents: () => queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.all }),
    removeFromCache: (eventId: string) => queryClient.removeQueries({ queryKey: EVENT_QUERY_KEYS.detail(eventId) }),
  };
};