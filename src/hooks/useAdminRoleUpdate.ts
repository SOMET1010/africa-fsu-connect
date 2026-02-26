import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';
import type { UserRole } from '@/types/userRole';

export const useAdminRoleUpdate = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateUserRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      logger.security('role_update_attempt', { userId, role, component: 'AdminRoleUpdate' });
      
      const { data, error } = await supabase.rpc('admin_update_user_role', {
        target_user_id: userId,
        new_role: role
      });

      if (error) {
        logger.error('Failed to update user role', error, { userId, role, component: 'AdminRoleUpdate' });
        throw error;
      }

      return data;
    },
    onSuccess: (_, { userId, role }) => {
      toast({
        title: "Rôle mis à jour",
        description: `Le rôle de l'utilisateur a été mis à jour avec succès.`,
      });
      
      logger.security('role_update_success', { userId, role, component: 'AdminRoleUpdate' });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
    onError: (error: any) => {
      const isUnauthorized = error.message?.includes('Only administrators');
      
      toast({
        title: "Erreur",
        description: isUnauthorized 
          ? "Vous n'avez pas les permissions nécessaires pour modifier les rôles."
          : "Impossible de mettre à jour le rôle. Veuillez réessayer.",
        variant: "destructive",
      });
      
      logger.error('Role update failed', error, { component: 'AdminRoleUpdate' });
    },
  });

  return { updateUserRole };
};
