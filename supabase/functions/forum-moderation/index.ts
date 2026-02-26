import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.51.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ModerationRequest {
  type: 'new_post' | 'new_reply' | 'flag_content' | 'moderate_content';
  postId?: string;
  replyId?: string;
  action?: 'approve' | 'reject' | 'flag' | 'pin' | 'lock';
  reason?: string;
}

// Simple content filtering rules
const FORBIDDEN_WORDS = [
  'spam', 'abuse', 'inappropriate',
  // Add more as needed
];

const checkContentForModeration = (content: string): { needsModeration: boolean; reasons: string[] } => {
  const reasons: string[] = [];
  const lowerContent = content.toLowerCase();

  // Check for forbidden words
  for (const word of FORBIDDEN_WORDS) {
    if (lowerContent.includes(word)) {
      reasons.push(`Contains forbidden word: ${word}`);
    }
  }

  // Check for excessive caps
  const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
  if (capsRatio > 0.7 && content.length > 20) {
    reasons.push('Excessive use of capital letters');
  }

  // Check for excessive repetition
  const words = content.split(/\s+/);
  const uniqueWords = new Set(words);
  if (words.length > 10 && uniqueWords.size / words.length < 0.3) {
    reasons.push('Excessive repetition detected');
  }

  return {
    needsModeration: reasons.length > 0,
    reasons
  };
};

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
      postId,
      replyId,
      action,
      reason
    }: ModerationRequest = await req.json();

    console.log('Processing forum moderation:', { type, postId, replyId, action });

    let moderationResult: any = { success: true };

    switch (type) {
      case 'new_post':
        if (!postId) throw new Error('Post ID required');
        
        // Get post content
        const { data: post, error: postError } = await supabase
          .from('forum_posts')
          .select(`
            *,
            profiles!forum_posts_author_id_fkey (
              first_name,
              last_name,
              role
            )
          `)
          .eq('id', postId)
          .single();

        if (postError) throw postError;

        // Check content for moderation
        const postModeration = checkContentForModeration(post.title + ' ' + post.content);
        
        if (postModeration.needsModeration) {
          console.log(`Post ${postId} flagged for moderation:`, postModeration.reasons);
          
          // Notify moderators
          await supabase.functions.invoke('send-notification', {
            body: {
              type: 'moderation_required',
              title: 'Contenu nécessitant une modération',
              message: `Un nouveau post nécessite une révision: "${post.title}". Raisons: ${postModeration.reasons.join(', ')}`,
              roleFilter: 'country_admin',
              actionUrl: '/forum'
            }
          });
        } else {
          // Notify about new post in category
          await supabase.functions.invoke('send-notification', {
            body: {
              type: 'new_forum_post',
              title: 'Nouvelle discussion',
              message: `${post.profiles?.first_name} ${post.profiles?.last_name} a commencé une nouvelle discussion: "${post.title}"`,
              roleFilter: 'reader',
              actionUrl: '/forum'
            }
          });
        }

        moderationResult.needsModeration = postModeration.needsModeration;
        moderationResult.reasons = postModeration.reasons;
        break;

      case 'new_reply':
        if (!replyId) throw new Error('Reply ID required');
        
        // Get reply content
        const { data: reply, error: replyError } = await supabase
          .from('forum_replies')
          .select(`
            *,
            profiles!forum_replies_author_id_fkey (
              first_name,
              last_name,
              role
            ),
            forum_posts!forum_replies_post_id_fkey (
              title,
              author_id
            )
          `)
          .eq('id', replyId)
          .single();

        if (replyError) throw replyError;

        // Check content for moderation
        const replyModeration = checkContentForModeration(reply.content);
        
        if (replyModeration.needsModeration) {
          console.log(`Reply ${replyId} flagged for moderation:`, replyModeration.reasons);
          
          // Notify moderators
          await supabase.functions.invoke('send-notification', {
            body: {
              type: 'moderation_required',
              title: 'Réponse nécessitant une modération',
              message: `Une réponse nécessite une révision. Raisons: ${replyModeration.reasons.join(', ')}`,
              roleFilter: 'country_admin',
              actionUrl: '/forum'
            }
          });
        } else {
          // Notify post author about new reply
          if (reply.forum_posts?.author_id) {
            await supabase.functions.invoke('send-notification', {
              body: {
                type: 'forum_reply',
                title: 'Nouvelle réponse',
                message: `${reply.profiles?.first_name} ${reply.profiles?.last_name} a répondu à votre discussion "${reply.forum_posts?.title}"`,
                userId: reply.forum_posts.author_id,
                actionUrl: '/forum'
              }
            });
          }
        }

        moderationResult.needsModeration = replyModeration.needsModeration;
        moderationResult.reasons = replyModeration.reasons;
        break;

      case 'moderate_content':
        if (!action) throw new Error('Action required for moderation');
        
        if (postId) {
          // Moderate post
          let updateData: any = {};
          
          switch (action) {
            case 'approve':
              // Post is already visible, just log the approval
              console.log(`Post ${postId} approved by moderator`);
              break;
            case 'reject':
              // Could implement soft delete or hide functionality
              console.log(`Post ${postId} rejected by moderator. Reason: ${reason}`);
              break;
            case 'pin':
              updateData.is_pinned = true;
              break;
            case 'lock':
              updateData.is_locked = true;
              break;
          }

          if (Object.keys(updateData).length > 0) {
            const { error: updateError } = await supabase
              .from('forum_posts')
              .update(updateData)
              .eq('id', postId);

            if (updateError) throw updateError;
          }
        }

        if (replyId) {
          // Moderate reply
          console.log(`Reply ${replyId} moderated with action: ${action}. Reason: ${reason}`);
          // Implement reply moderation logic as needed
        }

        moderationResult.action = action;
        moderationResult.reason = reason;
        break;

      default:
        throw new Error('Invalid moderation type');
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Moderation processed successfully',
        result: moderationResult
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Error in forum-moderation function:', error);
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
