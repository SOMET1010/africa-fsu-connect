-- Fix cast issues: profiles.id should be profiles.user_id in RLS policies
-- that compare against auth.uid()

-- 1. Fix agency_resources role-restricted policy
DROP POLICY IF EXISTS "View role-restricted agency resources" ON public.agency_resources;
CREATE POLICY "View role-restricted agency resources"
ON public.agency_resources FOR SELECT TO authenticated
USING (
  access_level = 'restricted'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role::text = ANY(agency_resources.allowed_roles)
  )
);

-- 2. Fix documents role-restricted policy
DROP POLICY IF EXISTS "Users with matching role can view restricted documents" ON public.documents;
CREATE POLICY "Users with matching role can view restricted documents"
ON public.documents FOR SELECT TO authenticated
USING (
  access_level = 'restricted'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role::text = ANY(documents.allowed_roles)
  )
);