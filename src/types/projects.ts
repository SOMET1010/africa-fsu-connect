import type { Database } from '@/integrations/supabase/types';

export type Project = Database['public']['Tables']['agency_projects']['Row'] & {
  agencies?: {
    id: string;
    name: string;
    acronym: string;
    country: string;
    region: string;
  };
  deployment_technology?: '2G' | '3G' | '4G' | '5G' | 'Mixed' | 'Other';
};

export type ProjectInsert = Database['public']['Tables']['agency_projects']['Insert'] & {
  deployment_technology?: '2G' | '3G' | '4G' | '5G' | 'Mixed' | 'Other';
};

export type ProjectUpdate = Database['public']['Tables']['agency_projects']['Update'] & {
  deployment_technology?: '2G' | '3G' | '4G' | '5G' | 'Mixed' | 'Other';
};