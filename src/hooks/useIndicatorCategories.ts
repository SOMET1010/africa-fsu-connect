
import { useQuery } from "@tanstack/react-query";
import { useEnhancedIndicators } from "./useEnhancedIndicators";
import { IndicatorsByCategory, IndicatorMetadata } from "@/types/indicators";

export const useIndicatorsByCategory = (filters?: {
  country_code?: string;
  region?: string;
  year?: number;
}) => {
  const { data: indicators, isLoading, error } = useEnhancedIndicators(filters);
  
  return useQuery({
    queryKey: ["indicators-by-category", filters],
    queryFn: () => {
      if (!indicators) return {};

      const categorized: IndicatorsByCategory = {};
      
      indicators.forEach(indicator => {
        // Type-safe access to metadata.category
        const metadata = indicator.metadata as IndicatorMetadata;
        const category = metadata?.category || 'Autre';
        
        if (!categorized[category]) {
          categorized[category] = [];
        }
        categorized[category].push(indicator);
      });

      return categorized;
    },
    enabled: !!indicators && !isLoading,
  });
};
