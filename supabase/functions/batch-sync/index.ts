import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Starting batch sync for all agencies')

    // Get all active agencies with connectors
    const { data: agencies, error: agenciesError } = await supabase
      .from('agencies')
      .select(`
        *,
        agency_connectors!inner(*)
      `)
      .eq('is_active', true)
      .eq('agency_connectors.is_active', true)
      .eq('agency_connectors.connector_type', 'firecrawl')

    if (agenciesError) {
      throw new Error(`Failed to get agencies: ${agenciesError.message}`)
    }

    if (!agencies || agencies.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No agencies with active Firecrawl connectors found',
          processed: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const results = []
    let totalProcessed = 0
    let totalSuccessful = 0
    let totalFailed = 0

    // Process each agency
    for (const agency of agencies) {
      try {
        console.log(`Processing agency: ${agency.name}`)
        
        // Get connector config
        const connector = agency.agency_connectors[0]
        const config = {
          urls: [agency.website_url, ...(connector.auth_config?.additional_urls || [])],
          extractSchema: {
            projects: connector.auth_config?.extract_projects !== false,
            resources: connector.auth_config?.extract_resources !== false,
            news: connector.auth_config?.extract_news !== false
          },
          formats: ['markdown', 'html']
        }

        // Call agency-sync function
        const { data: syncResult, error: syncError } = await supabase.functions.invoke('agency-sync', {
          body: { agencyId: agency.id, config }
        })

        if (syncError) {
          throw new Error(`Sync failed for ${agency.name}: ${syncError.message}`)
        }

        totalProcessed++
        if (syncResult?.success) {
          totalSuccessful++
        } else {
          totalFailed++
        }

        results.push({
          agency: agency.name,
          success: syncResult?.success || false,
          processed: syncResult?.processed || 0,
          created: syncResult?.created || 0,
          failed: syncResult?.failed || 0,
          error: syncResult?.error
        })

        // Small delay between agencies to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 2000))

      } catch (agencyError) {
        console.error(`Error processing agency ${agency.name}:`, agencyError)
        totalProcessed++
        totalFailed++
        
        results.push({
          agency: agency.name,
          success: false,
          error: agencyError.message
        })
      }
    }

    console.log(`Batch sync completed: ${totalSuccessful}/${totalProcessed} agencies processed successfully`)

    return new Response(
      JSON.stringify({
        success: true,
        totalProcessed,
        totalSuccessful,
        totalFailed,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Batch sync error:', error)
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