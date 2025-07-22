
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface EnhancedIndicator {
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
  metadata: {
    category?: string;
    source_indicator?: string;
    api_source?: string;
    fetched_at?: string;
    verified?: boolean;
  };
}

export interface IndicatorsByCategory {
  [category: string]: EnhancedIndicator[];
}

export interface RegionalStats {
  region: string;
  totalIndicators: number;
  latestYear: number;
  coverage: number;
}

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

      let indicators = data as EnhancedIndicator[];

      // Filtrer par catégorie si spécifié (via metadata)
      if (filters?.category) {
        indicators = indicators.filter(ind => 
          ind.metadata?.category === filters.category
        );
      }

      return indicators;
    },
  });
};

export const useIndicatorsByCategory = (filters?: {
  country_code?: string;
  region?: string;
  year?: number;
}) => {
  return useQuery({
    queryKey: ["indicators-by-category", filters],
    queryFn: async () => {
      const { data } = await useEnhancedIndicators(filters);
      
      if (!data) return {};

      const categorized: IndicatorsByCategory = {};
      
      data.forEach(indicator => {
        const category = indicator.metadata?.category || 'Autre';
        if (!categorized[category]) {
          categorized[category] = [];
        }
        categorized[category].push(indicator);
      });

      return categorized;
    },
  });
};

export const useRegionalIndicatorStats = () => {
  return useQuery({
    queryKey: ["regional-indicator-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("universal_service_indicators")
        .select("region, country_code, year, indicator_code")
        .order("year", { ascending: false });

      if (error) throw error;

      const indicators = data as EnhancedIndicator[];
      const latestYear = Math.max(...indicators.map(i => i.year));
      
      // Calculer les stats par région
      const regionStats: { [region: string]: RegionalStats } = {};
      
      indicators.forEach(indicator => {
        if (!indicator.region) return;
        
        if (!regionStats[indicator.region]) {
          regionStats[indicator.region] = {
            region: indicator.region,
            totalIndicators: 0,
            latestYear: indicator.year,
            coverage: 0
          };
        }
        
        regionStats[indicator.region].totalIndicators++;
        if (indicator.year > regionStats[indicator.region].latestYear) {
          regionStats[indicator.region].latestYear = indicator.year;
        }
      });

      // Calculer la couverture (nombre de pays avec données / nombre total de pays dans la région)
      const regionCountries: { [region: string]: Set<string> } = {};
      indicators.forEach(indicator => {
        if (!indicator.region) return;
        if (!regionCountries[indicator.region]) {
          regionCountries[indicator.region] = new Set();
        }
        regionCountries[indicator.region].add(indicator.country_code);
      });

      Object.keys(regionStats).forEach(region => {
        const expectedCountries = getExpectedCountriesForRegion(region);
        const actualCountries = regionCountries[region]?.size || 0;
        regionStats[region].coverage = Math.round((actualCountries / expectedCountries) * 100);
      });

      return Object.values(regionStats);
    },
  });
};

export const useIndicatorTrends = (indicator_code: string, country_codes?: string[]) => {
  return useQuery({
    queryKey: ["indicator-trends", indicator_code, country_codes],
    queryFn: async () => {
      let query = supabase
        .from("universal_service_indicators")
        .select("country_code, year, value, indicator_name")
        .eq("indicator_code", indicator_code)
        .order("year", { ascending: true });

      if (country_codes && country_codes.length > 0) {
        query = query.in("country_code", country_codes);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Grouper par pays et année pour créer des séries temporelles
      const trends: { [country: string]: Array<{ year: number; value: number }> } = {};
      
      data?.forEach(item => {
        if (!trends[item.country_code]) {
          trends[item.country_code] = [];
        }
        trends[item.country_code].push({
          year: item.year,
          value: item.value
        });
      });

      return {
        trends,
        indicator_name: data?.[0]?.indicator_name || indicator_code
      };
    },
  });
};

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
      }} = {};

      data?.forEach(indicator => {
        const source = indicator.data_source;
        if (!sourceStats[source]) {
          sourceStats[source] = {
            name: source,
            totalIndicators: 0,
            lastUpdate: indicator.last_updated_at,
            categories: new Set()
          };
        }
        
        sourceStats[source].totalIndicators++;
        
        if (indicator.metadata?.category) {
          sourceStats[source].categories.add(indicator.metadata.category);
        }
        
        // Mettre à jour la date la plus récente
        if (new Date(indicator.last_updated_at) > new Date(sourceStats[source].lastUpdate)) {
          sourceStats[source].lastUpdate = indicator.last_updated_at;
        }
      });

      return Object.values(sourceStats).map(stat => ({
        ...stat,
        categories: Array.from(stat.categories)
      }));
    },
  });
};

// Fonction utilitaire pour obtenir le nombre attendu de pays par région
function getExpectedCountriesForRegion(region: string): number {
  const regionCounts: { [region: string]: number } = {
    'CEDEAO': 15,
    'EACO': 10,
    'SADC': 16,
    'Afrique Centrale': 9,
    'Afrique du Nord': 6,
    'Autre': 5
  };
  
  return regionCounts[region] || 10;
}
