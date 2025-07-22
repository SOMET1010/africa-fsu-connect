
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EnhancedIndicator, IndicatorMetadata } from "@/types/indicators";

export const useEnhancedIndicators = (filters?: {
  country_code?: string;
  region?: string;
  year?: number;
  indicator_code?: string;
  category?: string;
  data_source?: string;
}) => {
  return useQuery({
    queryKey: ["enhanced-indicators", filters],
    queryFn: async () => {
      let query = supabase
        .from("universal_service_indicators")
        .select("*")
        .order("year", { ascending: false })
        .order("last_updated_at", { ascending: false });

      if (filters?.country_code) {
        query = query.eq("country_code", filters.country_code);
      }
      if (filters?.region) {
        query = query.eq("region", filters.region);
      }
      if (filters?.year) {
        query = query.eq("year", filters.year);
      }
      if (filters?.indicator_code) {
        query = query.eq("indicator_code", filters.indicator_code);
      }
      if (filters?.data_source) {
        query = query.eq("data_source", filters.data_source);
      }

      const { data, error } = await query;
      if (error) throw error;

      let indicators = (data || []).map(item => ({
        ...item,
        metadata: item.metadata as IndicatorMetadata
      })) as EnhancedIndicator[];

      // Type-safe filter by category
      if (filters?.category) {
        indicators = indicators.filter(ind => 
          ind.metadata?.category === filters.category
        );
      }

      return indicators;
    },
  });
};

// Export specific hooks for backwards compatibility
export { useIndicatorsByCategory } from './useIndicatorCategories';
export { useRegionalIndicatorStats } from './useRegionalStats';
export { useIndicatorTrends } from './useIndicatorTrends';
export { useDataSourceStats } from './useDataSourceStats';
