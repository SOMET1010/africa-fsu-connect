import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, content, type, context } = await req.json();

    let systemPrompt = '';
    let userPrompt = '';

    switch (action) {
      case 'improve':
        systemPrompt = 'Tu es un expert en rédaction de documents officiels. Améliore le texte fourni en le rendant plus professionnel, clair et convaincant.';
        userPrompt = `Améliore ce texte : "${content}"`;
        break;
      
      case 'complete':
        systemPrompt = 'Tu es un assistant de rédaction qui aide à compléter des documents. Complète le texte de manière cohérente.';
        userPrompt = `Complète ce texte en cours de rédaction : "${content}"`;
        break;
      
      case 'suggest':
        systemPrompt = `Tu es un expert en ${type === 'project' ? 'gestion de projets' : type === 'position' ? 'rédaction de positions officielles' : 'réglementation'}. Suggère du contenu pertinent.`;
        userPrompt = `Suggère du contenu pour : ${context?.title || 'ce document'}. Type: ${type}. Contexte: ${context?.description || 'Aucun contexte fourni'}`;
        break;
      
      case 'validate':
        systemPrompt = 'Tu es un validateur de documents officiels. Vérifie la cohérence, la complétude et la qualité du contenu.';
        userPrompt = `Valide ce document et propose des améliorations :\n\nTitre: ${context?.title}\nDescription: ${context?.description}\nContenu: ${content}`;
        break;
      
      default:
        throw new Error('Action non supportée');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const suggestion = data.choices[0].message.content;

    return new Response(JSON.stringify({ suggestion }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-writing-assistant function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});