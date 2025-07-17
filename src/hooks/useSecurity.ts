import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface SecurityPreferences {
  id: string;
  user_id: string;
  two_factor_enabled: boolean;
  two_factor_secret?: string;
  backup_codes?: string[];
  login_notifications: boolean;
  security_alerts: boolean;
  session_timeout: number;
  max_concurrent_sessions: number;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action_type: string;
  resource_type?: string;
  resource_id?: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  success: boolean;
  created_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  session_token: string;
  ip_address?: string;
  user_agent?: string;
  location?: string;
  is_active: boolean;
  last_activity: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export const useSecurity = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch security preferences
  const { data: securityPreferences, isLoading: preferencesLoading } = useQuery({
    queryKey: ['security-preferences', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('security_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data as SecurityPreferences | null;
    },
    enabled: !!user?.id,
  });

  // Fetch audit logs
  const { data: auditLogs, isLoading: auditLoading } = useQuery({
    queryKey: ['audit-logs', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as AuditLog[];
    },
    enabled: !!user?.id,
  });

  // Fetch active sessions
  const { data: activeSessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['user-sessions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('last_activity', { ascending: false });

      if (error) throw error;
      return data as UserSession[];
    },
    enabled: !!user?.id,
  });

  // Update security preferences
  const updateSecurityPreferences = useMutation({
    mutationFn: async (preferences: Partial<SecurityPreferences>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('security_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-preferences'] });
      toast.success('Préférences de sécurité mises à jour');
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Log security event
  const logSecurityEvent = useMutation({
    mutationFn: async ({
      actionType,
      resourceType,
      resourceId,
      details,
      success = true,
    }: {
      actionType: string;
      resourceType?: string;
      resourceId?: string;
      details?: any;
      success?: boolean;
    }) => {
      if (!user?.id) return;

      const { error } = await supabase.rpc('log_security_event', {
        p_user_id: user.id,
        p_action_type: actionType,
        p_resource_type: resourceType,
        p_resource_id: resourceId,
        p_details: details,
        p_success: success,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });

  // Terminate session
  const terminateSession = useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('id', sessionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-sessions'] });
      toast.success('Session terminée');
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Initialize default security preferences
  const initializeSecurityPreferences = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('security_preferences')
        .insert({
          user_id: user.id,
          two_factor_enabled: false,
          login_notifications: true,
          security_alerts: true,
          session_timeout: 7200,
          max_concurrent_sessions: 3,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-preferences'] });
    },
  });

  // Auto-initialize preferences if they don't exist
  useEffect(() => {
    if (user && !preferencesLoading && !securityPreferences) {
      initializeSecurityPreferences.mutate();
    }
  }, [user, preferencesLoading, securityPreferences]);

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