import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import FirecrawlApp from 'https://esm.sh/@mendable/firecrawl-js@1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY')

    if (!firecrawlApiKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Firecrawl API key not configured' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Testing Firecrawl connection')
    
    const firecrawl = new FirecrawlApp({ apiKey: firecrawlApiKey })
    
    // Test with a simple scrape
    const testResult = await firecrawl.scrapeUrl('https://example.com', {
      formats: ['markdown']
    })

    const isSuccessful = testResult.success && testResult.data

    return new Response(
      JSON.stringify({
        success: isSuccessful,
        message: isSuccessful ? 'Firecrawl connection successful' : 'Firecrawl connection failed',
        testUrl: 'https://example.com'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Firecrawl test error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})