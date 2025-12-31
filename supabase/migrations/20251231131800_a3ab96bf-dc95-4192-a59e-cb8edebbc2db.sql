-- Phase 5 Bis: Correction des procédures sans search_path

-- Correction de la procédure detect_late_payments
CREATE OR REPLACE PROCEDURE public.detect_late_payments_25f323c4()
LANGUAGE plpgsql
SET search_path TO ''
AS $procedure$
BEGIN
  PERFORM net.http_post(
    url:='https://wsbawdvqfbmtjtdtyddy.supabase.co/functions/v1/detect-late-payments',
    headers:=jsonb_build_object('Content-Type', 'application/json'),
    body:='{"edge_function_name":"detect-late-payments"}',
    timeout_milliseconds:=10000
  );
  COMMIT;
END;
$procedure$;

-- Correction de la procédure execute_recurring_payments
CREATE OR REPLACE PROCEDURE public.execute_recurring_payments_e84aeb13()
LANGUAGE plpgsql
SET search_path TO ''
AS $procedure$
BEGIN
  PERFORM net.http_post(
    url:='https://wsbawdvqfbmtjtdtyddy.supabase.co/functions/v1/execute-recurring-payments',
    headers:=jsonb_build_object('Content-Type', 'application/json'),
    body:='{"edge_function_name":"execute-recurring-payments"}',
    timeout_milliseconds:=10000
  );
  COMMIT;
END;
$procedure$;