import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface NewsItem {
  country: string;
  code: string;
  type: 'project' | 'doc' | 'event' | 'collab';
  title: string;
  desc: string;
  source_url?: string;
}

interface NewsResponse {
  news: NewsItem[];
  citations: string[];
  cached_at: string;
}

export function useAfricaNews() {
  return useQuery({
    queryKey: ["africa-news"],
    queryFn: async (): Promise<NewsResponse> => {
      const { data, error } = await supabase.functions.invoke("africa-news");
      
      if (error) {
        console.error("Error fetching Africa news:", error);
        throw error;
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    },
    staleTime: 1000 * 60 * 30, // Cache 30 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
