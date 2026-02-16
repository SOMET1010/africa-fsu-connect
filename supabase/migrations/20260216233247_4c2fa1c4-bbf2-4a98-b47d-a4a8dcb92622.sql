
-- Add access control columns to documents
ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS access_level text NOT NULL DEFAULT 'public',
ADD COLUMN IF NOT EXISTS allowed_roles text[] DEFAULT '{}';

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view public documents" ON public.documents;
DROP POLICY IF EXISTS "Authenticated users can view all documents for stats" ON public.documents;
DROP POLICY IF EXISTS "Authenticated users can view their own documents for management" ON public.documents;
DROP POLICY IF EXISTS "Authenticated admins can manage all documents" ON public.documents;
DROP POLICY IF EXISTS "Authenticated users can update their own documents" ON public.documents;
DROP POLICY IF EXISTS "Authenticated users can upload documents" ON public.documents;

-- SELECT: Public documents visible to everyone
CREATE POLICY "Anyone can view public documents"
ON public.documents FOR SELECT
USING (access_level = 'public');

-- SELECT: Authenticated-level docs
CREATE POLICY "Authenticated users can view authenticated-level documents"
ON public.documents FOR SELECT
TO authenticated
USING (access_level = 'authenticated');

-- SELECT: Restricted docs with role check (cast enum to text)
CREATE POLICY "Users with matching role can view restricted documents"
ON public.documents FOR SELECT
TO authenticated
USING (
  access_level = 'restricted' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role::text = ANY(documents.allowed_roles)
  )
);

-- SELECT: Owners always see their own
CREATE POLICY "Owners can view their own documents"
ON public.documents FOR SELECT
TO authenticated
USING (auth.uid() = uploaded_by);

-- INSERT
CREATE POLICY "Authenticated users can upload documents"
ON public.documents FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = uploaded_by);

-- UPDATE: Owner
CREATE POLICY "Owners can update their own documents"
ON public.documents FOR UPDATE
TO authenticated
USING (auth.uid() = uploaded_by);

-- UPDATE: Admin
CREATE POLICY "Admins can update any document"
ON public.documents FOR UPDATE
TO authenticated
USING (is_admin(auth.uid()));

-- DELETE: Owner
CREATE POLICY "Owners can delete their own documents"
ON public.documents FOR DELETE
TO authenticated
USING (auth.uid() = uploaded_by);

-- DELETE: Admin
CREATE POLICY "Admins can delete any document"
ON public.documents FOR DELETE
TO authenticated
USING (is_admin(auth.uid()));
