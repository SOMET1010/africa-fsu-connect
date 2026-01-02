import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AdvancedStats {
  countries: number;
  profiles: number;
  documents: number;
  events: number;
  agencies: number;
  projects: number;
}

export const useAdvancedStats = () => {
  return useQuery({
    queryKey: ['advanced-stats'],
    queryFn: async (): Promise<AdvancedStats> => {
      const [countries, profiles, documents, events, agencies, projects] = await Promise.all([
        supabase.from('countries').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('documents').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('agencies').select('id', { count: 'exact', head: true }),
        supabase.from('agency_projects').select('id', { count: 'exact', head: true }),
      ]);

      return {
        countries: countries.count ?? 0,
        profiles: profiles.count ?? 0,
        documents: documents.count ?? 0,
        events: events.count ?? 0,
        agencies: agencies.count ?? 0,
        projects: projects.count ?? 0,
      };
    },
    staleTime: 5 * 60 * 1000, // Cache 5 minutes
  });
};
