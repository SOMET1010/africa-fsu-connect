import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/utils/logger";

export interface Event {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  location?: string;
  is_virtual: boolean;
  virtual_link?: string;
  max_attendees?: number;
  current_attendees: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Joined data
  organizer?: {
    first_name: string;
    last_name: string;
    role: string;
    organization?: string;
  };
  is_registered?: boolean;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  registered_at: string;
}

export interface CreateEventData {
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  location?: string;
  is_virtual: boolean;
  virtual_link?: string;
  max_attendees?: number;
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch events with organizer data and user registration status
  const fetchEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;

      // Get user's registrations separately
      let userRegistrations: any[] = [];
      if (user) {
        const { data: regData } = await supabase
          .from('event_registrations')
          .select('event_id')
          .eq('user_id', user.id);
        userRegistrations = regData || [];
      }

      const formattedEvents = data?.map(event => ({
        ...event,
        is_registered: userRegistrations.some(reg => reg.event_id === event.id)
      })) || [];

      setEvents(formattedEvents);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les événements.",
        variant: "destructive",
      });
    }
  };

  // Fetch user registrations
  const fetchRegistrations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setRegistrations(data || []);
    } catch (err: any) {
      logger.error('Failed to fetch registrations:', err);
    }
  };

  // Create a new event
  const createEvent = async (eventData: CreateEventData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...eventData,
          created_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Événement créé",
        description: "Votre événement a été créé avec succès.",
      });

      await fetchEvents();
      return data;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Update an event
  const updateEvent = async (id: string, eventData: Partial<CreateEventData>) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Événement mis à jour",
        description: "Les modifications ont été sauvegardées.",
      });

      await fetchEvents();
      return data;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Register for an event
  const registerForEvent = async (eventId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      // Check if already registered
      const { data: existingReg } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      if (existingReg) {
        toast({
          title: "Déjà inscrit",
          description: "Vous êtes déjà inscrit à cet événement.",
          variant: "destructive",
        });
        return;
      }

      // Check capacity
      const { data: eventData } = await supabase
        .from('events')
        .select('max_attendees, current_attendees')
        .eq('id', eventId)
        .single();

      if (eventData?.max_attendees && eventData.current_attendees >= eventData.max_attendees) {
        toast({
          title: "Événement complet",
          description: "Cet événement a atteint sa capacité maximale.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('event_registrations')
        .insert([{
          event_id: eventId,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Inscription confirmée",
        description: "Vous êtes maintenant inscrit à cet événement.",
      });

      await Promise.all([fetchEvents(), fetchRegistrations()]);
      return data;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Unregister from an event
  const unregisterFromEvent = async (eventId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Désinscription réussie",
        description: "Vous avez été désinscrit de cet événement.",
      });

      await Promise.all([fetchEvents(), fetchRegistrations()]);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Generate calendar file (.ics)
  const generateCalendarFile = async (eventId: string) => {
    try {
      const event = events.find(e => e.id === eventId);
      if (!event) throw new Error("Événement non trouvé");

      // Create ICS content
      const startDate = new Date(event.start_date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const endDate = new Date(event.end_date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//FSU Platform//Event//EN',
        'BEGIN:VEVENT',
        `UID:${event.id}@fsu-platform.com`,
        `DTSTART:${startDate}`,
        `DTEND:${endDate}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description || ''}`,
        `LOCATION:${event.location || ''}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\n');

      // Create and download file
      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `event-${event.title.replace(/\s+/g, '-').toLowerCase()}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Fichier généré",
        description: "Le fichier .ics a été téléchargé.",
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // Get upcoming events
  const getUpcomingEvents = () => {
    const now = new Date();
    return events
      .filter(event => new Date(event.start_date) > now)
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
      .slice(0, 5);
  };

  // Real-time subscriptions
  useEffect(() => {
    const setupSubscriptions = () => {
      // Subscribe to events changes
      const eventsSubscription = supabase
        .channel('events_changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'events' },
          () => {
            fetchEvents();
          }
        )
        .subscribe();

      // Subscribe to registrations changes
      const registrationsSubscription = supabase
        .channel('event_registrations_changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'event_registrations' },
          () => {
            fetchEvents();
            fetchRegistrations();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(eventsSubscription);
        supabase.removeChannel(registrationsSubscription);
      };
    };

    const cleanup = setupSubscriptions();
    return cleanup;
  }, []);

  // Initial fetch
  useEffect(() => {
    const initializeEvents = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchEvents(), fetchRegistrations()]);
      } finally {
        setLoading(false);
      }
    };

    initializeEvents();
  }, []);

  return {
    events,
    registrations,
    loading,
    error,
    fetchEvents,
    fetchRegistrations,
    createEvent,
    updateEvent,
    registerForEvent,
    unregisterFromEvent,
    generateCalendarFile,
    getUpcomingEvents,
    refetch: () => {
      fetchEvents();
      fetchRegistrations();
    }
  };
};