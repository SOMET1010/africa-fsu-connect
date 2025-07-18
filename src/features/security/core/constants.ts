
export const SECURITY_CONSTANTS = {
  MIN_SESSION_TIMEOUT: 15 * 60, // 15 minutes
  MAX_SESSION_TIMEOUT: 24 * 60 * 60, // 24 hours
  DEFAULT_SESSION_TIMEOUT: 2 * 60 * 60, // 2 hours
  MIN_CONCURRENT_SESSIONS: 1,
  MAX_CONCURRENT_SESSIONS: 10,
  DEFAULT_CONCURRENT_SESSIONS: 3,
} as const;

export const SECURITY_ACTIONS = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  LOGIN_FAILED: 'login_failed',
  PASSWORD_CHANGE: 'password_change',
  TWO_FACTOR_ENABLED: 'two_factor_enabled',
  TWO_FACTOR_DISABLED: 'two_factor_disabled',
  SESSION_TERMINATED: 'session_terminated',
  SECURITY_ALERT_DISMISSED: 'security_alert_dismissed',
} as const;

export const ALERT_TYPES = {
  SUSPICIOUS_LOGIN: 'suspicious_login',
  NEW_DEVICE: 'new_device',
  MULTIPLE_SESSIONS: 'multiple_sessions',
  SECURITY_SETTING_CHANGED: 'security_setting_changed',
} as const;

export const DEVICE_TYPES = {
  BIOMETRIC: 'biometric',
  SECURITY_KEY: 'security_key',
  PLATFORM: 'platform',
} as const;
