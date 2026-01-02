import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// --- Configuration & Types ---

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsItem {
  country: string;
  code: string;
  type: "project" | "doc" | "event" | "collab";
  title: string;
  desc: string;
  time?: string;
}

// Données de secours (Fallback) pour éviter un crash UI si l'IA échoue
const FALLBACK_NEWS: NewsItem[] = [
  {
    country: "Côte d'Ivoire",
    code: "CI",
    type: "project",
    title: "Extension du Backbone National",
    desc: "Lancement de la phase 3 du déploiement fibre optique par l'ANSUT.",
    time: "Donnée simulée"
  },
  {
    country: "Rwanda",
    code: "RW",
    type: "event",
    title: "Sommet Transform Africa",
    desc: "Les leaders discutent de l'identité numérique transfrontalière.",
    time: "Donnée simulée"
  },
  {
    country: "Sénégal",
    code: "SN",
    type: "collab",
    title: "Accord de Roaming Free",
    desc: "Nouveau protocole d'itinérance gratuit signé avec la Gambie.",
    time: "Donnée simulée"
  },
  {
    country: "Kenya",
    code: "KE",
    type: "doc",
    title: "Régulation IA & Télécoms",
    desc: "Publication du livre blanc sur l'usage de l'IA dans les réseaux mobiles.",
    time: "Donnée simulée"
  }
];

// --- Helper: Extracteur de JSON robuste ---
function extractJson(text: string): unknown {
  // 1. Essai direct
  try {
    return JSON.parse(text);
  } catch {
    // Continue
  }

  // 2. Recherche du premier '[' et du dernier ']'
  const firstBracket = text.indexOf('[');
  const lastBracket = text.lastIndexOf(']');
  
  if (firstBracket !== -1 && lastBracket !== -1) {
    const jsonCandidate = text.substring(firstBracket, lastBracket + 1);
    try {
      return JSON.parse(jsonCandidate);
    } catch {
      // Continue
    }
  }

  // 3. Nettoyage Markdown agressif
  const cleanText = text
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();
  
  return JSON.parse(cleanText);
}

// --- Main Function ---

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");
    if (!PERPLEXITY_API_KEY) {
      console.warn("API Key manquante, utilisation des données de secours.");
      return new Response(
        JSON.stringify({ news: FALLBACK_NEWS, source: "fallback", cached_at: new Date().toISOString() }), 
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const currentDate = new Date().toLocaleDateString("fr-FR");

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
            content: `Tu es un assistant API spécialisé dans les télécoms en Afrique. Nous sommes le ${currentDate}.
Ta tâche est de générer un tableau JSON strict contenant 4 actualités récentes.

Règles strictes :
1. Retourne UNIQUEMENT le JSON brut. Pas de markdown, pas de texte introductif.
2. Le JSON doit être un tableau d'objets (Array).
3. Structure de chaque objet :
   - country: Nom du pays (ex: "Sénégal")
   - code: Code ISO 2 lettres majuscules (ex: "SN")
   - type: Un parmi "project", "doc", "event", "collab"
   - title: Titre court et percutant (max 40 caractères)
   - desc: Une phrase de description (max 120 caractères)
   - time: Temps relatif (ex: "il y a 2h", "hier")

Sujets prioritaires : Fonds de Service Universel (FSU), Fibre optique, 5G, Inclusion numérique.`
          },
          {
            role: "user",
            content: "Donne-moi les 4 dernières actualités marquantes."
          }
        ],
        temperature: 0.2
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Perplexity API error:", response.status, errorText);
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const citations = data.citations || [];

    console.log("Raw content received, length:", content?.length);

    let newsItems: NewsItem[];

    try {
      const parsed = extractJson(content);
      // S'assurer qu'on a un tableau
      if (Array.isArray(parsed)) {
        newsItems = parsed;
      } else if (typeof parsed === 'object' && parsed !== null) {
        const obj = parsed as Record<string, unknown>;
        newsItems = (obj.news || obj.data || FALLBACK_NEWS) as NewsItem[];
      } else {
        throw new Error("Format JSON invalide");
      }
      
      // Validation minimale
      if (!Array.isArray(newsItems) || newsItems.length === 0) {
        throw new Error("Tableau vide ou invalide");
      }
    } catch (parseError) {
      console.error("JSON Parsing failed:", parseError);
      console.log("Failed content:", content);
      newsItems = FALLBACK_NEWS;
    }

    return new Response(
      JSON.stringify({ 
        news: newsItems,
        citations,
        source: "live",
        cached_at: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Global Error:", error);
    // Graceful degradation : on renvoie le fallback même en cas d'erreur fatale
    return new Response(
      JSON.stringify({ 
        news: FALLBACK_NEWS, 
        error: error.message,
        source: "fallback_error",
        cached_at: new Date().toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
