import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.51.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProcessSubmissionRequest {
  submissionId: string;
  action: 'approve' | 'reject' | 'assign_reviewer';
  reviewNotes?: string;
  reviewerId?: string;
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
      submissionId,
      action,
      reviewNotes,
      reviewerId
    }: ProcessSubmissionRequest = await req.json();

    console.log('Processing submission:', { submissionId, action, reviewerId });

    // Get submission details
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .select(`
        *,
        submitter:profiles!submissions_submitted_by_fkey (
          first_name,
          last_name,
          user_id
        )
      `)
      .eq('id', submissionId)
      .single();

    if (submissionError) throw submissionError;
    if (!submission) throw new Error('Submission not found');

    let updateData: any = {};
    let notificationData: any = {};

    switch (action) {
      case 'approve':
        updateData = {
          status: 'approuve',
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes
        };
        
        notificationData = {
          type: 'submission_approved',
          title: 'Soumission approuvée',
          message: `Votre soumission "${submission.title}" a été approuvée.`,
          userId: submission.submitted_by,
          actionUrl: '/submit'
        };
        break;

      case 'reject':
        updateData = {
          status: 'rejete',
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes
        };
        
        notificationData = {
          type: 'submission_rejected',
          title: 'Soumission rejetée',
          message: `Votre soumission "${submission.title}" a été rejetée. Consultez les notes de révision.`,
          userId: submission.submitted_by,
          actionUrl: '/submit'
        };
        break;

      case 'assign_reviewer':
        if (!reviewerId) throw new Error('Reviewer ID required for assignment');
        
        updateData = {
          status: 'en_revision',
          reviewed_by: reviewerId
        };
        
        notificationData = {
          type: 'review_assignment',
          title: 'Nouvelle soumission à réviser',
          message: `Une soumission "${submission.title}" vous a été assignée pour révision.`,
          userId: reviewerId,
          actionUrl: '/admin/submissions'
        };
        break;

      default:
        throw new Error('Invalid action');
    }

    // Update submission
    const { error: updateError } = await supabase
      .from('submissions')
      .update(updateData)
      .eq('id', submissionId);

    if (updateError) throw updateError;

    // Send notification
    const notificationResponse = await supabase.functions.invoke('send-notification', {
      body: notificationData
    });

    if (notificationResponse.error) {
      console.error('Failed to send notification:', notificationResponse.error);
    }

    // Additional processing based on action
    if (action === 'approve') {
      // Could trigger additional workflows like:
      // - Publishing to document library
      // - Sending to external systems
      // - Creating calendar events
      console.log(`Submission ${submissionId} approved and ready for publication`);
    }

    console.log(`Successfully processed submission ${submissionId} with action: ${action}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Submission ${action}d successfully`,
        submissionId,
        action
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Error in process-submission function:', error);
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