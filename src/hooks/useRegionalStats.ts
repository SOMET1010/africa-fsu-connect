
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RegionalStats } from "@/types/indicators";

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

export const useRegionalIndicatorStats = () => {
  return useQuery({
    queryKey: ["regional-indicator-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("universal_service_indicators")
        .select("region, country_code, year, indicator_code")
        .order("year", { ascending: false });

      if (error) throw error;

      const indicators = data || [];
      const latestYear = indicators.length > 0 ? Math.max(...indicators.map(i => i.year)) : new Date().getFullYear();
      
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
