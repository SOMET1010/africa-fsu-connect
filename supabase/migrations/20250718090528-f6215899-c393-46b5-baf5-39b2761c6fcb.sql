
-- Phase 6B: Advanced Security Features Migration
-- Create tables for advanced security functionality

-- Create encryption_keys table for advanced encryption management
CREATE TABLE public.encryption_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_id TEXT NOT NULL UNIQUE,
  algorithm TEXT NOT NULL DEFAULT 'AES-256-GCM',
  key_data TEXT NOT NULL, -- Encrypted key data
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  last_used TIMESTAMP WITH TIME ZONE
);

-- Create anomaly_alerts table for AI-based anomaly detection
CREATE TABLE public.anomaly_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('suspicious_login', 'unusual_location', 'multiple_failures', 'device_change', 'time_anomaly')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved BOOLEAN DEFAULT false,
  auto_blocked BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id)
);

-- Create anomaly_settings table for user-specific anomaly detection settings
CREATE TABLE public.anomaly_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  location_monitoring BOOLEAN DEFAULT true,
  device_monitoring BOOLEAN DEFAULT true,
  time_pattern_monitoring BOOLEAN DEFAULT true,
  failed_login_threshold INTEGER DEFAULT 5 CHECK (failed_login_threshold > 0),
  auto_block_enabled BOOLEAN DEFAULT false,
  sensitivity_level TEXT DEFAULT 'medium' CHECK (sensitivity_level IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create compliance_reports table for compliance and audit reporting
CREATE TABLE public.compliance_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('gdpr', 'hipaa', 'sox', 'iso27001', 'custom')),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  report_data JSONB,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  scheduled_for TIMESTAMP WITH TIME ZONE
);

-- Create network_security_events table for network security monitoring
CREATE TABLE public.network_security_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('intrusion_attempt', 'ddos_attack', 'malware_detected', 'suspicious_traffic', 'firewall_breach')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  source_ip INET,
  target_ip INET,
  description TEXT NOT NULL,
  details JSONB,
  blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create webauthn_credentials table for WebAuthn/passkey management
CREATE TABLE public.webauthn_credentials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credential_id TEXT NOT NULL UNIQUE,
  public_key TEXT NOT NULL,
  name TEXT NOT NULL,
  device_type TEXT DEFAULT 'security_key' CHECK (device_type IN ('biometric', 'security_key', 'platform')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_used TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Add e2e_encryption_enabled column to existing security_preferences table
ALTER TABLE public.security_preferences 
ADD COLUMN e2e_encryption_enabled BOOLEAN DEFAULT false;

-- Enable RLS on all new tables
ALTER TABLE public.encryption_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomaly_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomaly_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webauthn_credentials ENABLE ROW LEVEL SECURITY;

-- RLS Policies for encryption_keys
CREATE POLICY "Users can view their own encryption keys" 
ON public.encryption_keys 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own encryption keys" 
ON public.encryption_keys 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own encryption keys" 
ON public.encryption_keys 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own encryption keys" 
ON public.encryption_keys 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for anomaly_alerts
CREATE POLICY "Users can view their own anomaly alerts" 
ON public.anomaly_alerts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert anomaly alerts" 
ON public.anomaly_alerts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own anomaly alerts" 
ON public.anomaly_alerts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all anomaly alerts" 
ON public.anomaly_alerts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'admin_pays')
  )
);

-- RLS Policies for anomaly_settings
CREATE POLICY "Users can view their own anomaly settings" 
ON public.anomaly_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own anomaly settings" 
ON public.anomaly_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own anomaly settings" 
ON public.anomaly_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for compliance_reports
CREATE POLICY "Users can view their own compliance reports" 
ON public.compliance_reports 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all compliance reports" 
ON public.compliance_reports 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'admin_pays')
  )
);

CREATE POLICY "Admins can manage compliance reports" 
ON public.compliance_reports 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'admin_pays')
  )
);

-- RLS Policies for network_security_events
CREATE POLICY "Admins can view all network security events" 
ON public.network_security_events 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'admin_pays')
  )
);

CREATE POLICY "System can insert network security events" 
ON public.network_security_events 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage network security events" 
ON public.network_security_events 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'admin_pays')
  )
);

-- RLS Policies for webauthn_credentials
CREATE POLICY "Users can view their own WebAuthn credentials" 
ON public.webauthn_credentials 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own WebAuthn credentials" 
ON public.webauthn_credentials 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own WebAuthn credentials" 
ON public.webauthn_credentials 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own WebAuthn credentials" 
ON public.webauthn_credentials 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_encryption_keys_user_id ON public.encryption_keys(user_id);
CREATE INDEX idx_encryption_keys_active ON public.encryption_keys(is_active, user_id);
CREATE INDEX idx_anomaly_alerts_user_id_created ON public.anomaly_alerts(user_id, created_at DESC);
CREATE INDEX idx_anomaly_alerts_type_severity ON public.anomaly_alerts(type, severity);
CREATE INDEX idx_anomaly_alerts_resolved ON public.anomaly_alerts(resolved, user_id);
CREATE INDEX idx_compliance_reports_type_status ON public.compliance_reports(report_type, status);
CREATE INDEX idx_compliance_reports_scheduled ON public.compliance_reports(scheduled_for) WHERE scheduled_for IS NOT NULL;
CREATE INDEX idx_network_events_type_severity ON public.network_security_events(event_type, severity);
CREATE INDEX idx_network_events_created ON public.network_security_events(created_at DESC);
CREATE INDEX idx_webauthn_user_active ON public.webauthn_credentials(user_id, is_active);

-- Create triggers for updated_at columns
CREATE TRIGGER update_anomaly_settings_updated_at
BEFORE UPDATE ON public.anomaly_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create functions for advanced security operations
CREATE OR REPLACE FUNCTION public.generate_anomaly_alert(
  p_user_id UUID,
  p_type TEXT,
  p_severity TEXT,
  p_message TEXT,
  p_details JSONB DEFAULT NULL,
  p_auto_block BOOLEAN DEFAULT false
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  alert_id UUID;
BEGIN
  INSERT INTO public.anomaly_alerts (
    user_id, type, severity, message, details, auto_blocked
  )
  VALUES (
    p_user_id, p_type, p_severity, p_message, p_details, p_auto_block
  )
  RETURNING id INTO alert_id;
  
  -- Log the security event
  PERFORM public.log_security_event(
    p_user_id, 
    'anomaly_detected', 
    'security', 
    alert_id::text, 
    jsonb_build_object('type', p_type, 'severity', p_severity)
  );
  
  RETURN alert_id;
END;
$$;

-- Function to clean up old anomaly alerts
CREATE OR REPLACE FUNCTION public.cleanup_old_anomaly_alerts()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.anomaly_alerts 
  WHERE created_at < now() - interval '90 days' 
  AND resolved = true;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Function to get user security status
CREATE OR REPLACE FUNCTION public.get_user_security_status(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  prefs RECORD;
  alert_count INTEGER;
  active_sessions INTEGER;
BEGIN
  -- Get security preferences
  SELECT * INTO prefs 
  FROM public.security_preferences 
  WHERE user_id = p_user_id;
  
  -- Count unresolved alerts
  SELECT COUNT(*) INTO alert_count
  FROM public.anomaly_alerts
  WHERE user_id = p_user_id AND resolved = false;
  
  -- Count active sessions
  SELECT COUNT(*) INTO active_sessions
  FROM public.user_sessions
  WHERE user_id = p_user_id AND is_active = true;
  
  result := jsonb_build_object(
    'two_factor_enabled', COALESCE(prefs.two_factor_enabled, false),
    'e2e_encryption_enabled', COALESCE(prefs.e2e_encryption_enabled, false),
    'login_notifications', COALESCE(prefs.login_notifications, true),
    'security_alerts', COALESCE(prefs.security_alerts, true),
    'unresolved_alerts', alert_count,
    'active_sessions', active_sessions,
    'session_timeout', COALESCE(prefs.session_timeout, 7200),
    'max_concurrent_sessions', COALESCE(prefs.max_concurrent_sessions, 3)
  );
  
  RETURN result;
END;
$$;
