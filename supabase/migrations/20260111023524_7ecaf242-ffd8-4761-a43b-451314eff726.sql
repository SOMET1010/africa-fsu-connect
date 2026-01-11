-- =====================================================
-- MIGRATION DE SÉCURITÉ - PHASE 3 (Corrections finales)
-- Correction des 3 dernières erreurs critiques
-- =====================================================

-- 1. PROFILES - Restreindre l'accès aux propres données
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

CREATE POLICY "Users can view own profile only"
ON public.profiles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- 2. USER_PROFILES - Déjà restrictif mais clarifier
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;

CREATE POLICY "Strict own profile access"
ON public.user_profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

-- 3. FOCAL_POINTS - Restreindre aux admins et autres focal points
DROP POLICY IF EXISTS "Authenticated users can view active focal points" ON public.focal_points;

CREATE POLICY "Only focal points and admins can view focal points"
ON public.focal_points FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() 
  OR public.is_admin(auth.uid())
  OR public.is_focal_point(auth.uid())
);

-- 4. FRAUD_CHECKS - Restreindre aux admins uniquement
DROP POLICY IF EXISTS "Admins only can view fraud checks" ON public.fraud_checks;
DROP POLICY IF EXISTS "Users can view own fraud checks" ON public.fraud_checks;

CREATE POLICY "Only admins can access fraud checks"
ON public.fraud_checks FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));