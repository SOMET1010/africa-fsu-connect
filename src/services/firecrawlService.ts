import FirecrawlApp from '@mendable/firecrawl-js';
import { supabase } from "@/integrations/supabase/client";

export interface CrawlResult {
  success: boolean;
  data?: any[];
  error?: string;
  creditsUsed?: number;
  processed?: number;
  created?: number;
  updated?: number;
  failed?: number;
  totalSuccessful?: number;
  totalProcessed?: number;
  results?: any[];
}

export interface SyncConfig {
  urls: string[];
  extractSchema?: {
    projects?: boolean;
    resources?: boolean;
    news?: boolean;
  };
  formats?: string[];
  includePaths?: string[];
  excludePaths?: string[];
}

export class FirecrawlService {
  private static async getApiKey(): Promise<string | null> {
    try {
      const { data, error } = await supabase.functions.invoke('get-firecrawl-key');
      if (error) throw error;
      return data?.key || null;
    } catch (error) {
      console.error('Error getting Firecrawl API key:', error);
      return null;
    }
  }

  static async crawlAgencyData(agencyId: string, config: SyncConfig): Promise<CrawlResult> {
    try {
      const { data, error } = await supabase.functions.invoke('agency-sync', {
        body: { agencyId, config }
      });

      if (error) {
        console.error('Crawl error:', error);
        return { success: false, error: error.message };
      }

      return data;
    } catch (error) {
      console.error('Error crawling agency data:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  static async batchSyncAllAgencies(): Promise<CrawlResult> {
    try {
      const { data, error } = await supabase.functions.invoke('batch-sync');
      
      if (error) {
        return { success: false, error: error.message };
      }

      return data;
    } catch (error) {
      console.error('Error in batch sync:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Batch sync failed' 
      };
    }
  }

  static async testConnection(): Promise<boolean> {
    try {
      const { data } = await supabase.functions.invoke('test-firecrawl');
      return data?.success || false;
    } catch (error) {
      console.error('Error testing Firecrawl connection:', error);
      return false;
    }
  }
}
