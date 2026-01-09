import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface FocalPoint {
  id: string;
  user_id: string | null;
  country_code: string;
  designation_type: 'primary' | 'secondary';
  designated_by: string | null;
  designation_document_url: string | null;
  designation_date: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  whatsapp_number: string | null;
  organization: string | null;
  job_title: string | null;
  status: 'pending' | 'invited' | 'active' | 'suspended' | 'revoked';
  invitation_token: string | null;
  invitation_sent_at: string | null;
  invitation_expires_at: string | null;
  activated_at: string | null;
  expires_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface CreateFocalPointData {
  country_code: string;
  designation_type: 'primary' | 'secondary';
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  whatsapp_number?: string;
  organization?: string;
  job_title?: string;
  designated_by?: string;
  notes?: string;
}

// Hook to get all focal points (admin only)
export function useFocalPoints() {
  return useQuery({
    queryKey: ['focal-points'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('focal_points')
        .select('*')
        .order('country_code', { ascending: true })
        .order('designation_type', { ascending: true });

      if (error) throw error;
      return data as FocalPoint[];
    },
  });
}

// Hook to get focal points for a specific country
export function useCountryFocalPoints(countryCode: string | null) {
  return useQuery({
    queryKey: ['focal-points', 'country', countryCode],
    queryFn: async () => {
      if (!countryCode) return [];
      
      const { data, error } = await supabase
        .from('focal_points')
        .select('*')
        .eq('country_code', countryCode)
        .in('status', ['active', 'pending', 'invited'])
        .order('designation_type', { ascending: true });

      if (error) throw error;
      return data as FocalPoint[];
    },
    enabled: !!countryCode,
  });
}

// Hook to get current user's focal point info
export function useMyFocalPoint() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['focal-points', 'my', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('focal_points')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as FocalPoint | null;
    },
    enabled: !!user?.id,
  });
}

// Hook to check if current user is a focal point
export function useIsFocalPoint() {
  const { data: focalPoint, isLoading } = useMyFocalPoint();
  return {
    isFocalPoint: !!focalPoint,
    focalPoint,
    isLoading,
  };
}

// Hook to create a new focal point (admin only)
export function useCreateFocalPoint() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateFocalPointData) => {
      const { data: result, error } = await supabase
        .from('focal_points')
        .insert({
          ...data,
          created_by: user?.id,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return result as FocalPoint;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focal-points'] });
      toast({
        title: 'Point focal créé',
        description: 'Le point focal a été ajouté avec succès.',
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

// Hook to update a focal point
export function useUpdateFocalPoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<FocalPoint> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('focal_points')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result as FocalPoint;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focal-points'] });
      toast({
        title: 'Point focal mis à jour',
        description: 'Les informations ont été mises à jour.',
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

// Hook to send invitation to a focal point
export function useSendFocalPointInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (focalPointId: string) => {
      // Update focal point status to invited
      const { data, error } = await supabase
        .from('focal_points')
        .update({
          status: 'invited',
          invitation_sent_at: new Date().toISOString(),
          invitation_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('id', focalPointId)
        .select()
        .single();

      if (error) throw error;

      // Create invitation record
      const { error: inviteError } = await supabase
        .from('focal_point_invitations')
        .insert({
          focal_point_id: focalPointId,
          email: data.email,
        });

      if (inviteError) throw inviteError;

      return data as FocalPoint;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['focal-points'] });
      toast({
        title: 'Invitation envoyée',
        description: `Une invitation a été envoyée à ${data.email}.`,
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

// Hook to activate a focal point (after they accept invitation)
export function useActivateFocalPoint() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (invitationToken: string) => {
      // Find focal point by token
      const { data: focalPoint, error: findError } = await supabase
        .from('focal_points')
        .select('*')
        .eq('invitation_token', invitationToken)
        .eq('status', 'invited')
        .single();

      if (findError || !focalPoint) {
        throw new Error('Invitation non valide ou expirée');
      }

      // Update focal point with user_id and activate
      const { data, error } = await supabase
        .from('focal_points')
        .update({
          user_id: user?.id,
          status: 'active',
          activated_at: new Date().toISOString(),
        })
        .eq('id', focalPoint.id)
        .select()
        .single();

      if (error) throw error;

      // Update user profile role
      if (user?.id) {
        await supabase
          .from('profiles')
          .update({ 
            role: 'point_focal',
            country: focalPoint.country_code,
          })
          .eq('user_id', user.id);
      }

      return data as FocalPoint;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focal-points'] });
      toast({
        title: 'Compte activé',
        description: 'Vous êtes maintenant point focal pour votre pays.',
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
