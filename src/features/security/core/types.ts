
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

export interface SecurityAlert {
  id: string;
  type: 'suspicious_login' | 'new_device' | 'multiple_sessions' | 'security_setting_changed';
  message: string;
  details?: any;
  created_at: string;
  resolved: boolean;
}

export interface WebAuthnCredential {
  id: string;
  credential_id: string;
  public_key: string;
  name: string;
  device_type: 'biometric' | 'security_key' | 'platform';
  created_at: string;
  last_used: string | null;
}
