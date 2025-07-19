import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import FirecrawlApp from 'https://esm.sh/@mendable/firecrawl-js@1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SyncConfig {
  urls: string[];
  extractSchema?: {
    projects?: boolean;
    resources?: boolean;
    news?: boolean;
  };
  formats?: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agencyId, config } = await req.json() as { agencyId: string; config: SyncConfig };
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY')!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const firecrawl = new FirecrawlApp({ apiKey: firecrawlApiKey })

    console.log(`Starting sync for agency ${agencyId}`)

    // Get agency details
    const { data: agency, error: agencyError } = await supabase
      .from('agencies')
      .select('*')
      .eq('id', agencyId)
      .single()

    if (agencyError || !agency) {
      throw new Error(`Agency not found: ${agencyError?.message}`)
    }

    // Log sync start
    const { data: syncLog } = await supabase
      .from('sync_logs')
      .insert({
        agency_id: agencyId,
        sync_type: 'firecrawl',
        status: 'running'
      })
      .select()
      .single()

    let totalProcessed = 0
    let totalCreated = 0
    let totalUpdated = 0
    let totalFailed = 0
    const errors: any[] = []

    try {
      // Crawl each URL
      for (const url of config.urls) {
        try {
          console.log(`Crawling URL: ${url}`)
          
          const crawlResult = await firecrawl.crawlUrl(url, {
            limit: 50,
            scrapeOptions: {
              formats: config.formats || ['markdown', 'html'],
              includePaths: [`${url}/*`],
              excludePaths: config.extractSchema ? [] : [
                '**/admin/**',
                '**/login/**',
                '**/auth/**'
              ]
            }
          })

          if (!crawlResult.success) {
            throw new Error(`Crawl failed for ${url}`)
          }

          // Process crawled data
          if (crawlResult.data) {
            for (const page of crawlResult.data) {
              totalProcessed++
              
              try {
                // Extract project information
                if (config.extractSchema?.projects && page.markdown) {
                  const projectData = extractProjectData(page, agency)
                  if (projectData) {
                    const { error: insertError } = await supabase
                      .from('agency_projects')
                      .upsert(projectData, { 
                        onConflict: 'external_id,agency_id',
                        ignoreDuplicates: false 
                      })
                    
                    if (insertError) {
                      totalFailed++
                      errors.push({ url: page.url, error: insertError.message })
                    } else {
                      totalCreated++
                    }
                  }
                }

                // Extract resource information
                if (config.extractSchema?.resources && page.markdown) {
                  const resourceData = extractResourceData(page, agency)
                  if (resourceData) {
                    const { error: insertError } = await supabase
                      .from('agency_resources')
                      .upsert(resourceData, { 
                        onConflict: 'external_id,agency_id',
                        ignoreDuplicates: false 
                      })
                    
                    if (insertError) {
                      totalFailed++
                      errors.push({ url: page.url, error: insertError.message })
                    } else {
                      totalCreated++
                    }
                  }
                }
              } catch (pageError) {
                totalFailed++
                errors.push({ url: page.url, error: pageError.message })
              }
            }
          }
        } catch (urlError) {
          totalFailed++
          errors.push({ url, error: urlError.message })
        }
      }

      // Update agency sync status
      await supabase
        .from('agencies')
        .update({
          sync_status: totalFailed > 0 ? 'partial' : 'synced',
          last_sync_at: new Date().toISOString()
        })
        .eq('id', agencyId)

      // Complete sync log
      await supabase
        .from('sync_logs')
        .update({
          status: totalFailed > 0 ? 'partial' : 'completed',
          completed_at: new Date().toISOString(),
          records_processed: totalProcessed,
          records_created: totalCreated,
          records_updated: totalUpdated,
          records_failed: totalFailed,
          error_details: errors.length > 0 ? { errors } : null
        })
        .eq('id', syncLog.id)

      console.log(`Sync completed for agency ${agencyId}: ${totalProcessed} processed, ${totalCreated} created, ${totalFailed} failed`)

      return new Response(
        JSON.stringify({
          success: true,
          processed: totalProcessed,
          created: totalCreated,
          updated: totalUpdated,
          failed: totalFailed,
          errors: errors.length > 0 ? errors : undefined
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (syncError) {
      // Update failed sync log
      await supabase
        .from('sync_logs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_details: { error: syncError.message }
        })
        .eq('id', syncLog.id)

      throw syncError
    }

  } catch (error) {
    console.error('Agency sync error:', error)
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

function extractProjectData(page: any, agency: any) {
  const { markdown, url, metadata } = page
  
  // Simple heuristics to detect project pages
  const isProjectPage = (
    url.includes('/project') || 
    url.includes('/projet') || 
    markdown.toLowerCase().includes('projet') ||
    markdown.toLowerCase().includes('budget') ||
    markdown.toLowerCase().includes('bénéficiaire')
  )

  if (!isProjectPage) return null

  // Extract title from metadata or markdown
  const title = metadata?.title || 
                markdown.split('\n')[0]?.replace(/^#\s*/, '') || 
                'Projet importé'

  // Basic description extraction
  const lines = markdown.split('\n').filter(line => line.trim())
  const description = lines.slice(1, 4).join(' ').substring(0, 500)

  // Try to extract budget (basic pattern matching)
  const budgetMatch = markdown.match(/budget[:\s]*([0-9,.\s]+)\s*(€|EUR|euro)/i)
  const budget = budgetMatch ? parseFloat(budgetMatch[1].replace(/[,\s]/g, '')) : null

  return {
    agency_id: agency.id,
    external_id: `${agency.acronym}_${url.split('/').pop() || Date.now()}`,
    title: title.substring(0, 255),
    description,
    status: 'en_cours',
    source_url: url,
    budget,
    sync_status: 'synced',
    last_updated_at: new Date().toISOString()
  }
}

function extractResourceData(page: any, agency: any) {
  const { markdown, url, metadata } = page
  
  // Detect resource pages
  const isResourcePage = (
    url.includes('/resource') || 
    url.includes('/document') ||
    url.includes('/publication') ||
    url.includes('.pdf') ||
    markdown.toLowerCase().includes('télécharg') ||
    markdown.toLowerCase().includes('document')
  )

  if (!isResourcePage) return null

  const title = metadata?.title || 
                markdown.split('\n')[0]?.replace(/^#\s*/, '') || 
                'Ressource importée'

  const lines = markdown.split('\n').filter(line => line.trim())
  const description = lines.slice(1, 3).join(' ').substring(0, 500)

  // Detect resource type
  let resourceType = 'autre'
  if (url.includes('.pdf') || markdown.includes('PDF')) resourceType = 'guide'
  else if (markdown.toLowerCase().includes('rapport')) resourceType = 'rapport'
  else if (markdown.toLowerCase().includes('formulaire')) resourceType = 'formulaire'

  return {
    agency_id: agency.id,
    external_id: `${agency.acronym}_${url.split('/').pop() || Date.now()}`,
    title: title.substring(0, 255),
    description,
    resource_type: resourceType,
    source_url: url,
    file_url: url.includes('.pdf') ? url : null,
    sync_status: 'synced',
    last_updated_at: new Date().toISOString()
  }
}