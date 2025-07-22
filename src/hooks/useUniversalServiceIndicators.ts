import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UniversalServiceIndicator {
  id: string;
  indicator_code: string;
  indicator_name: string;
  value: number;
  unit: string;
  country_code: string;
  region: string;
  year: number;
  quarter?: number;
  data_source: string;
  source_url?: string;
  last_updated_at: string;
  metadata: Record<string, any>;
}

export interface IndicatorDefinition {
  id: string;
  code: string;
  name: string;
  description: string;
  unit: string;
  category: string;
  source_organization: string;
}

export interface DataSource {
  id: string;
  name: string;
  acronym: string;
  description: string;
  website_url: string;
  update_frequency: string;
  is_active: boolean;
}

export const useUniversalServiceIndicators = (filters?: {
  country_code?: string;
  region?: string;
  year?: number;
  indicator_code?: string;
}) => {
  return useQuery({
    queryKey: ["universal-service-indicators", filters],
    queryFn: async () => {
      let query = supabase
        .from("universal_service_indicators")
        .select("*")
        .order("year", { ascending: false });

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

      const { data, error } = await query;
      if (error) throw error;
      return data as UniversalServiceIndicator[];
    },
  });
};

export const useIndicatorDefinitions = () => {
  return useQuery({
    queryKey: ["indicator-definitions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("indicator_definitions")
        .select("*")
        .order("category", { ascending: true });

      if (error) throw error;
      return data as IndicatorDefinition[];
    },
  });
};

export const useDataSources = () => {
  return useQuery({
    queryKey: ["data-sources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("data_sources")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (error) throw error;
      return data as DataSource[];
    },
  });
};

export const useIndicatorStats = () => {
  return useQuery({
    queryKey: ["indicator-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("universal_service_indicators")
        .select("indicator_code, country_code, region, year, value")
        .order("year", { ascending: false });

      if (error) throw error;

      // Calculate global stats
      const indicators = data as UniversalServiceIndicator[];
      const latestYear = Math.max(...indicators.map(i => i.year));
      const latestData = indicators.filter(i => i.year === latestYear);
      
      const regions = [...new Set(latestData.map(i => i.region))].filter(Boolean);
      const countries = [...new Set(latestData.map(i => i.country_code))].filter(Boolean);
      
      return {
        totalIndicators: indicators.length,
        latestYear,
        regionsCount: regions.length,
        countriesCount: countries.length,
        lastUpdate: new Date().toISOString()
      };
    },
  });
};