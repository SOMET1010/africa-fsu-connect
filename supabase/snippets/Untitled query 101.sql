
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."document_type" AS ENUM (
    'guide',
    'rapport',
    'presentation',
    'formulaire',
    'autre'
);


ALTER TYPE "public"."document_type" OWNER TO "postgres";


CREATE TYPE "public"."submission_status" AS ENUM (
    'brouillon',
    'soumis',
    'en_revision',
    'approuve',
    'rejete'
);


ALTER TYPE "public"."submission_status" OWNER TO "postgres";


CREATE TYPE "public"."user_role" AS ENUM (
    'super_admin',
    'admin_pays',
    'editeur',
    'contributeur',
    'lecteur',
    'point_focal'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_update_user_role"("target_user_id" "uuid", "new_role" "public"."user_role") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  -- Check if caller is admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only administrators can update user roles';
  END IF;
  
  -- Update the role
  UPDATE public.profiles 
  SET role = new_role, updated_at = now()
  WHERE user_id = target_user_id;
  
  RETURN FOUND;
END;
$$;


ALTER FUNCTION "public"."admin_update_user_role"("target_user_id" "uuid", "new_role" "public"."user_role") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."audit_role_change"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  -- Log role changes to audit_logs
  IF OLD.role != NEW.role THEN
    PERFORM public.log_security_event(
      NEW.user_id,
      'role_changed',
      'profiles',
      NEW.id::text,
      jsonb_build_object(
        'old_role', OLD.role,
        'new_role', NEW.role,
        'changed_by', auth.uid()
      )
    );
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."audit_role_change"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_transaction_fees"("transaction_amount" numeric, "payment_method_type" character varying, "transaction_type_param" character varying) RETURNS TABLE("platform_fee" numeric, "processing_fee" numeric, "total_fees" numeric)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
DECLARE
    platform_rate DECIMAL := 0.025;
    processing_rate DECIMAL;
    min_processing_fee DECIMAL := 500;
    max_processing_fee DECIMAL := 5000;
BEGIN
    CASE payment_method_type
        WHEN 'orange_money' THEN processing_rate := 0.015;
        WHEN 'mtn_money' THEN processing_rate := 0.015;
        WHEN 'moov_money' THEN processing_rate := 0.015;
        WHEN 'card' THEN processing_rate := 0.035;
        WHEN 'bank_transfer' THEN processing_rate := 0.01;
        ELSE processing_rate := 0.02;
    END CASE;

    platform_fee := ROUND(transaction_amount * platform_rate, 0);
    processing_fee := GREATEST(
        min_processing_fee,
        LEAST(max_processing_fee, ROUND(transaction_amount * processing_rate, 0))
    );
    
    total_fees := platform_fee + processing_fee;

    RETURN QUERY SELECT platform_fee, processing_fee, total_fees;
END;
$$;


ALTER FUNCTION "public"."calculate_transaction_fees"("transaction_amount" numeric, "payment_method_type" character varying, "transaction_type_param" character varying) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_expired_sessions"() RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
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


ALTER FUNCTION "public"."cleanup_expired_sessions"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_old_anomaly_alerts"() RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
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


ALTER FUNCTION "public"."cleanup_old_anomaly_alerts"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_country_team_conversation"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  existing_conversation_id UUID;
  other_focal_point RECORD;
BEGIN
  -- Only trigger when a focal point becomes active
  IF NEW.status = 'active' AND (OLD.status IS NULL OR OLD.status != 'active') THEN
    -- Check if a country team conversation already exists
    SELECT id INTO existing_conversation_id
    FROM public.focal_conversations
    WHERE type = 'country_team' AND country_code = NEW.country_code;
    
    -- If no conversation exists, create one
    IF existing_conversation_id IS NULL THEN
      INSERT INTO public.focal_conversations (type, country_code, name, created_by)
      VALUES ('country_team', NEW.country_code, 'Équipe ' || NEW.country_code, NEW.user_id)
      RETURNING id INTO existing_conversation_id;
    END IF;
    
    -- Add the new focal point to the conversation if not already a participant
    INSERT INTO public.focal_conversation_participants (conversation_id, focal_point_id, user_id)
    VALUES (existing_conversation_id, NEW.id, NEW.user_id)
    ON CONFLICT (conversation_id, focal_point_id) DO NOTHING;
    
    -- Add other active focal points from the same country to the conversation
    FOR other_focal_point IN
      SELECT id, user_id FROM public.focal_points
      WHERE country_code = NEW.country_code
      AND status = 'active'
      AND id != NEW.id
    LOOP
      INSERT INTO public.focal_conversation_participants (conversation_id, focal_point_id, user_id)
      VALUES (existing_conversation_id, other_focal_point.id, other_focal_point.user_id)
      ON CONFLICT (conversation_id, focal_point_id) DO NOTHING;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."create_country_team_conversation"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_payment_schedule"("recurring_payment_id" "uuid", "months_ahead" integer DEFAULT 12) RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
DECLARE
    rec_payment record;
    schedule_date DATE;
    schedule_count INTEGER := 0;
BEGIN
    SELECT * INTO rec_payment
    FROM public.recurring_payments
    WHERE id = recurring_payment_id AND status = 'active';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Paiement récurrent non trouvé ou inactif';
    END IF;

    FOR i IN 0..months_ahead-1 LOOP
        schedule_date := rec_payment.next_payment_date + (i || ' months')::INTERVAL;
        
        IF NOT EXISTS (
            SELECT 1 FROM public.payment_schedules 
            WHERE payment_schedules.recurring_payment_id = rec_payment.id 
            AND due_date = schedule_date
        ) THEN
            INSERT INTO public.payment_schedules (
                recurring_payment_id,
                tenant_id,
                amount,
                currency,
                due_date,
                status
            ) VALUES (
                rec_payment.id,
                rec_payment.user_id,
                rec_payment.amount,
                rec_payment.currency,
                schedule_date,
                'pending'
            );
            
            schedule_count := schedule_count + 1;
        END IF;
    END LOOP;

    RETURN schedule_count;
END;
$$;


ALTER FUNCTION "public"."create_payment_schedule"("recurring_payment_id" "uuid", "months_ahead" integer) OWNER TO "postgres";


CREATE PROCEDURE "public"."detect_late_payments_25f323c4"()
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
BEGIN
  PERFORM net.http_post(
    url:='https://wsbawdvqfbmtjtdtyddy.supabase.co/functions/v1/detect-late-payments',
    headers:=jsonb_build_object('Content-Type', 'application/json'),
    body:='{"edge_function_name":"detect-late-payments"}',
    timeout_milliseconds:=10000
  );
  COMMIT;
END;
$$;


ALTER PROCEDURE "public"."detect_late_payments_25f323c4"() OWNER TO "postgres";


CREATE PROCEDURE "public"."execute_recurring_payments_e84aeb13"()
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
BEGIN
  PERFORM net.http_post(
    url:='https://wsbawdvqfbmtjtdtyddy.supabase.co/functions/v1/execute-recurring-payments',
    headers:=jsonb_build_object('Content-Type', 'application/json'),
    body:='{"edge_function_name":"execute-recurring-payments"}',
    timeout_milliseconds:=10000
  );
  COMMIT;
END;
$$;


ALTER PROCEDURE "public"."execute_recurring_payments_e84aeb13"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_anomaly_alert"("p_user_id" "uuid", "p_type" "text", "p_severity" "text", "p_message" "text", "p_details" "jsonb" DEFAULT NULL::"jsonb", "p_auto_block" boolean DEFAULT false) RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
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


ALTER FUNCTION "public"."generate_anomaly_alert"("p_user_id" "uuid", "p_type" "text", "p_severity" "text", "p_message" "text", "p_details" "jsonb", "p_auto_block" boolean) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_country_focal_points"("country" "text") RETURNS TABLE("id" "uuid", "designation_type" "text", "first_name" "text", "last_name" "text", "email" "text", "organization" "text", "job_title" "text", "status" "text")
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
  SELECT 
    fp.id,
    fp.designation_type,
    fp.first_name,
    fp.last_name,
    fp.email,
    fp.organization,
    fp.job_title,
    fp.status
  FROM public.focal_points fp
  WHERE fp.country_code = country
  AND fp.status IN ('active', 'pending', 'invited')
  ORDER BY fp.designation_type;
$$;


ALTER FUNCTION "public"."get_country_focal_points"("country" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_financial_summary"("user_id" "uuid") RETURNS TABLE("balance" numeric, "total_income" numeric, "total_expenses" numeric, "pending_transactions" integer)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $_$
BEGIN
    RETURN QUERY
    SELECT 
        public.get_user_balance($1) as balance,
        COALESCE(SUM(
            CASE 
                WHEN t.transaction_type IN ('rent_received', 'deposit_received', 'refund_received') 
                AND t.status = 'completed'
                THEN t.amount
                ELSE 0
            END
        ), 0) as total_income,
        COALESCE(SUM(
            CASE 
                WHEN t.transaction_type IN ('rent_payment', 'deposit_payment', 'fee_payment') 
                AND t.status = 'completed'
                THEN t.amount
                ELSE 0
            END
        ), 0) as total_expenses,
        COUNT(
            CASE 
                WHEN t.status IN ('pending', 'processing') 
                THEN 1
                ELSE NULL
            END
        )::INTEGER as pending_transactions
    FROM public.transactions t
    WHERE t.user_id = $1;
END;
$_$;


ALTER FUNCTION "public"."get_financial_summary"("user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_balance"("user_id" "uuid") RETURNS numeric
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $_$
DECLARE
    balance DECIMAL := 0;
BEGIN
    SELECT COALESCE(SUM(
        CASE 
            WHEN t.transaction_type IN ('rent_received', 'deposit_received', 'refund_received') 
            THEN t.amount
            ELSE -t.amount
        END
    ), 0) INTO balance
    FROM public.transactions t
    WHERE (t.user_id = $1 OR t.to_account_id IN (
        SELECT id FROM public.payment_accounts WHERE payment_accounts.user_id = $1
    ))
    AND t.status = 'completed';

    RETURN balance;
END;
$_$;


ALTER FUNCTION "public"."get_user_balance"("user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_role"() RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role 
    FROM public.profiles 
    WHERE id = auth.uid();
    RETURN COALESCE(user_role, 'user');
END;
$$;


ALTER FUNCTION "public"."get_user_role"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_role"("user_id" "uuid") RETURNS "public"."user_role"
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE profiles.user_id = get_user_role.user_id);
END;
$$;


ALTER FUNCTION "public"."get_user_role"("user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_security_status"("p_user_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
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


ALTER FUNCTION "public"."get_user_security_status"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
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


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"("user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  RETURN (SELECT role IN ('super_admin', 'admin_pays', 'editeur') FROM public.profiles WHERE profiles.user_id = is_admin.user_id);
END;
$$;


ALTER FUNCTION "public"."is_admin"("user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_focal_point"("user_id" "uuid", "country" "text" DEFAULT NULL::"text") RETURNS boolean
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  IF country IS NULL THEN
    RETURN EXISTS (
      SELECT 1 FROM public.focal_points
      WHERE focal_points.user_id = is_focal_point.user_id
      AND status = 'active'
    );
  ELSE
    RETURN EXISTS (
      SELECT 1 FROM public.focal_points
      WHERE focal_points.user_id = is_focal_point.user_id
      AND country_code = country
      AND status = 'active'
    );
  END IF;
END;
$$;


ALTER FUNCTION "public"."is_focal_point"("user_id" "uuid", "country" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_security_event"("p_user_id" "uuid", "p_action_type" "text", "p_resource_type" "text" DEFAULT NULL::"text", "p_resource_id" "text" DEFAULT NULL::"text", "p_details" "jsonb" DEFAULT NULL::"jsonb", "p_ip_address" "inet" DEFAULT NULL::"inet", "p_user_agent" "text" DEFAULT NULL::"text", "p_success" boolean DEFAULT true) RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
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


ALTER FUNCTION "public"."log_security_event"("p_user_id" "uuid", "p_action_type" "text", "p_resource_type" "text", "p_resource_id" "text", "p_details" "jsonb", "p_ip_address" "inet", "p_user_agent" "text", "p_success" boolean) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."process_overdue_payments"() RETURNS TABLE("processed_count" integer, "late_fees_applied" numeric)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
DECLARE
    total_processed INTEGER := 0;
    total_late_fees DECIMAL := 0;
    late_fee_rate DECIMAL := 0.05;
    min_late_fee DECIMAL := 1000;
BEGIN
    UPDATE public.payment_schedules
    SET 
        status = 'overdue',
        late_fee = GREATEST(min_late_fee, amount * late_fee_rate),
        updated_at = NOW()
    WHERE due_date < CURRENT_DATE
    AND status = 'pending';

    GET DIAGNOSTICS total_processed = ROW_COUNT;

    SELECT COALESCE(SUM(late_fee), 0) INTO total_late_fees
    FROM public.payment_schedules
    WHERE status = 'overdue'
    AND updated_at::DATE = CURRENT_DATE;

    RETURN QUERY SELECT total_processed, total_late_fees;
END;
$$;


ALTER FUNCTION "public"."process_overdue_payments"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."release_escrow_funds"("escrow_account_id" "uuid", "release_amount" numeric, "release_reason" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
DECLARE
    escrow_rec record;
    transaction_id UUID;
BEGIN
    SELECT * INTO escrow_rec
    FROM public.escrow_accounts
    WHERE id = escrow_account_id AND status = 'active';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Compte escrow non trouvé ou inactif';
    END IF;

    IF release_amount > escrow_rec.amount THEN
        RAISE EXCEPTION 'Montant de libération supérieur au solde escrow';
    END IF;

    INSERT INTO public.transactions (
        transaction_ref,
        user_id,
        transaction_type,
        amount,
        currency,
        status,
        description,
        metadata
    ) VALUES (
        'ESC_' || extract(epoch from now()) || '_' || substring(gen_random_uuid()::text, 1, 8),
        escrow_rec.landlord_id,
        'escrow_release',
        release_amount,
        escrow_rec.currency,
        'completed',
        'Libération de fonds d''escrow: ' || release_reason,
        jsonb_build_object(
            'escrow_account_id', escrow_account_id,
            'tenant_id', escrow_rec.tenant_id,
            'release_reason', release_reason
        )
    ) RETURNING id INTO transaction_id;

    UPDATE public.escrow_accounts
    SET 
        amount = amount - release_amount,
        status = CASE 
            WHEN amount - release_amount <= 0 THEN 'released'
            ELSE 'partially_released'
        END,
        actual_release_date = CASE 
            WHEN amount - release_amount <= 0 THEN NOW()
            ELSE actual_release_date
        END,
        updated_at = NOW()
    WHERE id = escrow_account_id;

    RETURN TRUE;
END;
$$;


ALTER FUNCTION "public"."release_escrow_funds"("escrow_account_id" "uuid", "release_amount" numeric, "release_reason" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_event_attendee_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
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


ALTER FUNCTION "public"."update_event_attendee_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_post_reply_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
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


ALTER FUNCTION "public"."update_post_reply_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_user_profiles_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_user_profiles_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."agencies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "acronym" "text" NOT NULL,
    "country" "text" NOT NULL,
    "region" "text" NOT NULL,
    "website_url" "text" NOT NULL,
    "api_endpoint" "text",
    "logo_url" "text",
    "description" "text",
    "contact_email" "text",
    "phone" "text",
    "address" "text",
    "established_date" "date",
    "is_active" boolean DEFAULT true,
    "last_sync_at" timestamp with time zone,
    "sync_status" "text" DEFAULT 'pending'::"text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "agencies_region_check" CHECK (("region" = ANY (ARRAY['CEDEAO'::"text", 'SADC'::"text", 'EACO'::"text", 'ECCAS'::"text", 'UMA'::"text"]))),
    CONSTRAINT "agencies_sync_status_check" CHECK (("sync_status" = ANY (ARRAY['pending'::"text", 'active'::"text", 'error'::"text", 'inactive'::"text"])))
);


ALTER TABLE "public"."agencies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."agency_connectors" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "agency_id" "uuid" NOT NULL,
    "connector_type" "text" NOT NULL,
    "endpoint_url" "text",
    "auth_method" "text",
    "auth_config" "jsonb" DEFAULT '{}'::"jsonb",
    "sync_frequency" integer DEFAULT 3600,
    "last_sync_at" timestamp with time zone,
    "sync_status" "text" DEFAULT 'inactive'::"text",
    "error_message" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "agency_connectors_auth_method_check" CHECK (("auth_method" = ANY (ARRAY['none'::"text", 'api_key'::"text", 'oauth'::"text", 'basic'::"text"]))),
    CONSTRAINT "agency_connectors_connector_type_check" CHECK (("connector_type" = ANY (ARRAY['api'::"text", 'scraper'::"text", 'rss'::"text", 'manual'::"text"]))),
    CONSTRAINT "agency_connectors_sync_status_check" CHECK (("sync_status" = ANY (ARRAY['active'::"text", 'error'::"text", 'inactive'::"text"])))
);


ALTER TABLE "public"."agency_connectors" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."agency_projects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "agency_id" "uuid" NOT NULL,
    "external_id" "text",
    "title" "text" NOT NULL,
    "description" "text",
    "status" "text" NOT NULL,
    "budget" numeric(15,2),
    "beneficiaries" integer,
    "start_date" "date",
    "end_date" "date",
    "completion_percentage" integer DEFAULT 0,
    "tags" "text"[],
    "location" "text",
    "coordinates" "point",
    "source_url" "text",
    "last_updated_at" timestamp with time zone,
    "sync_status" "text" DEFAULT 'synced'::"text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "agency_projects_completion_percentage_check" CHECK ((("completion_percentage" >= 0) AND ("completion_percentage" <= 100))),
    CONSTRAINT "agency_projects_sync_status_check" CHECK (("sync_status" = ANY (ARRAY['synced'::"text", 'modified'::"text", 'conflict'::"text"])))
);


ALTER TABLE "public"."agency_projects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."agency_resource_comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "resource_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "user_name" "text" NOT NULL,
    "comment" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."agency_resource_comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."agency_resource_versions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "resource_id" "uuid" NOT NULL,
    "version" "text" NOT NULL,
    "file_url" "text" NOT NULL,
    "file_name" "text" NOT NULL,
    "file_size" bigint,
    "changes_summary" "text" NOT NULL,
    "uploaded_by" "uuid" NOT NULL,
    "uploaded_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."agency_resource_versions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."agency_resources" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "agency_id" "uuid" NOT NULL,
    "external_id" "text",
    "title" "text" NOT NULL,
    "description" "text",
    "resource_type" "text" NOT NULL,
    "file_url" "text",
    "file_size" bigint,
    "mime_type" "text",
    "tags" "text"[],
    "download_count" integer DEFAULT 0,
    "source_url" "text",
    "last_updated_at" timestamp with time zone,
    "sync_status" "text" DEFAULT 'synced'::"text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "access_level" "text" DEFAULT 'public'::"text" NOT NULL,
    "allowed_roles" "text"[] DEFAULT '{}'::"text"[],
    "shared_with_agencies" "uuid"[] DEFAULT '{}'::"uuid"[],
    "uploaded_by" "uuid",
    "is_public" boolean DEFAULT true NOT NULL,
    "current_version" "text" DEFAULT '1.0'::"text",
    CONSTRAINT "agency_resources_resource_type_check" CHECK (("resource_type" = ANY (ARRAY['document'::"text", 'guide'::"text", 'report'::"text", 'template'::"text", 'tool'::"text", 'other'::"text"]))),
    CONSTRAINT "agency_resources_sync_status_check" CHECK (("sync_status" = ANY (ARRAY['synced'::"text", 'modified'::"text", 'conflict'::"text"])))
);


ALTER TABLE "public"."agency_resources" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."anomaly_alerts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "type" "text" NOT NULL,
    "severity" "text" DEFAULT 'medium'::"text" NOT NULL,
    "message" "text" NOT NULL,
    "details" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "resolved" boolean DEFAULT false,
    "auto_blocked" boolean DEFAULT false,
    "resolved_at" timestamp with time zone,
    "resolved_by" "uuid",
    CONSTRAINT "anomaly_alerts_severity_check" CHECK (("severity" = ANY (ARRAY['low'::"text", 'medium'::"text", 'high'::"text", 'critical'::"text"]))),
    CONSTRAINT "anomaly_alerts_type_check" CHECK (("type" = ANY (ARRAY['suspicious_login'::"text", 'unusual_location'::"text", 'multiple_failures'::"text", 'device_change'::"text", 'time_anomaly'::"text"])))
);


ALTER TABLE "public"."anomaly_alerts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."anomaly_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "location_monitoring" boolean DEFAULT true,
    "device_monitoring" boolean DEFAULT true,
    "time_pattern_monitoring" boolean DEFAULT true,
    "failed_login_threshold" integer DEFAULT 5,
    "auto_block_enabled" boolean DEFAULT false,
    "sensitivity_level" "text" DEFAULT 'medium'::"text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "anomaly_settings_failed_login_threshold_check" CHECK (("failed_login_threshold" > 0)),
    CONSTRAINT "anomaly_settings_sensitivity_level_check" CHECK (("sensitivity_level" = ANY (ARRAY['low'::"text", 'medium'::"text", 'high'::"text"])))
);


ALTER TABLE "public"."anomaly_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."audit_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "action_type" "text" NOT NULL,
    "resource_type" "text",
    "resource_id" "text",
    "details" "jsonb",
    "ip_address" "inet",
    "user_agent" "text",
    "success" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."audit_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."compliance_reports" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "report_type" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "report_data" "jsonb",
    "file_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "completed_at" timestamp with time zone,
    "scheduled_for" timestamp with time zone,
    CONSTRAINT "compliance_reports_report_type_check" CHECK (("report_type" = ANY (ARRAY['gdpr'::"text", 'hipaa'::"text", 'sox'::"text", 'iso27001'::"text", 'custom'::"text"]))),
    CONSTRAINT "compliance_reports_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'in_progress'::"text", 'completed'::"text", 'failed'::"text"])))
);


ALTER TABLE "public"."compliance_reports" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."countries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "name_fr" "text" NOT NULL,
    "name_en" "text" NOT NULL,
    "region" "text",
    "continent" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "latitude" numeric(10,8),
    "longitude" numeric(11,8),
    "capital_city" "text",
    "official_language" "text" DEFAULT 'fr'::"text",
    "working_languages" "text"[] DEFAULT ARRAY['fr'::"text"],
    "sutel_community" "text"
);


ALTER TABLE "public"."countries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."data_sources" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "acronym" "text" NOT NULL,
    "description" "text",
    "website_url" "text",
    "api_endpoint" "text",
    "api_key_required" boolean DEFAULT false,
    "update_frequency" "text" DEFAULT 'monthly'::"text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."data_sources" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."data_versions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "table_name" "text" NOT NULL,
    "record_id" "uuid" NOT NULL,
    "version_number" integer NOT NULL,
    "data_snapshot" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid",
    "sync_id" "uuid",
    "change_type" "text" DEFAULT 'update'::"text" NOT NULL
);


ALTER TABLE "public"."data_versions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."document_comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "document_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "user_name" "text" NOT NULL,
    "comment" "text" NOT NULL,
    "section" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."document_comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."document_versions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "document_id" "uuid" NOT NULL,
    "version" "text" NOT NULL,
    "file_url" "text" NOT NULL,
    "file_name" "text" NOT NULL,
    "file_size" bigint NOT NULL,
    "changes_summary" "text" NOT NULL,
    "uploaded_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "uploaded_by" "uuid" NOT NULL
);


ALTER TABLE "public"."document_versions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."documents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "file_url" "text",
    "file_name" "text",
    "file_size" bigint,
    "mime_type" "text",
    "document_type" "public"."document_type" DEFAULT 'autre'::"public"."document_type" NOT NULL,
    "country" "text",
    "tags" "text"[],
    "uploaded_by" "uuid" NOT NULL,
    "is_public" boolean DEFAULT true NOT NULL,
    "download_count" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "view_count" integer DEFAULT 0,
    "featured" boolean DEFAULT false,
    "access_level" "text" DEFAULT 'public'::"text" NOT NULL,
    "allowed_roles" "text"[] DEFAULT '{}'::"text"[]
);


ALTER TABLE "public"."documents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."encryption_keys" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "key_id" "text" NOT NULL,
    "algorithm" "text" DEFAULT 'AES-256-GCM'::"text" NOT NULL,
    "key_data" "text" NOT NULL,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "expires_at" timestamp with time zone,
    "last_used" timestamp with time zone
);


ALTER TABLE "public"."encryption_keys" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_registrations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "registered_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."event_registrations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "start_date" timestamp with time zone NOT NULL,
    "end_date" timestamp with time zone NOT NULL,
    "location" "text",
    "is_virtual" boolean DEFAULT false NOT NULL,
    "virtual_link" "text",
    "max_attendees" integer,
    "current_attendees" integer DEFAULT 0 NOT NULL,
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."focal_conversation_participants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "conversation_id" "uuid",
    "focal_point_id" "uuid",
    "user_id" "uuid",
    "joined_at" timestamp with time zone DEFAULT "now"(),
    "last_read_at" timestamp with time zone,
    "is_muted" boolean DEFAULT false
);


ALTER TABLE "public"."focal_conversation_participants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."focal_conversations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" "text" NOT NULL,
    "country_code" "text",
    "name" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid",
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "focal_conversations_type_check" CHECK (("type" = ANY (ARRAY['country_team'::"text", 'direct'::"text", 'group'::"text"])))
);


ALTER TABLE "public"."focal_conversations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."focal_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "conversation_id" "uuid",
    "sender_id" "uuid",
    "sender_user_id" "uuid",
    "content" "text" NOT NULL,
    "attachment_url" "text",
    "attachment_type" "text",
    "indicator_reference" "text",
    "is_system_message" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "edited_at" timestamp with time zone
);


ALTER TABLE "public"."focal_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."focal_point_invitations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "focal_point_id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "token" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "sent_at" timestamp with time zone DEFAULT "now"(),
    "expires_at" timestamp with time zone DEFAULT ("now"() + '30 days'::interval),
    "accepted_at" timestamp with time zone,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "focal_point_invitations_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'accepted'::"text", 'expired'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."focal_point_invitations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."focal_points" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "country_code" "text" NOT NULL,
    "designation_type" "text" NOT NULL,
    "designated_by" "text",
    "designation_document_url" "text",
    "designation_date" "date" DEFAULT CURRENT_DATE,
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "phone" "text",
    "whatsapp_number" "text",
    "organization" "text",
    "job_title" "text",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "invitation_token" "uuid" DEFAULT "gen_random_uuid"(),
    "invitation_sent_at" timestamp with time zone,
    "invitation_expires_at" timestamp with time zone,
    "activated_at" timestamp with time zone,
    "expires_at" timestamp with time zone,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid",
    CONSTRAINT "focal_points_designation_type_check" CHECK (("designation_type" = ANY (ARRAY['primary'::"text", 'secondary'::"text"]))),
    CONSTRAINT "focal_points_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'invited'::"text", 'active'::"text", 'suspended'::"text", 'revoked'::"text"])))
);


ALTER TABLE "public"."focal_points" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."forum_categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "color" "text" DEFAULT '#3B82F6'::"text",
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."forum_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."forum_posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "category_id" "uuid" NOT NULL,
    "author_id" "uuid" NOT NULL,
    "is_pinned" boolean DEFAULT false NOT NULL,
    "is_locked" boolean DEFAULT false NOT NULL,
    "view_count" integer DEFAULT 0 NOT NULL,
    "reply_count" integer DEFAULT 0 NOT NULL,
    "last_reply_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."forum_posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."forum_replies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "content" "text" NOT NULL,
    "post_id" "uuid" NOT NULL,
    "author_id" "uuid" NOT NULL,
    "parent_reply_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."forum_replies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."homepage_content_blocks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "block_key" "text" NOT NULL,
    "content_fr" "jsonb" DEFAULT '{}'::"jsonb",
    "content_en" "jsonb" DEFAULT '{}'::"jsonb",
    "content_ar" "jsonb" DEFAULT '{}'::"jsonb",
    "content_pt" "jsonb" DEFAULT '{}'::"jsonb",
    "is_visible" boolean DEFAULT true,
    "sort_order" integer DEFAULT 0,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid"
);


ALTER TABLE "public"."homepage_content_blocks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."indicator_definitions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "unit" "text",
    "category" "text",
    "data_type" "text" DEFAULT 'numeric'::"text",
    "calculation_method" "text",
    "source_organization" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."indicator_definitions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."indicator_submissions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "country_code" "text" NOT NULL,
    "indicator_code" "text" NOT NULL,
    "year" integer NOT NULL,
    "quarter" integer,
    "submitted_value" numeric,
    "value_text" "text",
    "unit" "text",
    "data_source" "text",
    "methodology_notes" "text",
    "submitted_by" "uuid" NOT NULL,
    "status" "text" DEFAULT 'draft'::"text" NOT NULL,
    "validated_by" "uuid",
    "validation_date" timestamp with time zone,
    "validation_notes" "text",
    "rejected_reason" "text",
    "published_at" timestamp with time zone,
    "published_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "indicator_submissions_quarter_check" CHECK (("quarter" = ANY (ARRAY[1, 2, 3, 4]))),
    CONSTRAINT "indicator_submissions_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'submitted'::"text", 'validated'::"text", 'rejected'::"text", 'published'::"text"])))
);


ALTER TABLE "public"."indicator_submissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."indicator_translations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "indicator_code" "text" NOT NULL,
    "language_code" "text" NOT NULL,
    "display_name" "text" NOT NULL,
    "description" "text",
    "category_name" "text",
    "unit_display" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."indicator_translations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."languages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "name" "text" NOT NULL,
    "native_name" "text" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "is_default" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."languages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."network_security_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "event_type" "text" NOT NULL,
    "severity" "text" NOT NULL,
    "source_ip" "inet",
    "target_ip" "inet",
    "description" "text" NOT NULL,
    "details" "jsonb",
    "blocked" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "resolved" boolean DEFAULT false,
    "resolved_at" timestamp with time zone,
    CONSTRAINT "network_security_events_event_type_check" CHECK (("event_type" = ANY (ARRAY['intrusion_attempt'::"text", 'ddos_attack'::"text", 'malware_detected'::"text", 'suspicious_traffic'::"text", 'firewall_breach'::"text"]))),
    CONSTRAINT "network_security_events_severity_check" CHECK (("severity" = ANY (ARRAY['low'::"text", 'medium'::"text", 'high'::"text", 'critical'::"text"])))
);


ALTER TABLE "public"."network_security_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "message" "text" NOT NULL,
    "type" "text" DEFAULT 'info'::"text" NOT NULL,
    "is_read" boolean DEFAULT false NOT NULL,
    "action_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."presentation_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "session_id" "text" NOT NULL,
    "started_at" timestamp with time zone DEFAULT "now"(),
    "ended_at" timestamp with time zone,
    "total_duration" integer,
    "user_agent" "text",
    "country" "text",
    "sections_visited" integer[],
    "section_durations" "jsonb",
    "interactions" "jsonb",
    "completed" boolean DEFAULT false,
    "completion_rate" numeric(5,2),
    "device_type" "text",
    "screen_resolution" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."presentation_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "email" "text",
    "role" "public"."user_role" DEFAULT 'lecteur'::"public"."user_role" NOT NULL,
    "country" "text",
    "organization" "text",
    "avatar_url" "text",
    "bio" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."security_preferences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "two_factor_enabled" boolean DEFAULT false,
    "two_factor_secret" "text",
    "backup_codes" "text"[],
    "login_notifications" boolean DEFAULT true,
    "security_alerts" boolean DEFAULT true,
    "session_timeout" integer DEFAULT 7200,
    "max_concurrent_sessions" integer DEFAULT 3,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "e2e_encryption_enabled" boolean DEFAULT false
);


ALTER TABLE "public"."security_preferences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."submissions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "content" "text",
    "status" "public"."submission_status" DEFAULT 'brouillon'::"public"."submission_status" NOT NULL,
    "submitted_by" "uuid" NOT NULL,
    "reviewed_by" "uuid",
    "review_notes" "text",
    "attachments" "jsonb" DEFAULT '[]'::"jsonb",
    "submitted_at" timestamp with time zone,
    "reviewed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."submissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sync_conflicts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "agency_id" "uuid" NOT NULL,
    "table_name" "text" NOT NULL,
    "record_id" "uuid" NOT NULL,
    "source_data" "jsonb" NOT NULL,
    "target_data" "jsonb" NOT NULL,
    "conflict_type" "text" NOT NULL,
    "resolution_strategy" "text",
    "resolved_data" "jsonb",
    "resolved_at" timestamp with time zone,
    "resolved_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "is_resolved" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."sync_conflicts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sync_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "agency_id" "uuid" NOT NULL,
    "connector_id" "uuid",
    "sync_type" "text" NOT NULL,
    "status" "text" NOT NULL,
    "records_processed" integer DEFAULT 0,
    "records_created" integer DEFAULT 0,
    "records_updated" integer DEFAULT 0,
    "records_failed" integer DEFAULT 0,
    "error_details" "jsonb",
    "duration_ms" integer,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "completed_at" timestamp with time zone,
    CONSTRAINT "sync_logs_status_check" CHECK (("status" = ANY (ARRAY['started'::"text", 'completed'::"text", 'failed'::"text", 'partial'::"text"]))),
    CONSTRAINT "sync_logs_sync_type_check" CHECK (("sync_type" = ANY (ARRAY['full'::"text", 'incremental'::"text", 'manual'::"text"])))
);


ALTER TABLE "public"."sync_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sync_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "agency_id" "uuid" NOT NULL,
    "connector_id" "uuid" NOT NULL,
    "session_type" "text" DEFAULT 'bidirectional'::"text" NOT NULL,
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "ended_at" timestamp with time zone,
    "records_processed" integer DEFAULT 0,
    "conflicts_detected" integer DEFAULT 0,
    "websocket_id" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb"
);


ALTER TABLE "public"."sync_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sync_workflows" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "agency_id" "uuid" NOT NULL,
    "workflow_name" "text" NOT NULL,
    "description" "text",
    "steps" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "conditions" "jsonb" DEFAULT '{}'::"jsonb",
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid"
);


ALTER TABLE "public"."sync_workflows" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."translation_namespaces" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."translation_namespaces" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."translations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "language_id" "uuid" NOT NULL,
    "namespace_id" "uuid" NOT NULL,
    "key" "text" NOT NULL,
    "value" "text" NOT NULL,
    "context" "text",
    "version" integer DEFAULT 1 NOT NULL,
    "is_approved" boolean DEFAULT false NOT NULL,
    "created_by" "uuid",
    "approved_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."translations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."universal_service_indicators" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "indicator_code" "text" NOT NULL,
    "indicator_name" "text" NOT NULL,
    "value" numeric,
    "unit" "text",
    "country_code" "text",
    "region" "text",
    "year" integer NOT NULL,
    "quarter" integer,
    "data_source" "text" NOT NULL,
    "source_url" "text",
    "last_updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb"
);


ALTER TABLE "public"."universal_service_indicators" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_preferences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "preferences" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user_preferences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "session_token" "text" NOT NULL,
    "ip_address" "inet",
    "user_agent" "text",
    "location" "text",
    "is_active" boolean DEFAULT true,
    "last_activity" timestamp with time zone DEFAULT "now"(),
    "expires_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."webauthn_credentials" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "credential_id" "text" NOT NULL,
    "public_key" "text" NOT NULL,
    "name" "text" NOT NULL,
    "device_type" "text" DEFAULT 'security_key'::"text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_used" timestamp with time zone,
    "is_active" boolean DEFAULT true,
    CONSTRAINT "webauthn_credentials_device_type_check" CHECK (("device_type" = ANY (ARRAY['biometric'::"text", 'security_key'::"text", 'platform'::"text"])))
);


ALTER TABLE "public"."webauthn_credentials" OWNER TO "postgres";


ALTER TABLE ONLY "public"."agencies"
    ADD CONSTRAINT "agencies_acronym_key" UNIQUE ("acronym");



ALTER TABLE ONLY "public"."agencies"
    ADD CONSTRAINT "agencies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."agency_connectors"
    ADD CONSTRAINT "agency_connectors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."agency_projects"
    ADD CONSTRAINT "agency_projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."agency_resource_comments"
    ADD CONSTRAINT "agency_resource_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."agency_resource_versions"
    ADD CONSTRAINT "agency_resource_versions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."agency_resources"
    ADD CONSTRAINT "agency_resources_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."anomaly_alerts"
    ADD CONSTRAINT "anomaly_alerts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."anomaly_settings"
    ADD CONSTRAINT "anomaly_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."anomaly_settings"
    ADD CONSTRAINT "anomaly_settings_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."compliance_reports"
    ADD CONSTRAINT "compliance_reports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."countries"
    ADD CONSTRAINT "countries_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."countries"
    ADD CONSTRAINT "countries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."data_sources"
    ADD CONSTRAINT "data_sources_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."data_versions"
    ADD CONSTRAINT "data_versions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."document_comments"
    ADD CONSTRAINT "document_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."document_versions"
    ADD CONSTRAINT "document_versions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."encryption_keys"
    ADD CONSTRAINT "encryption_keys_key_id_key" UNIQUE ("key_id");



ALTER TABLE ONLY "public"."encryption_keys"
    ADD CONSTRAINT "encryption_keys_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_registrations"
    ADD CONSTRAINT "event_registrations_event_id_user_id_key" UNIQUE ("event_id", "user_id");



ALTER TABLE ONLY "public"."event_registrations"
    ADD CONSTRAINT "event_registrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."focal_conversation_participants"
    ADD CONSTRAINT "focal_conversation_participan_conversation_id_focal_point_i_key" UNIQUE ("conversation_id", "focal_point_id");



ALTER TABLE ONLY "public"."focal_conversation_participants"
    ADD CONSTRAINT "focal_conversation_participants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."focal_conversations"
    ADD CONSTRAINT "focal_conversations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."focal_messages"
    ADD CONSTRAINT "focal_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."focal_point_invitations"
    ADD CONSTRAINT "focal_point_invitations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."focal_point_invitations"
    ADD CONSTRAINT "focal_point_invitations_token_key" UNIQUE ("token");



ALTER TABLE ONLY "public"."focal_points"
    ADD CONSTRAINT "focal_points_country_code_designation_type_key" UNIQUE ("country_code", "designation_type");



ALTER TABLE ONLY "public"."focal_points"
    ADD CONSTRAINT "focal_points_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."focal_points"
    ADD CONSTRAINT "focal_points_invitation_token_key" UNIQUE ("invitation_token");



ALTER TABLE ONLY "public"."focal_points"
    ADD CONSTRAINT "focal_points_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."forum_categories"
    ADD CONSTRAINT "forum_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."forum_posts"
    ADD CONSTRAINT "forum_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."forum_replies"
    ADD CONSTRAINT "forum_replies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."homepage_content_blocks"
    ADD CONSTRAINT "homepage_content_blocks_block_key_key" UNIQUE ("block_key");



ALTER TABLE ONLY "public"."homepage_content_blocks"
    ADD CONSTRAINT "homepage_content_blocks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."indicator_definitions"
    ADD CONSTRAINT "indicator_definitions_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."indicator_definitions"
    ADD CONSTRAINT "indicator_definitions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."indicator_submissions"
    ADD CONSTRAINT "indicator_submissions_country_code_indicator_code_year_quar_key" UNIQUE ("country_code", "indicator_code", "year", "quarter");



ALTER TABLE ONLY "public"."indicator_submissions"
    ADD CONSTRAINT "indicator_submissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."indicator_translations"
    ADD CONSTRAINT "indicator_translations_indicator_code_language_code_key" UNIQUE ("indicator_code", "language_code");



ALTER TABLE ONLY "public"."indicator_translations"
    ADD CONSTRAINT "indicator_translations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."languages"
    ADD CONSTRAINT "languages_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."languages"
    ADD CONSTRAINT "languages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."network_security_events"
    ADD CONSTRAINT "network_security_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."presentation_sessions"
    ADD CONSTRAINT "presentation_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."presentation_sessions"
    ADD CONSTRAINT "presentation_sessions_session_id_key" UNIQUE ("session_id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."security_preferences"
    ADD CONSTRAINT "security_preferences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."security_preferences"
    ADD CONSTRAINT "security_preferences_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."submissions"
    ADD CONSTRAINT "submissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sync_conflicts"
    ADD CONSTRAINT "sync_conflicts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sync_logs"
    ADD CONSTRAINT "sync_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sync_sessions"
    ADD CONSTRAINT "sync_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sync_workflows"
    ADD CONSTRAINT "sync_workflows_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."translation_namespaces"
    ADD CONSTRAINT "translation_namespaces_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."translation_namespaces"
    ADD CONSTRAINT "translation_namespaces_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."translations"
    ADD CONSTRAINT "translations_language_id_namespace_id_key_key" UNIQUE ("language_id", "namespace_id", "key");



ALTER TABLE ONLY "public"."translations"
    ADD CONSTRAINT "translations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."universal_service_indicators"
    ADD CONSTRAINT "universal_service_indicators_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_preferences"
    ADD CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_preferences"
    ADD CONSTRAINT "user_preferences_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."user_sessions"
    ADD CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_sessions"
    ADD CONSTRAINT "user_sessions_session_token_key" UNIQUE ("session_token");



ALTER TABLE ONLY "public"."webauthn_credentials"
    ADD CONSTRAINT "webauthn_credentials_credential_id_key" UNIQUE ("credential_id");



ALTER TABLE ONLY "public"."webauthn_credentials"
    ADD CONSTRAINT "webauthn_credentials_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_agencies_active" ON "public"."agencies" USING "btree" ("is_active");



CREATE INDEX "idx_agencies_country" ON "public"."agencies" USING "btree" ("country");



CREATE INDEX "idx_agencies_region" ON "public"."agencies" USING "btree" ("region");



CREATE INDEX "idx_agency_connectors_agency_id" ON "public"."agency_connectors" USING "btree" ("agency_id");



CREATE INDEX "idx_agency_connectors_type" ON "public"."agency_connectors" USING "btree" ("connector_type");



CREATE INDEX "idx_agency_projects_agency_id" ON "public"."agency_projects" USING "btree" ("agency_id");



CREATE INDEX "idx_agency_projects_location" ON "public"."agency_projects" USING "gist" ("coordinates");



CREATE INDEX "idx_agency_projects_status" ON "public"."agency_projects" USING "btree" ("status");



CREATE INDEX "idx_agency_resource_comments_resource_id" ON "public"."agency_resource_comments" USING "btree" ("resource_id");



CREATE INDEX "idx_agency_resource_versions_resource_id" ON "public"."agency_resource_versions" USING "btree" ("resource_id");



CREATE INDEX "idx_agency_resources_access_level" ON "public"."agency_resources" USING "btree" ("access_level");



CREATE INDEX "idx_agency_resources_agency_id" ON "public"."agency_resources" USING "btree" ("agency_id");



CREATE INDEX "idx_agency_resources_type" ON "public"."agency_resources" USING "btree" ("resource_type");



CREATE INDEX "idx_anomaly_alerts_resolved" ON "public"."anomaly_alerts" USING "btree" ("resolved", "user_id");



CREATE INDEX "idx_anomaly_alerts_type_severity" ON "public"."anomaly_alerts" USING "btree" ("type", "severity");



CREATE INDEX "idx_anomaly_alerts_user_id_created" ON "public"."anomaly_alerts" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "idx_audit_logs_action_type" ON "public"."audit_logs" USING "btree" ("action_type");



CREATE INDEX "idx_audit_logs_user_id_created_at" ON "public"."audit_logs" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "idx_compliance_reports_scheduled" ON "public"."compliance_reports" USING "btree" ("scheduled_for") WHERE ("scheduled_for" IS NOT NULL);



CREATE INDEX "idx_compliance_reports_type_status" ON "public"."compliance_reports" USING "btree" ("report_type", "status");



CREATE INDEX "idx_countries_official_language" ON "public"."countries" USING "btree" ("official_language");



CREATE INDEX "idx_countries_sutel_community" ON "public"."countries" USING "btree" ("sutel_community");



CREATE INDEX "idx_data_versions_created_at" ON "public"."data_versions" USING "btree" ("created_at");



CREATE INDEX "idx_data_versions_table_record" ON "public"."data_versions" USING "btree" ("table_name", "record_id");



CREATE INDEX "idx_document_comments_created_at" ON "public"."document_comments" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_document_comments_document_id" ON "public"."document_comments" USING "btree" ("document_id");



CREATE INDEX "idx_document_versions_document_id" ON "public"."document_versions" USING "btree" ("document_id");



CREATE INDEX "idx_document_versions_uploaded_at" ON "public"."document_versions" USING "btree" ("uploaded_at" DESC);



CREATE INDEX "idx_documents_country" ON "public"."documents" USING "btree" ("country");



CREATE INDEX "idx_documents_type" ON "public"."documents" USING "btree" ("document_type");



CREATE INDEX "idx_documents_uploaded_by" ON "public"."documents" USING "btree" ("uploaded_by");



CREATE INDEX "idx_encryption_keys_active" ON "public"."encryption_keys" USING "btree" ("is_active", "user_id");



CREATE INDEX "idx_encryption_keys_user_id" ON "public"."encryption_keys" USING "btree" ("user_id");



CREATE INDEX "idx_events_start_date" ON "public"."events" USING "btree" ("start_date");



CREATE INDEX "idx_focal_conversations_country" ON "public"."focal_conversations" USING "btree" ("country_code") WHERE ("country_code" IS NOT NULL);



CREATE INDEX "idx_focal_messages_conversation" ON "public"."focal_messages" USING "btree" ("conversation_id", "created_at" DESC);



CREATE INDEX "idx_focal_participants_focal" ON "public"."focal_conversation_participants" USING "btree" ("focal_point_id");



CREATE INDEX "idx_focal_participants_user" ON "public"."focal_conversation_participants" USING "btree" ("user_id");



CREATE INDEX "idx_focal_points_country" ON "public"."focal_points" USING "btree" ("country_code");



CREATE INDEX "idx_focal_points_invitation_token" ON "public"."focal_points" USING "btree" ("invitation_token");



CREATE INDEX "idx_focal_points_status" ON "public"."focal_points" USING "btree" ("status");



CREATE INDEX "idx_focal_points_user" ON "public"."focal_points" USING "btree" ("user_id");



CREATE INDEX "idx_forum_posts_author" ON "public"."forum_posts" USING "btree" ("author_id");



CREATE INDEX "idx_forum_posts_category" ON "public"."forum_posts" USING "btree" ("category_id");



CREATE INDEX "idx_forum_replies_author" ON "public"."forum_replies" USING "btree" ("author_id");



CREATE INDEX "idx_forum_replies_post" ON "public"."forum_replies" USING "btree" ("post_id");



CREATE INDEX "idx_indicator_submissions_country_year" ON "public"."indicator_submissions" USING "btree" ("country_code", "year");



CREATE INDEX "idx_indicator_submissions_status" ON "public"."indicator_submissions" USING "btree" ("status");



CREATE INDEX "idx_indicator_submissions_submitted_by" ON "public"."indicator_submissions" USING "btree" ("submitted_by");



CREATE INDEX "idx_indicators_code_year" ON "public"."universal_service_indicators" USING "btree" ("indicator_code", "year");



CREATE INDEX "idx_indicators_country_year" ON "public"."universal_service_indicators" USING "btree" ("country_code", "year");



CREATE INDEX "idx_indicators_region" ON "public"."universal_service_indicators" USING "btree" ("region");



CREATE INDEX "idx_indicators_source" ON "public"."universal_service_indicators" USING "btree" ("data_source");



CREATE INDEX "idx_network_events_created" ON "public"."network_security_events" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_network_events_type_severity" ON "public"."network_security_events" USING "btree" ("event_type", "severity");



CREATE INDEX "idx_notifications_is_read" ON "public"."notifications" USING "btree" ("is_read");



CREATE INDEX "idx_notifications_user_id" ON "public"."notifications" USING "btree" ("user_id");



CREATE INDEX "idx_profiles_role" ON "public"."profiles" USING "btree" ("role");



CREATE INDEX "idx_profiles_user_id" ON "public"."profiles" USING "btree" ("user_id");



CREATE INDEX "idx_sessions_completed" ON "public"."presentation_sessions" USING "btree" ("completed");



CREATE INDEX "idx_sessions_date" ON "public"."presentation_sessions" USING "btree" ("started_at");



CREATE INDEX "idx_sessions_session_id" ON "public"."presentation_sessions" USING "btree" ("session_id");



CREATE INDEX "idx_submissions_status" ON "public"."submissions" USING "btree" ("status");



CREATE INDEX "idx_submissions_submitted_by" ON "public"."submissions" USING "btree" ("submitted_by");



CREATE INDEX "idx_sync_conflicts_agency_unresolved" ON "public"."sync_conflicts" USING "btree" ("agency_id", "is_resolved");



CREATE INDEX "idx_sync_logs_agency_id" ON "public"."sync_logs" USING "btree" ("agency_id");



CREATE INDEX "idx_sync_logs_started_at" ON "public"."sync_logs" USING "btree" ("started_at" DESC);



CREATE INDEX "idx_sync_sessions_agency_status" ON "public"."sync_sessions" USING "btree" ("agency_id", "status");



CREATE INDEX "idx_sync_workflows_agency_active" ON "public"."sync_workflows" USING "btree" ("agency_id", "is_active");



CREATE INDEX "idx_translations_approved" ON "public"."translations" USING "btree" ("is_approved");



CREATE INDEX "idx_translations_key" ON "public"."translations" USING "btree" ("key");



CREATE INDEX "idx_translations_language_namespace" ON "public"."translations" USING "btree" ("language_id", "namespace_id");



CREATE INDEX "idx_user_sessions_expires_at" ON "public"."user_sessions" USING "btree" ("expires_at");



CREATE INDEX "idx_user_sessions_user_id_active" ON "public"."user_sessions" USING "btree" ("user_id", "is_active");



CREATE INDEX "idx_webauthn_user_active" ON "public"."webauthn_credentials" USING "btree" ("user_id", "is_active");



CREATE OR REPLACE TRIGGER "audit_role_changes" AFTER UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."audit_role_change"();



CREATE OR REPLACE TRIGGER "trigger_create_country_team_conversation" AFTER INSERT OR UPDATE ON "public"."focal_points" FOR EACH ROW EXECUTE FUNCTION "public"."create_country_team_conversation"();



CREATE OR REPLACE TRIGGER "update_agencies_updated_at" BEFORE UPDATE ON "public"."agencies" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_agency_connectors_updated_at" BEFORE UPDATE ON "public"."agency_connectors" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_agency_projects_updated_at" BEFORE UPDATE ON "public"."agency_projects" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_agency_resources_updated_at" BEFORE UPDATE ON "public"."agency_resources" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_anomaly_settings_updated_at" BEFORE UPDATE ON "public"."anomaly_settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_countries_updated_at" BEFORE UPDATE ON "public"."countries" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_documents_updated_at" BEFORE UPDATE ON "public"."documents" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_event_attendee_count" AFTER INSERT OR DELETE ON "public"."event_registrations" FOR EACH ROW EXECUTE FUNCTION "public"."update_event_attendee_count"();



CREATE OR REPLACE TRIGGER "update_events_updated_at" BEFORE UPDATE ON "public"."events" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_focal_conversations_updated_at" BEFORE UPDATE ON "public"."focal_conversations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_focal_points_updated_at" BEFORE UPDATE ON "public"."focal_points" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_forum_post_reply_count" AFTER INSERT OR DELETE ON "public"."forum_replies" FOR EACH ROW EXECUTE FUNCTION "public"."update_post_reply_count"();



CREATE OR REPLACE TRIGGER "update_forum_posts_updated_at" BEFORE UPDATE ON "public"."forum_posts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_forum_replies_updated_at" BEFORE UPDATE ON "public"."forum_replies" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_homepage_content_blocks_updated_at" BEFORE UPDATE ON "public"."homepage_content_blocks" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_indicator_submissions_updated_at" BEFORE UPDATE ON "public"."indicator_submissions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_indicator_translations_updated_at" BEFORE UPDATE ON "public"."indicator_translations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_languages_updated_at" BEFORE UPDATE ON "public"."languages" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_namespaces_updated_at" BEFORE UPDATE ON "public"."translation_namespaces" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_security_preferences_updated_at" BEFORE UPDATE ON "public"."security_preferences" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_submissions_updated_at" BEFORE UPDATE ON "public"."submissions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_sync_workflows_updated_at" BEFORE UPDATE ON "public"."sync_workflows" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_translations_updated_at" BEFORE UPDATE ON "public"."translations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_preferences_updated_at" BEFORE UPDATE ON "public"."user_preferences" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_sessions_updated_at" BEFORE UPDATE ON "public"."user_sessions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."agency_connectors"
    ADD CONSTRAINT "agency_connectors_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."agency_projects"
    ADD CONSTRAINT "agency_projects_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."agency_resource_comments"
    ADD CONSTRAINT "agency_resource_comments_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."agency_resources"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."agency_resource_comments"
    ADD CONSTRAINT "agency_resource_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."agency_resource_versions"
    ADD CONSTRAINT "agency_resource_versions_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."agency_resources"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."agency_resource_versions"
    ADD CONSTRAINT "agency_resource_versions_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."agency_resources"
    ADD CONSTRAINT "agency_resources_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."agency_resources"
    ADD CONSTRAINT "agency_resources_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."anomaly_alerts"
    ADD CONSTRAINT "anomaly_alerts_resolved_by_fkey" FOREIGN KEY ("resolved_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."anomaly_alerts"
    ADD CONSTRAINT "anomaly_alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."anomaly_settings"
    ADD CONSTRAINT "anomaly_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."compliance_reports"
    ADD CONSTRAINT "compliance_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."data_versions"
    ADD CONSTRAINT "data_versions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."document_comments"
    ADD CONSTRAINT "document_comments_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."document_versions"
    ADD CONSTRAINT "document_versions_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."encryption_keys"
    ADD CONSTRAINT "encryption_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_registrations"
    ADD CONSTRAINT "event_registrations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_registrations"
    ADD CONSTRAINT "event_registrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."focal_conversation_participants"
    ADD CONSTRAINT "focal_conversation_participants_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."focal_conversations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."focal_conversation_participants"
    ADD CONSTRAINT "focal_conversation_participants_focal_point_id_fkey" FOREIGN KEY ("focal_point_id") REFERENCES "public"."focal_points"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."focal_conversation_participants"
    ADD CONSTRAINT "focal_conversation_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."focal_conversations"
    ADD CONSTRAINT "focal_conversations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."focal_messages"
    ADD CONSTRAINT "focal_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."focal_conversations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."focal_messages"
    ADD CONSTRAINT "focal_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."focal_points"("id");



ALTER TABLE ONLY "public"."focal_messages"
    ADD CONSTRAINT "focal_messages_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."focal_point_invitations"
    ADD CONSTRAINT "focal_point_invitations_focal_point_id_fkey" FOREIGN KEY ("focal_point_id") REFERENCES "public"."focal_points"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."focal_points"
    ADD CONSTRAINT "focal_points_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."focal_points"
    ADD CONSTRAINT "focal_points_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."forum_categories"
    ADD CONSTRAINT "forum_categories_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."forum_posts"
    ADD CONSTRAINT "forum_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."forum_posts"
    ADD CONSTRAINT "forum_posts_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."forum_categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."forum_replies"
    ADD CONSTRAINT "forum_replies_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."forum_replies"
    ADD CONSTRAINT "forum_replies_parent_reply_id_fkey" FOREIGN KEY ("parent_reply_id") REFERENCES "public"."forum_replies"("id");



ALTER TABLE ONLY "public"."forum_replies"
    ADD CONSTRAINT "forum_replies_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."forum_posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."homepage_content_blocks"
    ADD CONSTRAINT "homepage_content_blocks_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."indicator_submissions"
    ADD CONSTRAINT "indicator_submissions_published_by_fkey" FOREIGN KEY ("published_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."indicator_submissions"
    ADD CONSTRAINT "indicator_submissions_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."indicator_submissions"
    ADD CONSTRAINT "indicator_submissions_validated_by_fkey" FOREIGN KEY ("validated_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."network_security_events"
    ADD CONSTRAINT "network_security_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."security_preferences"
    ADD CONSTRAINT "security_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."submissions"
    ADD CONSTRAINT "submissions_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."submissions"
    ADD CONSTRAINT "submissions_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."sync_conflicts"
    ADD CONSTRAINT "sync_conflicts_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id");



ALTER TABLE ONLY "public"."sync_conflicts"
    ADD CONSTRAINT "sync_conflicts_resolved_by_fkey" FOREIGN KEY ("resolved_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."sync_logs"
    ADD CONSTRAINT "sync_logs_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sync_logs"
    ADD CONSTRAINT "sync_logs_connector_id_fkey" FOREIGN KEY ("connector_id") REFERENCES "public"."agency_connectors"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."sync_sessions"
    ADD CONSTRAINT "sync_sessions_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id");



ALTER TABLE ONLY "public"."sync_sessions"
    ADD CONSTRAINT "sync_sessions_connector_id_fkey" FOREIGN KEY ("connector_id") REFERENCES "public"."agency_connectors"("id");



ALTER TABLE ONLY "public"."sync_workflows"
    ADD CONSTRAINT "sync_workflows_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id");



ALTER TABLE ONLY "public"."sync_workflows"
    ADD CONSTRAINT "sync_workflows_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."translations"
    ADD CONSTRAINT "translations_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."translations"
    ADD CONSTRAINT "translations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."translations"
    ADD CONSTRAINT "translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."translations"
    ADD CONSTRAINT "translations_namespace_id_fkey" FOREIGN KEY ("namespace_id") REFERENCES "public"."translation_namespaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_preferences"
    ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_sessions"
    ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."webauthn_credentials"
    ADD CONSTRAINT "webauthn_credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can delete any document" ON "public"."documents" FOR DELETE TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Admins can delete homepage blocks" ON "public"."homepage_content_blocks" FOR DELETE TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Admins can insert homepage blocks" ON "public"."homepage_content_blocks" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Admins can manage countries" ON "public"."countries" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Admins can manage focal points" ON "public"."focal_points" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Admins can manage indicator translations" ON "public"."indicator_translations" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Admins can manage invitations" ON "public"."focal_point_invitations" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Admins can manage languages" ON "public"."languages" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Admins can manage namespaces" ON "public"."translation_namespaces" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Admins can manage submissions" ON "public"."indicator_submissions" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Admins can manage translations" ON "public"."translations" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Admins can update any document" ON "public"."documents" FOR UPDATE TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Admins can update homepage blocks" ON "public"."homepage_content_blocks" FOR UPDATE TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Admins can view all translations" ON "public"."translations" FOR SELECT USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Anyone can read homepage blocks" ON "public"."homepage_content_blocks" FOR SELECT USING (true);



CREATE POLICY "Anyone can read invitation by token" ON "public"."focal_point_invitations" FOR SELECT USING (true);



CREATE POLICY "Anyone can read presentation sessions" ON "public"."presentation_sessions" FOR SELECT USING (true);



CREATE POLICY "Anyone can view approved translations" ON "public"."translations" FOR SELECT USING (("is_approved" = true));



CREATE POLICY "Anyone can view countries" ON "public"."countries" FOR SELECT USING (true);



CREATE POLICY "Anyone can view indicator translations" ON "public"."indicator_translations" FOR SELECT USING (true);



CREATE POLICY "Anyone can view languages" ON "public"."languages" FOR SELECT USING (true);



CREATE POLICY "Anyone can view namespaces" ON "public"."translation_namespaces" FOR SELECT USING (true);



CREATE POLICY "Anyone can view public documents" ON "public"."documents" FOR SELECT USING (("access_level" = 'public'::"text"));



CREATE POLICY "Authenticated admins can manage agencies" ON "public"."agencies" TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Authenticated admins can manage agency connectors" ON "public"."agency_connectors" TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Authenticated admins can manage agency projects" ON "public"."agency_projects" TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Authenticated admins can manage all posts" ON "public"."forum_posts" TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Authenticated admins can manage all replies" ON "public"."forum_replies" TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Authenticated admins can manage compliance reports" ON "public"."compliance_reports" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."user_id" = "auth"."uid"()) AND ("profiles"."role" = ANY (ARRAY['super_admin'::"public"."user_role", 'admin_pays'::"public"."user_role"]))))));



CREATE POLICY "Authenticated admins can manage data sources" ON "public"."data_sources" TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Authenticated admins can manage events" ON "public"."events" TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Authenticated admins can manage forum categories" ON "public"."forum_categories" TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Authenticated admins can manage indicator definitions" ON "public"."indicator_definitions" TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Authenticated admins can manage indicators" ON "public"."universal_service_indicators" TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Authenticated admins can manage network security events" ON "public"."network_security_events" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."user_id" = "auth"."uid"()) AND ("profiles"."role" = ANY (ARRAY['super_admin'::"public"."user_role", 'admin_pays'::"public"."user_role"]))))));



CREATE POLICY "Authenticated admins can manage sync conflicts" ON "public"."sync_conflicts" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Authenticated admins can manage sync sessions" ON "public"."sync_sessions" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Authenticated admins can manage sync workflows" ON "public"."sync_workflows" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Authenticated admins can update any profile" ON "public"."profiles" FOR UPDATE TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Authenticated admins can update any profile role" ON "public"."profiles" FOR UPDATE USING ("public"."is_admin"("auth"."uid"())) WITH CHECK ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Authenticated admins can view all anomaly alerts" ON "public"."anomaly_alerts" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."user_id" = "auth"."uid"()) AND ("profiles"."role" = ANY (ARRAY['super_admin'::"public"."user_role", 'admin_pays'::"public"."user_role"]))))));



CREATE POLICY "Authenticated admins can view all audit logs" ON "public"."audit_logs" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."user_id" = "auth"."uid"()) AND ("profiles"."role" = ANY (ARRAY['super_admin'::"public"."user_role", 'admin_pays'::"public"."user_role"]))))));



CREATE POLICY "Authenticated admins can view all compliance reports" ON "public"."compliance_reports" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."user_id" = "auth"."uid"()) AND ("profiles"."role" = ANY (ARRAY['super_admin'::"public"."user_role", 'admin_pays'::"public"."user_role"]))))));



CREATE POLICY "Authenticated admins can view all data versions" ON "public"."data_versions" FOR SELECT USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Authenticated admins can view all network security events" ON "public"."network_security_events" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."user_id" = "auth"."uid"()) AND ("profiles"."role" = ANY (ARRAY['super_admin'::"public"."user_role", 'admin_pays'::"public"."user_role"]))))));



CREATE POLICY "Authenticated admins can view all registrations" ON "public"."event_registrations" FOR SELECT TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Authenticated admins can view all submissions" ON "public"."submissions" FOR SELECT TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Authenticated admins can view sync logs" ON "public"."sync_logs" FOR SELECT TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));



CREATE POLICY "Authenticated reviewers can update assigned submissions" ON "public"."submissions" FOR UPDATE TO "authenticated" USING ((("auth"."uid"() = "reviewed_by") AND "public"."is_admin"("auth"."uid"())));



CREATE POLICY "Authenticated reviewers can view assigned submissions" ON "public"."submissions" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "reviewed_by"));



CREATE POLICY "Authenticated users can cancel their own registrations" ON "public"."event_registrations" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can comment" ON "public"."agency_resource_comments" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can create comments" ON "public"."document_comments" FOR INSERT WITH CHECK ((("auth"."uid"() IS NOT NULL) AND ("auth"."uid"() = "user_id")));



CREATE POLICY "Authenticated users can create document versions" ON "public"."document_versions" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Authenticated users can create notifications" ON "public"."notifications" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Authenticated users can create posts" ON "public"."forum_posts" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "author_id"));



CREATE POLICY "Authenticated users can create replies" ON "public"."forum_replies" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "author_id"));



CREATE POLICY "Authenticated users can create submissions" ON "public"."submissions" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "submitted_by"));



CREATE POLICY "Authenticated users can create their own preferences" ON "public"."user_preferences" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can create translations" ON "public"."translations" FOR INSERT WITH CHECK (("auth"."uid"() = "created_by"));



CREATE POLICY "Authenticated users can delete their own WebAuthn credentials" ON "public"."webauthn_credentials" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can delete their own encryption keys" ON "public"."encryption_keys" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can delete their own preferences" ON "public"."user_preferences" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can delete their own sessions" ON "public"."user_sessions" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can insert anomaly alerts" ON "public"."anomaly_alerts" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Authenticated users can insert audit logs" ON "public"."audit_logs" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Authenticated users can insert data versions" ON "public"."data_versions" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Authenticated users can insert network security events" ON "public"."network_security_events" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Authenticated users can insert presentation sessions" ON "public"."presentation_sessions" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Authenticated users can insert sessions" ON "public"."user_sessions" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can insert sync logs" ON "public"."sync_logs" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Authenticated users can insert their own WebAuthn credentials" ON "public"."webauthn_credentials" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can insert their own anomaly settings" ON "public"."anomaly_settings" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can insert their own encryption keys" ON "public"."encryption_keys" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can insert their own profile" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can insert their own security preferences" ON "public"."security_preferences" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can manage their own submissions" ON "public"."submissions" USING (("auth"."uid"() = "submitted_by"));



CREATE POLICY "Authenticated users can register for events" ON "public"."event_registrations" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can update sessions" ON "public"."presentation_sessions" FOR UPDATE USING (("auth"."uid"() IS NOT NULL)) WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Authenticated users can update their own WebAuthn credentials" ON "public"."webauthn_credentials" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can update their own anomaly alerts" ON "public"."anomaly_alerts" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can update their own anomaly settings" ON "public"."anomaly_settings" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can update their own encryption keys" ON "public"."encryption_keys" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can update their own notifications" ON "public"."notifications" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can update their own posts" ON "public"."forum_posts" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "author_id"));



CREATE POLICY "Authenticated users can update their own preferences" ON "public"."user_preferences" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can update their own profile data" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK ((("auth"."uid"() = "user_id") AND ("role" = ( SELECT "profiles_1"."role"
   FROM "public"."profiles" "profiles_1"
  WHERE ("profiles_1"."user_id" = "auth"."uid"())))));



CREATE POLICY "Authenticated users can update their own replies" ON "public"."forum_replies" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "author_id"));



CREATE POLICY "Authenticated users can update their own security preferences" ON "public"."security_preferences" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can update their own sessions" ON "public"."user_sessions" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can update their own submissions" ON "public"."submissions" FOR UPDATE TO "authenticated" USING ((("auth"."uid"() = "submitted_by") AND ("status" = 'brouillon'::"public"."submission_status")));



CREATE POLICY "Authenticated users can upload documents" ON "public"."documents" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "uploaded_by"));



CREATE POLICY "Authenticated users can view agencies" ON "public"."agencies" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view agency projects" ON "public"."agency_projects" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view all events" ON "public"."events" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can view all submissions for stats" ON "public"."submissions" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can view authenticated-level documents" ON "public"."documents" FOR SELECT TO "authenticated" USING (("access_level" = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can view data sources" ON "public"."data_sources" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view forum categories" ON "public"."forum_categories" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view forum posts" ON "public"."forum_posts" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view forum replies" ON "public"."forum_replies" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view indicator definitions" ON "public"."indicator_definitions" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view indicators" ON "public"."universal_service_indicators" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view their own WebAuthn credentials" ON "public"."webauthn_credentials" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can view their own anomaly alerts" ON "public"."anomaly_alerts" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can view their own anomaly settings" ON "public"."anomaly_settings" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can view their own audit logs" ON "public"."audit_logs" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can view their own compliance reports" ON "public"."compliance_reports" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can view their own encryption keys" ON "public"."encryption_keys" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can view their own notifications" ON "public"."notifications" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can view their own preferences" ON "public"."user_preferences" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can view their own registrations" ON "public"."event_registrations" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can view their own security preferences" ON "public"."security_preferences" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can view their own sessions" ON "public"."user_sessions" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Focal points can create conversations" ON "public"."focal_conversations" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."focal_points" "fp"
  WHERE (("fp"."user_id" = "auth"."uid"()) AND ("fp"."status" = 'active'::"text")))));



CREATE POLICY "Focal points can join conversations" ON "public"."focal_conversation_participants" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."focal_points" "fp"
  WHERE (("fp"."user_id" = "auth"."uid"()) AND ("fp"."status" = 'active'::"text")))));



CREATE POLICY "Focal points can manage own country submissions" ON "public"."indicator_submissions" USING ((EXISTS ( SELECT 1
   FROM "public"."focal_points" "fp"
  WHERE (("fp"."user_id" = "auth"."uid"()) AND ("fp"."country_code" = "indicator_submissions"."country_code") AND ("fp"."status" = 'active'::"text")))));



CREATE POLICY "Focal points can update own contact info" ON "public"."focal_points" FOR UPDATE USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Focal points can view own record" ON "public"."focal_points" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Focal points can view their conversations" ON "public"."focal_conversations" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."focal_conversation_participants" "fcp"
  WHERE (("fcp"."conversation_id" = "focal_conversations"."id") AND ("fcp"."user_id" = "auth"."uid"())))));



CREATE POLICY "Only focal points and admins can view focal points" ON "public"."focal_points" FOR SELECT TO "authenticated" USING ((("user_id" = "auth"."uid"()) OR "public"."is_admin"("auth"."uid"()) OR "public"."is_focal_point"("auth"."uid"())));



CREATE POLICY "Owners can delete their own documents" ON "public"."documents" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "uploaded_by"));



CREATE POLICY "Owners can update their own documents" ON "public"."documents" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "uploaded_by"));



CREATE POLICY "Owners can view their own documents" ON "public"."documents" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "uploaded_by"));



CREATE POLICY "Participants can send messages" ON "public"."focal_messages" FOR INSERT WITH CHECK ((("sender_user_id" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM "public"."focal_conversation_participants" "fcp"
  WHERE (("fcp"."conversation_id" = "focal_messages"."conversation_id") AND ("fcp"."user_id" = "auth"."uid"()))))));



CREATE POLICY "Participants can update their own participation" ON "public"."focal_conversation_participants" FOR UPDATE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Participants can view messages" ON "public"."focal_messages" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."focal_conversation_participants" "fcp"
  WHERE (("fcp"."conversation_id" = "focal_messages"."conversation_id") AND ("fcp"."user_id" = "auth"."uid"())))));



CREATE POLICY "Participants can view their conversation participants" ON "public"."focal_conversation_participants" FOR SELECT USING ((("user_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."focal_conversation_participants" "fcp2"
  WHERE (("fcp2"."conversation_id" = "focal_conversation_participants"."conversation_id") AND ("fcp2"."user_id" = "auth"."uid"()))))));



CREATE POLICY "Published submissions are public" ON "public"."indicator_submissions" FOR SELECT USING ((("status" = 'published'::"text") AND ("auth"."uid"() IS NOT NULL)));



CREATE POLICY "Senders can edit their messages" ON "public"."focal_messages" FOR UPDATE USING (("sender_user_id" = "auth"."uid"()));



CREATE POLICY "Users can create their own submissions" ON "public"."submissions" FOR INSERT WITH CHECK (("auth"."uid"() = "submitted_by"));



CREATE POLICY "Users can delete own comments" ON "public"."agency_resource_comments" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own comments" ON "public"."document_comments" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own comments" ON "public"."document_comments" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own submissions" ON "public"."submissions" FOR UPDATE USING (("auth"."uid"() = "submitted_by"));



CREATE POLICY "Users can view comments for public documents" ON "public"."document_comments" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."documents"
  WHERE (("documents"."id" = "document_comments"."document_id") AND ("documents"."is_public" = true)))));



CREATE POLICY "Users can view document versions for public documents" ON "public"."document_versions" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."documents"
  WHERE (("documents"."id" = "document_versions"."document_id") AND ("documents"."is_public" = true)))));



CREATE POLICY "Users can view their own submissions" ON "public"."submissions" FOR SELECT USING (("auth"."uid"() = "submitted_by"));



CREATE POLICY "Users with matching role can view restricted documents" ON "public"."documents" FOR SELECT TO "authenticated" USING ((("access_level" = 'restricted'::"text") AND (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."user_id" = "auth"."uid"()) AND (("profiles"."role")::"text" = ANY ("documents"."allowed_roles")))))));



CREATE POLICY "View agency resource comments" ON "public"."agency_resource_comments" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "View agency resource versions" ON "public"."agency_resource_versions" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "View authenticated agency resources" ON "public"."agency_resources" FOR SELECT TO "authenticated" USING (("access_level" = 'authenticated'::"text"));



CREATE POLICY "View public agency resources" ON "public"."agency_resources" FOR SELECT TO "authenticated" USING (("access_level" = 'public'::"text"));



CREATE POLICY "View role-restricted agency resources" ON "public"."agency_resources" FOR SELECT TO "authenticated" USING ((("access_level" = 'restricted'::"text") AND (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."user_id" = "auth"."uid"()) AND (("profiles"."role")::"text" = ANY ("agency_resources"."allowed_roles")))))));



ALTER TABLE "public"."agencies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."agency_connectors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."agency_projects" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."agency_resource_comments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."agency_resource_versions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."agency_resources" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."anomaly_alerts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."anomaly_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."audit_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."compliance_reports" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."countries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."data_sources" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."data_versions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."document_comments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."document_versions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."documents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."encryption_keys" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."event_registrations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."focal_conversation_participants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."focal_conversations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."focal_messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."focal_point_invitations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."focal_points" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."forum_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."forum_posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."forum_replies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."homepage_content_blocks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."indicator_definitions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."indicator_submissions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."indicator_translations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."languages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."network_security_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."presentation_sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."security_preferences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."submissions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sync_conflicts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sync_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sync_sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sync_workflows" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."translation_namespaces" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."translations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."universal_service_indicators" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_preferences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."webauthn_credentials" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";































































































































































GRANT ALL ON FUNCTION "public"."admin_update_user_role"("target_user_id" "uuid", "new_role" "public"."user_role") TO "anon";
GRANT ALL ON FUNCTION "public"."admin_update_user_role"("target_user_id" "uuid", "new_role" "public"."user_role") TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_update_user_role"("target_user_id" "uuid", "new_role" "public"."user_role") TO "service_role";



GRANT ALL ON FUNCTION "public"."audit_role_change"() TO "anon";
GRANT ALL ON FUNCTION "public"."audit_role_change"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."audit_role_change"() TO "service_role";



GRANT ALL ON FUNCTION "public"."calculate_transaction_fees"("transaction_amount" numeric, "payment_method_type" character varying, "transaction_type_param" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_transaction_fees"("transaction_amount" numeric, "payment_method_type" character varying, "transaction_type_param" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_transaction_fees"("transaction_amount" numeric, "payment_method_type" character varying, "transaction_type_param" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_expired_sessions"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_expired_sessions"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_expired_sessions"() TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_old_anomaly_alerts"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_old_anomaly_alerts"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_old_anomaly_alerts"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_country_team_conversation"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_country_team_conversation"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_country_team_conversation"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_payment_schedule"("recurring_payment_id" "uuid", "months_ahead" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."create_payment_schedule"("recurring_payment_id" "uuid", "months_ahead" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_payment_schedule"("recurring_payment_id" "uuid", "months_ahead" integer) TO "service_role";



GRANT ALL ON PROCEDURE "public"."detect_late_payments_25f323c4"() TO "anon";
GRANT ALL ON PROCEDURE "public"."detect_late_payments_25f323c4"() TO "authenticated";
GRANT ALL ON PROCEDURE "public"."detect_late_payments_25f323c4"() TO "service_role";



GRANT ALL ON PROCEDURE "public"."execute_recurring_payments_e84aeb13"() TO "anon";
GRANT ALL ON PROCEDURE "public"."execute_recurring_payments_e84aeb13"() TO "authenticated";
GRANT ALL ON PROCEDURE "public"."execute_recurring_payments_e84aeb13"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_anomaly_alert"("p_user_id" "uuid", "p_type" "text", "p_severity" "text", "p_message" "text", "p_details" "jsonb", "p_auto_block" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."generate_anomaly_alert"("p_user_id" "uuid", "p_type" "text", "p_severity" "text", "p_message" "text", "p_details" "jsonb", "p_auto_block" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_anomaly_alert"("p_user_id" "uuid", "p_type" "text", "p_severity" "text", "p_message" "text", "p_details" "jsonb", "p_auto_block" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_country_focal_points"("country" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_country_focal_points"("country" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_country_focal_points"("country" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_financial_summary"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_financial_summary"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_financial_summary"("user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_balance"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_balance"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_balance"("user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_role"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_role"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_role"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_role"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_role"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_role"("user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_security_status"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_security_status"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_security_status"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"("user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_focal_point"("user_id" "uuid", "country" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."is_focal_point"("user_id" "uuid", "country" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_focal_point"("user_id" "uuid", "country" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."log_security_event"("p_user_id" "uuid", "p_action_type" "text", "p_resource_type" "text", "p_resource_id" "text", "p_details" "jsonb", "p_ip_address" "inet", "p_user_agent" "text", "p_success" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."log_security_event"("p_user_id" "uuid", "p_action_type" "text", "p_resource_type" "text", "p_resource_id" "text", "p_details" "jsonb", "p_ip_address" "inet", "p_user_agent" "text", "p_success" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_security_event"("p_user_id" "uuid", "p_action_type" "text", "p_resource_type" "text", "p_resource_id" "text", "p_details" "jsonb", "p_ip_address" "inet", "p_user_agent" "text", "p_success" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."process_overdue_payments"() TO "anon";
GRANT ALL ON FUNCTION "public"."process_overdue_payments"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."process_overdue_payments"() TO "service_role";



GRANT ALL ON FUNCTION "public"."release_escrow_funds"("escrow_account_id" "uuid", "release_amount" numeric, "release_reason" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."release_escrow_funds"("escrow_account_id" "uuid", "release_amount" numeric, "release_reason" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."release_escrow_funds"("escrow_account_id" "uuid", "release_amount" numeric, "release_reason" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_event_attendee_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_event_attendee_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_event_attendee_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_post_reply_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_post_reply_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_post_reply_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_user_profiles_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_user_profiles_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_user_profiles_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."agencies" TO "anon";
GRANT ALL ON TABLE "public"."agencies" TO "authenticated";
GRANT ALL ON TABLE "public"."agencies" TO "service_role";



GRANT ALL ON TABLE "public"."agency_connectors" TO "anon";
GRANT ALL ON TABLE "public"."agency_connectors" TO "authenticated";
GRANT ALL ON TABLE "public"."agency_connectors" TO "service_role";



GRANT ALL ON TABLE "public"."agency_projects" TO "anon";
GRANT ALL ON TABLE "public"."agency_projects" TO "authenticated";
GRANT ALL ON TABLE "public"."agency_projects" TO "service_role";



GRANT ALL ON TABLE "public"."agency_resource_comments" TO "anon";
GRANT ALL ON TABLE "public"."agency_resource_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."agency_resource_comments" TO "service_role";



GRANT ALL ON TABLE "public"."agency_resource_versions" TO "anon";
GRANT ALL ON TABLE "public"."agency_resource_versions" TO "authenticated";
GRANT ALL ON TABLE "public"."agency_resource_versions" TO "service_role";



GRANT ALL ON TABLE "public"."agency_resources" TO "anon";
GRANT ALL ON TABLE "public"."agency_resources" TO "authenticated";
GRANT ALL ON TABLE "public"."agency_resources" TO "service_role";



GRANT ALL ON TABLE "public"."anomaly_alerts" TO "anon";
GRANT ALL ON TABLE "public"."anomaly_alerts" TO "authenticated";
GRANT ALL ON TABLE "public"."anomaly_alerts" TO "service_role";



GRANT ALL ON TABLE "public"."anomaly_settings" TO "anon";
GRANT ALL ON TABLE "public"."anomaly_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."anomaly_settings" TO "service_role";



GRANT ALL ON TABLE "public"."audit_logs" TO "anon";
GRANT ALL ON TABLE "public"."audit_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."audit_logs" TO "service_role";



GRANT ALL ON TABLE "public"."compliance_reports" TO "anon";
GRANT ALL ON TABLE "public"."compliance_reports" TO "authenticated";
GRANT ALL ON TABLE "public"."compliance_reports" TO "service_role";



GRANT ALL ON TABLE "public"."countries" TO "anon";
GRANT ALL ON TABLE "public"."countries" TO "authenticated";
GRANT ALL ON TABLE "public"."countries" TO "service_role";



GRANT ALL ON TABLE "public"."data_sources" TO "anon";
GRANT ALL ON TABLE "public"."data_sources" TO "authenticated";
GRANT ALL ON TABLE "public"."data_sources" TO "service_role";



GRANT ALL ON TABLE "public"."data_versions" TO "anon";
GRANT ALL ON TABLE "public"."data_versions" TO "authenticated";
GRANT ALL ON TABLE "public"."data_versions" TO "service_role";



GRANT ALL ON TABLE "public"."document_comments" TO "anon";
GRANT ALL ON TABLE "public"."document_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."document_comments" TO "service_role";



GRANT ALL ON TABLE "public"."document_versions" TO "anon";
GRANT ALL ON TABLE "public"."document_versions" TO "authenticated";
GRANT ALL ON TABLE "public"."document_versions" TO "service_role";



GRANT ALL ON TABLE "public"."documents" TO "anon";
GRANT ALL ON TABLE "public"."documents" TO "authenticated";
GRANT ALL ON TABLE "public"."documents" TO "service_role";



GRANT ALL ON TABLE "public"."encryption_keys" TO "anon";
GRANT ALL ON TABLE "public"."encryption_keys" TO "authenticated";
GRANT ALL ON TABLE "public"."encryption_keys" TO "service_role";



GRANT ALL ON TABLE "public"."event_registrations" TO "anon";
GRANT ALL ON TABLE "public"."event_registrations" TO "authenticated";
GRANT ALL ON TABLE "public"."event_registrations" TO "service_role";



GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";



GRANT ALL ON TABLE "public"."focal_conversation_participants" TO "anon";
GRANT ALL ON TABLE "public"."focal_conversation_participants" TO "authenticated";
GRANT ALL ON TABLE "public"."focal_conversation_participants" TO "service_role";



GRANT ALL ON TABLE "public"."focal_conversations" TO "anon";
GRANT ALL ON TABLE "public"."focal_conversations" TO "authenticated";
GRANT ALL ON TABLE "public"."focal_conversations" TO "service_role";



GRANT ALL ON TABLE "public"."focal_messages" TO "anon";
GRANT ALL ON TABLE "public"."focal_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."focal_messages" TO "service_role";



GRANT ALL ON TABLE "public"."focal_point_invitations" TO "anon";
GRANT ALL ON TABLE "public"."focal_point_invitations" TO "authenticated";
GRANT ALL ON TABLE "public"."focal_point_invitations" TO "service_role";



GRANT ALL ON TABLE "public"."focal_points" TO "anon";
GRANT ALL ON TABLE "public"."focal_points" TO "authenticated";
GRANT ALL ON TABLE "public"."focal_points" TO "service_role";



GRANT ALL ON TABLE "public"."forum_categories" TO "anon";
GRANT ALL ON TABLE "public"."forum_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."forum_categories" TO "service_role";



GRANT ALL ON TABLE "public"."forum_posts" TO "anon";
GRANT ALL ON TABLE "public"."forum_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."forum_posts" TO "service_role";



GRANT ALL ON TABLE "public"."forum_replies" TO "anon";
GRANT ALL ON TABLE "public"."forum_replies" TO "authenticated";
GRANT ALL ON TABLE "public"."forum_replies" TO "service_role";



GRANT ALL ON TABLE "public"."homepage_content_blocks" TO "anon";
GRANT ALL ON TABLE "public"."homepage_content_blocks" TO "authenticated";
GRANT ALL ON TABLE "public"."homepage_content_blocks" TO "service_role";



GRANT ALL ON TABLE "public"."indicator_definitions" TO "anon";
GRANT ALL ON TABLE "public"."indicator_definitions" TO "authenticated";
GRANT ALL ON TABLE "public"."indicator_definitions" TO "service_role";



GRANT ALL ON TABLE "public"."indicator_submissions" TO "anon";
GRANT ALL ON TABLE "public"."indicator_submissions" TO "authenticated";
GRANT ALL ON TABLE "public"."indicator_submissions" TO "service_role";



GRANT ALL ON TABLE "public"."indicator_translations" TO "anon";
GRANT ALL ON TABLE "public"."indicator_translations" TO "authenticated";
GRANT ALL ON TABLE "public"."indicator_translations" TO "service_role";



GRANT ALL ON TABLE "public"."languages" TO "anon";
GRANT ALL ON TABLE "public"."languages" TO "authenticated";
GRANT ALL ON TABLE "public"."languages" TO "service_role";



GRANT ALL ON TABLE "public"."network_security_events" TO "anon";
GRANT ALL ON TABLE "public"."network_security_events" TO "authenticated";
GRANT ALL ON TABLE "public"."network_security_events" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."presentation_sessions" TO "anon";
GRANT ALL ON TABLE "public"."presentation_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."presentation_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."security_preferences" TO "anon";
GRANT ALL ON TABLE "public"."security_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."security_preferences" TO "service_role";



GRANT ALL ON TABLE "public"."submissions" TO "anon";
GRANT ALL ON TABLE "public"."submissions" TO "authenticated";
GRANT ALL ON TABLE "public"."submissions" TO "service_role";



GRANT ALL ON TABLE "public"."sync_conflicts" TO "anon";
GRANT ALL ON TABLE "public"."sync_conflicts" TO "authenticated";
GRANT ALL ON TABLE "public"."sync_conflicts" TO "service_role";



GRANT ALL ON TABLE "public"."sync_logs" TO "anon";
GRANT ALL ON TABLE "public"."sync_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."sync_logs" TO "service_role";



GRANT ALL ON TABLE "public"."sync_sessions" TO "anon";
GRANT ALL ON TABLE "public"."sync_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."sync_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."sync_workflows" TO "anon";
GRANT ALL ON TABLE "public"."sync_workflows" TO "authenticated";
GRANT ALL ON TABLE "public"."sync_workflows" TO "service_role";



GRANT ALL ON TABLE "public"."translation_namespaces" TO "anon";
GRANT ALL ON TABLE "public"."translation_namespaces" TO "authenticated";
GRANT ALL ON TABLE "public"."translation_namespaces" TO "service_role";



GRANT ALL ON TABLE "public"."translations" TO "anon";
GRANT ALL ON TABLE "public"."translations" TO "authenticated";
GRANT ALL ON TABLE "public"."translations" TO "service_role";



GRANT ALL ON TABLE "public"."universal_service_indicators" TO "anon";
GRANT ALL ON TABLE "public"."universal_service_indicators" TO "authenticated";
GRANT ALL ON TABLE "public"."universal_service_indicators" TO "service_role";



GRANT ALL ON TABLE "public"."user_preferences" TO "anon";
GRANT ALL ON TABLE "public"."user_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."user_preferences" TO "service_role";



GRANT ALL ON TABLE "public"."user_sessions" TO "anon";
GRANT ALL ON TABLE "public"."user_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."user_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."webauthn_credentials" TO "anon";
GRANT ALL ON TABLE "public"."webauthn_credentials" TO "authenticated";
GRANT ALL ON TABLE "public"."webauthn_credentials" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";



































