
import { supabase } from '@/integrations/supabase/client';
import { SecurityPreferences, AuditLog, UserSession } from '../core/types';

export class SecurityApiService {
  static async getSecurityPreferences(userId: string): Promise<SecurityPreferences | null> {
    const { data, error } = await supabase
      .from('security_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data as SecurityPreferences | null;
  }

  static async updateSecurityPreferences(preferences: Partial<SecurityPreferences> & { user_id: string }): Promise<SecurityPreferences> {
    const { data, error } = await supabase
      .from('security_preferences')
      .upsert(preferences)
      .select()
      .single();

    if (error) throw error;
    return data as SecurityPreferences;
  }

  static async getAuditLogs(userId: string, limit = 50): Promise<AuditLog[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as AuditLog[];
  }

  static async getActiveSessions(userId: string): Promise<UserSession[]> {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('last_activity', { ascending: false });

    if (error) throw error;
    return data as UserSession[];
  }

  static async terminateSession(sessionId: string): Promise<void> {
    const { error } = await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('id', sessionId);

    if (error) throw error;
  }

  static async logSecurityEvent(params: {
    userId: string;
    actionType: string;
    resourceType?: string;
    resourceId?: string;
    details?: any;
    success?: boolean;
  }): Promise<void> {
    const { error } = await supabase.rpc('log_security_event', {
      p_user_id: params.userId,
      p_action_type: params.actionType,
      p_resource_type: params.resourceType,
      p_resource_id: params.resourceId,
      p_details: params.details,
      p_success: params.success ?? true,
    });

    if (error) throw error;
  }
}
