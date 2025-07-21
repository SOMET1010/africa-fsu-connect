
-- Phase 1: Correction des vulnérabilités de sécurité critiques
-- Sécurisation des fonctions avec search_path et noms qualifiés complets

-- 1. Corriger generate_anomaly_alert
CREATE OR REPLACE FUNCTION public.generate_anomaly_alert(
  p_user_id uuid,
  p_type text,
  p_severity text,
  p_message text,
  p_details jsonb DEFAULT NULL,
  p_auto_block boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  alert_id uuid;
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

-- 2. Corriger cleanup_old_anomaly_alerts
CREATE OR REPLACE FUNCTION public.cleanup_old_anomaly_alerts()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM public.anomaly_alerts 
  WHERE created_at < now() - interval '90 days' 
  AND resolved = true;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- 3. Corriger log_security_event
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_user_id uuid,
  p_action_type text,
  p_resource_type text DEFAULT NULL,
  p_resource_id text DEFAULT NULL,
  p_details jsonb DEFAULT NULL,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_success boolean DEFAULT true
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO public.audit_logs (
    user_id, action_type, resource_type, resource_id, 
    details, ip_address, user_agent, success
  )
  VALUES (
    p_user_id, p_action_type, p_resource_type, p_resource_id,
    p_details, p_ip_address, p_user_agent, p_success
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- 4. Corriger cleanup_expired_sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM public.user_sessions 
  WHERE expires_at < now() OR (last_activity < now() - interval '30 days');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- 5. Corriger get_user_security_status
CREATE OR REPLACE FUNCTION public.get_user_security_status(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  result jsonb;
  prefs record;
  alert_count integer;
  active_sessions integer;
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

-- 6. Corriger get_user_role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS user_role
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE profiles.user_id = get_user_role.user_id);
END;
$$;

-- 7. Corriger is_admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
BEGIN
  RETURN (SELECT role IN ('super_admin', 'admin_pays', 'editeur') FROM public.profiles WHERE profiles.user_id = is_admin.user_id);
END;
$$;

-- 8. Corriger handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$;

-- 9. Corriger update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 10. Corriger update_post_reply_count
CREATE OR REPLACE FUNCTION public.update_post_reply_count()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.forum_posts 
    SET reply_count = reply_count + 1,
        last_reply_at = now()
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.forum_posts 
    SET reply_count = reply_count - 1
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- 11. Corriger update_event_attendee_count
CREATE OR REPLACE FUNCTION public.update_event_attendee_count()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.events 
    SET current_attendees = current_attendees + 1
    WHERE id = NEW.event_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.events 
    SET current_attendees = current_attendees - 1
    WHERE id = OLD.event_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;
