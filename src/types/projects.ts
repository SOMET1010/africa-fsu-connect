import type { Database } from '@/integrations/supabase/types';

export type Project = Database['public']['Tables']['agency_projects']['Row'] & {
  agencies?: {
    id: string;
    name: string;
    acronym: string;
    country: string;
    region: string;
  };
};

export type ProjectInsert = Database['public']['Tables']['agency_projects']['Insert'];
export type ProjectUpdate = Database['public']['Tables']['agency_projects']['Update'];