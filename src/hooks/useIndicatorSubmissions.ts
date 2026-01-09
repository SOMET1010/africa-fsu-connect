import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface IndicatorSubmission {
  id: string;
  country_code: string;
  indicator_code: string;
  year: number;
  quarter: number | null;
  submitted_value: number | null;
  value_text: string | null;
  unit: string | null;
  data_source: string | null;
  methodology_notes: string | null;
  submitted_by: string;
  status: 'draft' | 'submitted' | 'validated' | 'rejected' | 'published';
  validated_by: string | null;
  validation_date: string | null;
  validation_notes: string | null;
  rejected_reason: string | null;
  published_at: string | null;
  published_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSubmissionData {
  country_code: string;
  indicator_code: string;
  year: number;
  quarter?: number;
  submitted_value?: number;
  value_text?: string;
  unit?: string;
  data_source?: string;
  methodology_notes?: string;
}

// Hook to get submissions for a country
export function useCountrySubmissions(countryCode: string | null, year?: number) {
  return useQuery({
    queryKey: ['indicator-submissions', countryCode, year],
    queryFn: async () => {
      if (!countryCode) return [];
      
      let query = supabase
        .from('indicator_submissions')
        .select('*')
        .eq('country_code', countryCode)
        .order('indicator_code', { ascending: true });

      if (year) {
        query = query.eq('year', year);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as IndicatorSubmission[];
    },
    enabled: !!countryCode,
  });
}

// Hook to get submissions by status (for validation workflow)
export function useSubmissionsByStatus(status: IndicatorSubmission['status'], countryCode?: string) {
  return useQuery({
    queryKey: ['indicator-submissions', 'status', status, countryCode],
    queryFn: async () => {
      let query = supabase
        .from('indicator_submissions')
        .select('*')
        .eq('status', status)
        .order('updated_at', { ascending: false });

      if (countryCode) {
        query = query.eq('country_code', countryCode);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as IndicatorSubmission[];
    },
  });
}

// Hook to get my submissions
export function useMySubmissions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['indicator-submissions', 'my', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('indicator_submissions')
        .select('*')
        .eq('submitted_by', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as IndicatorSubmission[];
    },
    enabled: !!user?.id,
  });
}

// Hook to create or update a submission
export function useSaveSubmission() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateSubmissionData & { id?: string; status?: IndicatorSubmission['status'] }) => {
      const { id, ...submitData } = data;

      if (id) {
        // Update existing
        const { data: result, error } = await supabase
          .from('indicator_submissions')
          .update(submitData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return result as IndicatorSubmission;
      } else {
        // Create new
        const { data: result, error } = await supabase
          .from('indicator_submissions')
          .insert({
            ...submitData,
            submitted_by: user?.id,
            status: data.status || 'draft',
          })
          .select()
          .single();

        if (error) throw error;
        return result as IndicatorSubmission;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['indicator-submissions'] });
      toast({
        title: variables.id ? 'Données mises à jour' : 'Données enregistrées',
        description: 'Les données ont été sauvegardées avec succès.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// Hook to submit for validation
export function useSubmitForValidation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submissionId: string) => {
      const { data, error } = await supabase
        .from('indicator_submissions')
        .update({ status: 'submitted' })
        .eq('id', submissionId)
        .select()
        .single();

      if (error) throw error;
      return data as IndicatorSubmission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicator-submissions'] });
      toast({
        title: 'Soumis pour validation',
        description: 'Les données ont été soumises pour validation par le second point focal.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// Hook to validate a submission
export function useValidateSubmission() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ submissionId, notes }: { submissionId: string; notes?: string }) => {
      const { data, error } = await supabase
        .from('indicator_submissions')
        .update({
          status: 'validated',
          validated_by: user?.id,
          validation_date: new Date().toISOString(),
          validation_notes: notes,
        })
        .eq('id', submissionId)
        .select()
        .single();

      if (error) throw error;
      return data as IndicatorSubmission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicator-submissions'] });
      toast({
        title: 'Données validées',
        description: 'Les données ont été validées et sont en attente de publication.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// Hook to reject a submission
export function useRejectSubmission() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ submissionId, reason }: { submissionId: string; reason: string }) => {
      const { data, error } = await supabase
        .from('indicator_submissions')
        .update({
          status: 'rejected',
          validated_by: user?.id,
          validation_date: new Date().toISOString(),
          rejected_reason: reason,
        })
        .eq('id', submissionId)
        .select()
        .single();

      if (error) throw error;
      return data as IndicatorSubmission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicator-submissions'] });
      toast({
        title: 'Données rejetées',
        description: 'Les données ont été rejetées et renvoyées pour correction.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// Hook to publish a submission (admin only)
export function usePublishSubmission() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (submissionId: string) => {
      const { data, error } = await supabase
        .from('indicator_submissions')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
          published_by: user?.id,
        })
        .eq('id', submissionId)
        .select()
        .single();

      if (error) throw error;
      return data as IndicatorSubmission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicator-submissions'] });
      toast({
        title: 'Données publiées',
        description: 'Les données sont maintenant visibles publiquement.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// Hook to get submission stats
export function useSubmissionStats(countryCode?: string) {
  return useQuery({
    queryKey: ['indicator-submissions', 'stats', countryCode],
    queryFn: async () => {
      let query = supabase
        .from('indicator_submissions')
        .select('status');

      if (countryCode) {
        query = query.eq('country_code', countryCode);
      }

      const { data, error } = await query;
      if (error) throw error;

      const stats = {
        draft: 0,
        submitted: 0,
        validated: 0,
        rejected: 0,
        published: 0,
        total: data.length,
      };

      data.forEach((item) => {
        stats[item.status as keyof typeof stats]++;
      });

      return stats;
    },
  });
}
