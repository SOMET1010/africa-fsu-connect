-- Fix role escalation vulnerability
-- Remove ability for users to update their own role
DROP POLICY IF EXISTS "Authenticated users can update their own profile" ON public.profiles;

-- Create separate policies for profile updates vs role updates
CREATE POLICY "Authenticated users can update their own profile data" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND 
  -- Prevent role changes by regular users
  OLD.role = NEW.role
);

-- Only admins can update roles
CREATE POLICY "Authenticated admins can update any profile role" 
ON public.profiles 
FOR UPDATE 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Create audit function for role changes
CREATE OR REPLACE FUNCTION public.audit_role_change()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for role change auditing
DROP TRIGGER IF EXISTS audit_role_changes ON public.profiles;
CREATE TRIGGER audit_role_changes
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_role_change();

-- Create function for admin role updates
CREATE OR REPLACE FUNCTION public.admin_update_user_role(
  target_user_id uuid,
  new_role user_role
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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