import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.51.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EventReminderRequest {
  eventId?: string;
  reminderType: 'day_before' | 'hour_before' | 'custom';
  customHours?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const {
      eventId,
      reminderType,
      customHours
    }: EventReminderRequest = await req.json();

    console.log('Processing event reminders:', { eventId, reminderType });

    let eventsToProcess = [];

    if (eventId) {
      // Process specific event
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;
      if (event) eventsToProcess.push(event);
    } else {
      // Process all upcoming events based on reminder type
      const now = new Date();
      let targetTime: Date;

      switch (reminderType) {
        case 'day_before':
          targetTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
          break;
        case 'hour_before':
          targetTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
          break;
        case 'custom':
          if (!customHours) throw new Error('Custom hours required for custom reminder');
          targetTime = new Date(now.getTime() + customHours * 60 * 60 * 1000);
          break;
        default:
          throw new Error('Invalid reminder type');
      }

      // Get events that start within the target timeframe
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .gte('start_date', now.toISOString())
        .lte('start_date', targetTime.toISOString());

      if (eventsError) throw eventsError;
      eventsToProcess = events || [];
    }

    console.log(`Found ${eventsToProcess.length} events to process`);

    let totalNotificationsSent = 0;

    for (const event of eventsToProcess) {
      // Get registered users for this event
      const { data: registrations, error: regError } = await supabase
        .from('event_registrations')
        .select('user_id')
        .eq('event_id', event.id);

      if (regError) {
        console.error(`Error fetching registrations for event ${event.id}:`, regError);
        continue;
      }

      if (!registrations || registrations.length === 0) {
        console.log(`No registrations found for event ${event.id}`);
        continue;
      }

      const registeredUserIds = registrations.map(reg => reg.user_id);

      // Calculate time until event
      const eventStart = new Date(event.start_date);
      const now = new Date();
      const hoursUntilEvent = Math.round((eventStart.getTime() - now.getTime()) / (1000 * 60 * 60));

      let reminderMessage = '';
      if (hoursUntilEvent <= 1) {
        reminderMessage = `L'événement "${event.title}" commence dans moins d'une heure.`;
      } else if (hoursUntilEvent <= 24) {
        reminderMessage = `L'événement "${event.title}" commence dans ${hoursUntilEvent} heure(s).`;
      } else {
        const daysUntilEvent = Math.round(hoursUntilEvent / 24);
        reminderMessage = `L'événement "${event.title}" commence dans ${daysUntilEvent} jour(s).`;
      }

      // Add event details to the message
      if (event.location) {
        reminderMessage += ` Lieu: ${event.location}.`;
      }
      if (event.virtual_link) {
        reminderMessage += ` Lien: ${event.virtual_link}`;
      }

      // Send reminder notifications
      const notificationResponse = await supabase.functions.invoke('send-notification', {
        body: {
          type: 'event_reminder',
          title: 'Rappel d\'événement',
          message: reminderMessage,
          userIds: registeredUserIds,
          actionUrl: '/events',
          eventId: event.id
        }
      });

      if (notificationResponse.error) {
        console.error(`Failed to send notifications for event ${event.id}:`, notificationResponse.error);
      } else {
        totalNotificationsSent += registeredUserIds.length;
        console.log(`Sent ${registeredUserIds.length} reminder notifications for event: ${event.title}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Processed ${eventsToProcess.length} events`,
        totalNotificationsSent,
        reminderType
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Error in event-reminders function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});