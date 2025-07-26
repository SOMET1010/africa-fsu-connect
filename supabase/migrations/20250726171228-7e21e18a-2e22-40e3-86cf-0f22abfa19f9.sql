-- Fix function search path security warning by dropping and recreating
DROP TRIGGER IF EXISTS audit_role_changes ON public.profiles;
DROP FUNCTION IF EXISTS public.audit_role_change() CASCADE;

CREATE OR REPLACE FUNCTION public.audit_role_change()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

-- Recreate the trigger
CREATE TRIGGER audit_role_changes
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_role_change();