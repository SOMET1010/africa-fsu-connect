
import { supabase } from '@/integrations/supabase/client';
import { SecurityPreferences, AuditLog, UserSession, EncryptionKey, AnomalyAlert, AnomalySettings, ComplianceReport, NetworkSecurityEvent, WebAuthnCredential } from '../core/types';

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

  // Encryption Keys
  static async getEncryptionKeys(userId: string): Promise<EncryptionKey[]> {
    const { data, error } = await supabase
      .from('encryption_keys')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as EncryptionKey[];
  }

  static async generateEncryptionKey(userId: string, name: string): Promise<EncryptionKey> {
    const keyData = {
      user_id: userId,
      name,
      key_id: `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      algorithm: 'AES-256-GCM',
      key_data: '***encrypted_key_data***', // In real implementation, this would be properly encrypted
      is_active: true
    };

    const { data, error } = await supabase
      .from('encryption_keys')
      .insert(keyData)
      .select()
      .single();

    if (error) throw error;
    return data as EncryptionKey;
  }

  // Anomaly Detection
  static async getAnomalyAlerts(userId: string): Promise<AnomalyAlert[]> {
    const { data, error } = await supabase
      .from('anomaly_alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data as AnomalyAlert[];
  }

  static async getAnomalySettings(userId: string): Promise<AnomalySettings> {
    const { data, error } = await supabase
      .from('anomaly_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    
    if (!data) {
      // Create default settings if none exist
      return this.createAnomalySettings(userId);
    }
    
    return data as AnomalySettings;
  }

  static async createAnomalySettings(userId: string): Promise<AnomalySettings> {
    const defaultSettings = {
      user_id: userId,
      location_monitoring: true,
      device_monitoring: true,
      time_pattern_monitoring: true,
      failed_login_threshold: 5,
      auto_block_enabled: false,
      sensitivity_level: 'medium'
    };

    const { data, error } = await supabase
      .from('anomaly_settings')
      .insert(defaultSettings)
      .select()
      .single();

    if (error) throw error;
    return data as AnomalySettings;
  }

  static async updateAnomalySettings(userId: string, settings: Partial<AnomalySettings>): Promise<AnomalySettings> {
    const { data, error } = await supabase
      .from('anomaly_settings')
      .update(settings)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as AnomalySettings;
  }

  // Compliance Reports
  static async getComplianceReports(userId: string): Promise<ComplianceReport[]> {
    const { data, error } = await supabase
      .from('compliance_reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ComplianceReport[];
  }

  static async generateComplianceReport(userId: string, reportType: string, title: string): Promise<ComplianceReport> {
    const reportData = {
      user_id: userId,
      report_type: reportType,
      title,
      description: `Generated ${reportType} compliance report`,
      status: 'pending'
    };

    const { data, error } = await supabase
      .from('compliance_reports')
      .insert(reportData)
      .select()
      .single();

    if (error) throw error;
    return data as ComplianceReport;
  }

  // Network Security Events
  static async getNetworkSecurityEvents(): Promise<NetworkSecurityEvent[]> {
    const { data, error } = await supabase
      .from('network_security_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data as NetworkSecurityEvent[];
  }

  // WebAuthn Credentials
  static async getWebAuthnCredentials(userId: string): Promise<WebAuthnCredential[]> {
    const { data, error } = await supabase
      .from('webauthn_credentials')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as WebAuthnCredential[];
  }

  static async registerWebAuthnCredential(userId: string, name: string, deviceType: string): Promise<WebAuthnCredential> {
    const credentialData = {
      user_id: userId,
      credential_id: `cred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      public_key: '***public_key_data***', // In real implementation, this would be the actual public key
      name,
      device_type: deviceType,
      is_active: true
    };

    const { data, error } = await supabase
      .from('webauthn_credentials')
      .insert(credentialData)
      .select()
      .single();

    if (error) throw error;
    return data as WebAuthnCredential;
  }
}
