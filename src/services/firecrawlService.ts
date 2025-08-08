import FirecrawlApp from '@mendable/firecrawl-js';
import { supabase } from "@/integrations/supabase/client";
import { logger } from '@/utils/logger';

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
      logger.error('Error getting Firecrawl API key:', error as any);
      return null;
    }
  }

  static async crawlAgencyData(agencyId: string, config: SyncConfig): Promise<CrawlResult> {
    try {
      const { data, error } = await supabase.functions.invoke('agency-sync', {
        body: { agencyId, config }
      });

      if (error) {
        logger.error('Crawl error:', error as any);
        return { success: false, error: (error as any).message };
      }

      return data;
    } catch (error) {
      logger.error('Error crawling agency data:', error as any);
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
      logger.error('Error in batch sync:', error as any);
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
      logger.error('Error testing Firecrawl connection:', error as any);
      return false;
    }
  }
}
