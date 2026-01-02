
-- Remove the public policy that still exposes sensitive data
DROP POLICY IF EXISTS "Public can view limited artisan info" ON public.artisan_profiles;
