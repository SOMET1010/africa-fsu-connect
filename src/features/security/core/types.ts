
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
  e2e_encryption_enabled: boolean;
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

export interface SecurityAlert {
  id: string;
  type: 'suspicious_login' | 'new_device' | 'multiple_sessions' | 'security_setting_changed';
  message: string;
  details?: any;
  created_at: string;
  resolved: boolean;
}

export interface AnomalyAlert {
  id: string;
  user_id: string;
  type: 'suspicious_login' | 'unusual_location' | 'multiple_failures' | 'device_change' | 'time_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details?: any;
  created_at: string;
  resolved: boolean;
  auto_blocked: boolean;
  resolved_at: string | null;
  resolved_by: string | null;
}

export interface WebAuthnCredential {
  id: string;
  user_id: string;
  credential_id: string;
  public_key: string;
  name: string;
  device_type: 'biometric' | 'security_key' | 'platform';
  created_at: string;
  last_used: string | null;
  is_active: boolean;
}

export interface EncryptionKey {
  id: string;
  user_id: string;
  name: string;
  key_id: string;
  algorithm: string;
  key_data: string;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
  last_used: string | null;
}

export interface AnomalySettings {
  id: string;
  user_id: string;
  location_monitoring: boolean;
  device_monitoring: boolean;
  time_pattern_monitoring: boolean;
  failed_login_threshold: number;
  auto_block_enabled: boolean;
  sensitivity_level: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface ComplianceReport {
  id: string;
  user_id: string | null;
  report_type: 'gdpr' | 'hipaa' | 'sox' | 'iso27001' | 'custom';
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  report_data: any;
  file_url: string | null;
  created_at: string;
  completed_at: string | null;
  scheduled_for: string | null;
}

export interface NetworkSecurityEvent {
  id: string;
  user_id: string | null;
  event_type: 'intrusion_attempt' | 'ddos_attack' | 'malware_detected' | 'suspicious_traffic' | 'firewall_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source_ip: string | null;
  target_ip: string | null;
  description: string;
  details: any;
  blocked: boolean;
  created_at: string;
  resolved: boolean;
  resolved_at: string | null;
}
