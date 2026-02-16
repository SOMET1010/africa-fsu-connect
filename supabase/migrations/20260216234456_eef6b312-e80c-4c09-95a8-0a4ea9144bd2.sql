
-- Add access control and versioning support to agency_resources
ALTER TABLE public.agency_resources 
ADD COLUMN IF NOT EXISTS access_level text NOT NULL DEFAULT 'public',
ADD COLUMN IF NOT EXISTS allowed_roles text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS shared_with_agencies uuid[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS uploaded_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS current_version text DEFAULT '1.0';

-- Create agency_resource_versions table
CREATE TABLE IF NOT EXISTS public.agency_resource_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES public.agency_resources(id) ON DELETE CASCADE,
  version text NOT NULL,
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_size bigint,
  changes_summary text NOT NULL,
  uploaded_by uuid NOT NULL REFERENCES auth.users(id),
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

-- Create agency_resource_comments table
CREATE TABLE IF NOT EXISTS public.agency_resource_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES public.agency_resources(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  user_name text NOT NULL,
  comment text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agency_resource_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_resource_comments ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user is member of an agency
CREATE OR REPLACE FUNCTION public.is_agency_member(p_user_id uuid, p_agency_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.agency_members
    WHERE user_id = p_user_id
    AND agency_id = p_agency_id
    AND active = true
  );
$$;

-- Helper function: check agency member role
CREATE OR REPLACE FUNCTION public.get_agency_member_role(p_user_id uuid, p_agency_id uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.agency_members
  WHERE user_id = p_user_id
  AND agency_id = p_agency_id
  AND active = true;
$$;

-- Drop old overly permissive policies on agency_resources
DROP POLICY IF EXISTS "Authenticated users can view agency resources" ON public.agency_resources;
DROP POLICY IF EXISTS "Authenticated admins can manage agency resources" ON public.agency_resources;

-- SELECT: Public agency resources visible to all authenticated users
CREATE POLICY "View public agency resources"
ON public.agency_resources FOR SELECT
TO authenticated
USING (access_level = 'public');

-- SELECT: Authenticated-level resources for logged-in users
CREATE POLICY "View authenticated agency resources"
ON public.agency_resources FOR SELECT
TO authenticated
USING (access_level = 'authenticated');

-- SELECT: Members can see their own agency's resources
CREATE POLICY "Agency members can view own agency resources"
ON public.agency_resources FOR SELECT
TO authenticated
USING (public.is_agency_member(auth.uid(), agency_id));

-- SELECT: Shared resources visible to target agencies
CREATE POLICY "View shared agency resources"
ON public.agency_resources FOR SELECT
TO authenticated
USING (
  access_level = 'restricted' AND
  EXISTS (
    SELECT 1 FROM public.agency_members am
    WHERE am.user_id = auth.uid()
    AND am.active = true
    AND am.agency_id = ANY(shared_with_agencies)
  )
);

-- SELECT: Restricted by role
CREATE POLICY "View role-restricted agency resources"
ON public.agency_resources FOR SELECT
TO authenticated
USING (
  access_level = 'restricted' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role::text = ANY(allowed_roles)
  )
);

-- INSERT: Agency members with admin/editor role can upload
CREATE POLICY "Agency editors can upload resources"
ON public.agency_resources FOR INSERT
TO authenticated
WITH CHECK (
  public.get_agency_member_role(auth.uid(), agency_id) IN ('admin', 'editor', 'manager')
  OR is_admin(auth.uid())
);

-- UPDATE: Agency admins/editors or platform admins
CREATE POLICY "Agency editors can update resources"
ON public.agency_resources FOR UPDATE
TO authenticated
USING (
  public.get_agency_member_role(auth.uid(), agency_id) IN ('admin', 'editor', 'manager')
  OR is_admin(auth.uid())
);

-- DELETE: Agency admins or platform admins
CREATE POLICY "Agency admins can delete resources"
ON public.agency_resources FOR DELETE
TO authenticated
USING (
  public.get_agency_member_role(auth.uid(), agency_id) = 'admin'
  OR is_admin(auth.uid())
);

-- Versions: viewable if resource is viewable (simplified: all authenticated)
CREATE POLICY "View agency resource versions"
ON public.agency_resource_versions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Agency editors can create versions"
ON public.agency_resource_versions FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.agency_resources ar
    WHERE ar.id = resource_id
    AND (
      public.get_agency_member_role(auth.uid(), ar.agency_id) IN ('admin', 'editor', 'manager')
      OR is_admin(auth.uid())
    )
  )
);

-- Comments: viewable by all authenticated, insertable by authenticated
CREATE POLICY "View agency resource comments"
ON public.agency_resource_comments FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can comment"
ON public.agency_resource_comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
ON public.agency_resource_comments FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_agency_resource_versions_resource_id 
ON public.agency_resource_versions(resource_id);

CREATE INDEX IF NOT EXISTS idx_agency_resource_comments_resource_id 
ON public.agency_resource_comments(resource_id);

CREATE INDEX IF NOT EXISTS idx_agency_resources_access_level 
ON public.agency_resources(access_level);
