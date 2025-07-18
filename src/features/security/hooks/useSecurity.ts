
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { SecurityApiService } from '../services/securityApi';
import { SECURITY_CONSTANTS } from '../core/constants';

export const useSecurity = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch security preferences
  const { data: securityPreferences, isLoading: preferencesLoading } = useQuery({
    queryKey: ['security-preferences', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return SecurityApiService.getSecurityPreferences(user.id);
    },
    enabled: !!user?.id,
  });

  // Fetch audit logs
  const { data: auditLogs, isLoading: auditLoading } = useQuery({
    queryKey: ['audit-logs', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return SecurityApiService.getAuditLogs(user.id);
    },
    enabled: !!user?.id,
  });

  // Fetch active sessions
  const { data: activeSessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['user-sessions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return SecurityApiService.getActiveSessions(user.id);
    },
    enabled: !!user?.id,
  });

  // Update security preferences
  const updateSecurityPreferences = useMutation({
    mutationFn: async (preferences: any) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      return SecurityApiService.updateSecurityPreferences({
        user_id: user.id,
        ...preferences,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-preferences'] });
      toast.success('Préférences de sécurité mises à jour');
    },
    onError: (error: any) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Log security event
  const logSecurityEvent = useMutation({
    mutationFn: async (params: {
      actionType: string;
      resourceType?: string;
      resourceId?: string;
      details?: any;
      success?: boolean;
    }) => {
      if (!user?.id) return;
      
      return SecurityApiService.logSecurityEvent({
        userId: user.id,
        ...params,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });

  // Terminate session
  const terminateSession = useMutation({
    mutationFn: SecurityApiService.terminateSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-sessions'] });
      toast.success('Session terminée');
    },
    onError: (error: any) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Initialize default security preferences
  const initializeSecurityPreferences = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      return SecurityApiService.updateSecurityPreferences({
        user_id: user.id,
        two_factor_enabled: false,
        login_notifications: true,
        security_alerts: true,
        session_timeout: SECURITY_CONSTANTS.DEFAULT_SESSION_TIMEOUT,
        max_concurrent_sessions: SECURITY_CONSTANTS.DEFAULT_CONCURRENT_SESSIONS,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-preferences'] });
    },
  });

  return {
    securityPreferences,
    auditLogs,
    activeSessions,
    isLoading: preferencesLoading || auditLoading || sessionsLoading,
    updateSecurityPreferences,
    logSecurityEvent,
    terminateSession,
    initializeSecurityPreferences,
  };
};
