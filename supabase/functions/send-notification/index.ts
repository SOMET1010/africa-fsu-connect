import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.51.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  type: string;
  title: string;
  message: string;
  userId?: string;
  userIds?: string[];
  roleFilter?: string;
  actionUrl?: string;
  submissionId?: string;
  eventId?: string;
  postId?: string;
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
      type,
      title,
      message,
      userId,
      userIds,
      roleFilter,
      actionUrl,
      submissionId,
      eventId,
      postId
    }: NotificationRequest = await req.json();

    console.log('Sending notification:', { type, title, userId, userIds, roleFilter });

    let targetUserIds: string[] = [];

    // Determine target users
    if (userId) {
      targetUserIds = [userId];
    } else if (userIds) {
      targetUserIds = userIds;
    } else if (roleFilter) {
      // Get users by role
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('role', roleFilter);

      if (profilesError) throw profilesError;
      targetUserIds = profiles?.map(p => p.user_id) || [];
    } else {
      throw new Error('No target users specified');
    }

    if (targetUserIds.length === 0) {
      console.log('No target users found');
      return new Response(
        JSON.stringify({ message: 'No target users found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create notifications for all target users
    const notifications = targetUserIds.map(uid => ({
      user_id: uid,
      type,
      title,
      message,
      action_url: actionUrl,
      is_read: false
    }));

    const { data, error } = await supabase
      .from('notifications')
      .insert(notifications)
      .select();

    if (error) throw error;

    console.log(`Successfully created ${data.length} notifications`);

    // Handle specific notification types
    switch (type) {
      case 'submission_review':
        if (submissionId) {
          // Additional logic for submission review notifications
          console.log(`Submission review notification sent for submission: ${submissionId}`);
        }
        break;

      case 'event_reminder':
        if (eventId) {
          // Additional logic for event reminder notifications
          console.log(`Event reminder notification sent for event: ${eventId}`);
        }
        break;

      case 'forum_reply':
        if (postId) {
          // Additional logic for forum reply notifications
          console.log(`Forum reply notification sent for post: ${postId}`);
        }
        break;

      default:
        console.log(`Generic notification sent: ${type}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Notifications sent to ${data.length} users`,
        notifications: data 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Error in send-notification function:', error);
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