-- Fix RLS policies to allow dashboard stats viewing

-- Update documents policies to allow viewing stats for dashboard
DROP POLICY IF EXISTS "Authenticated users can view public documents" ON public.documents;
DROP POLICY IF EXISTS "Authenticated users can view their own documents" ON public.documents;

-- Create new policies for documents
CREATE POLICY "Authenticated users can view all documents for stats" 
ON public.documents 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view their own documents for management" 
ON public.documents 
FOR SELECT 
USING (auth.uid() = uploaded_by);

CREATE POLICY "Authenticated users can view public documents" 
ON public.documents 
FOR SELECT 
USING (is_public = true);

-- Ensure profiles can be counted for dashboard stats
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

CREATE POLICY "Authenticated users can view all profiles for stats" 
ON public.profiles 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Ensure events can be counted for dashboard stats  
DROP POLICY IF EXISTS "Authenticated users can view events" ON public.events;

CREATE POLICY "Authenticated users can view all events" 
ON public.events 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Ensure submissions can be counted for dashboard stats
DROP POLICY IF EXISTS "Authenticated users can view their own submissions" ON public.submissions;

CREATE POLICY "Authenticated users can view all submissions for stats" 
ON public.submissions 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage their own submissions" 
ON public.submissions 
FOR ALL 
USING (auth.uid() = submitted_by);