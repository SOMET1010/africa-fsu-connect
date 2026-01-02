import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");
    if (!PERPLEXITY_API_KEY) {
      throw new Error("PERPLEXITY_API_KEY not configured");
    }

    console.log("Fetching Africa telecom news from Perplexity...");

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content: `Tu es un assistant qui recherche les actualités récentes sur les télécommunications en Afrique.
Concentre-toi sur:
- Projets d'accès universel et FSU (Fonds de Service Universel)
- Infrastructure télécom (fibre, backbone, connectivité rurale)
- Initiatives de l'ATU (African Telecommunications Union)
- Partenariats bilatéraux entre pays africains
- Événements et conférences télécoms en Afrique

IMPORTANT: Retourne EXACTEMENT 4 actualités au format JSON valide.
Chaque actualité doit avoir: country (nom du pays), code (code ISO 2 lettres), type (project|doc|event|collab), title (titre court), desc (description courte 1 phrase).`
          },
          {
            role: "user",
            content: "Quelles sont les 4 actualités les plus récentes sur les télécommunications et l'accès universel en Afrique? Retourne uniquement le JSON sans texte additionnel."
          }
        ],
        search_recency_filter: "week"
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Perplexity API error:", error);
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Perplexity response received");
    
    const content = data.choices?.[0]?.message?.content;
    const citations = data.citations || [];

    // Parse le JSON depuis la réponse - nettoyer les balises markdown
    let parsedNews;
    try {
      // Retirer les balises markdown ```json et ```
      let cleanContent = content
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
      
      console.log("Cleaned content:", cleanContent);
      
      // Parser le JSON nettoyé
      const parsed = JSON.parse(cleanContent);
      
      // Si c'est un array directement, l'envelopper
      if (Array.isArray(parsed)) {
        parsedNews = { news: parsed };
      } else {
        parsedNews = parsed;
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.log("Raw content:", content);
      throw new Error("Failed to parse news from Perplexity response");
    }

    const news = parsedNews.news || parsedNews;

    return new Response(
      JSON.stringify({ 
        news: Array.isArray(news) ? news : [news],
        citations,
        cached_at: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
