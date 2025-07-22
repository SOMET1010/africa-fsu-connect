
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { IndicatorTrends } from "@/types/indicators";

export const useIndicatorTrends = (indicator_code: string, country_codes?: string[]) => {
  return useQuery({
    queryKey: ["indicator-trends", indicator_code, country_codes],
    queryFn: async (): Promise<IndicatorTrends> => {
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
          value: item.value || 0
        });
      });

      return {
        trends,
        indicator_name: data?.[0]?.indicator_name || indicator_code
      };
    },
  });
};
