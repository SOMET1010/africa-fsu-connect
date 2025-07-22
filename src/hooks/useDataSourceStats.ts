
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataSourceStats, IndicatorMetadata } from "@/types/indicators";

export const useDataSourceStats = () => {
  return useQuery({
    queryKey: ["data-source-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("universal_service_indicators")
        .select("data_source, last_updated_at, metadata")
        .order("last_updated_at", { ascending: false });

      if (error) throw error;

      const sourceStats: { [source: string]: {
        name: string;
        totalIndicators: number;
        lastUpdate: string;
        categories: Set<string>;
        apiStatus: 'active' | 'inactive' | 'maintenance';
        reliability: number;
      }} = {};

      data?.forEach(indicator => {
        const source = indicator.data_source;
        if (!sourceStats[source]) {
          sourceStats[source] = {
            name: source,
            totalIndicators: 0,
            lastUpdate: indicator.last_updated_at,
            categories: new Set(),
            apiStatus: 'active',
            reliability: 95
          };
        }
        
        sourceStats[source].totalIndicators++;
        
        // Type-safe access to metadata.category
        const metadata = indicator.metadata as IndicatorMetadata;
        if (metadata?.category) {
          sourceStats[source].categories.add(metadata.category);
        }
        
        // Mettre à jour la date la plus récente
        if (new Date(indicator.last_updated_at) > new Date(sourceStats[source].lastUpdate)) {
          sourceStats[source].lastUpdate = indicator.last_updated_at;
        }
      });

      return Object.values(sourceStats).map(stat => ({
        name: stat.name,
        totalIndicators: stat.totalIndicators,
        lastUpdate: stat.lastUpdate,
        categories: Array.from(stat.categories),
        apiStatus: stat.apiStatus,
        reliability: stat.reliability
      } as DataSourceStats));
    },
  });
};
