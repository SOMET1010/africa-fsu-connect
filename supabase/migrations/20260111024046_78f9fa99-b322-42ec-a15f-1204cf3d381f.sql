-- =====================================================
-- MIGRATION DE SÉCURITÉ - PHASE 4 
-- Suppression des politiques trop permissives
-- =====================================================

-- PROFILES - Supprimer les politiques trop permissives
DROP POLICY IF EXISTS "Authenticated users can view all profiles for stats" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles" ON public.profiles;

-- FOCAL_POINTS - Consolider les politiques
DROP POLICY IF EXISTS "Focal points can view own record" ON public.focal_points;

-- USER_PROFILES - Supprimer les doublons français
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leur propre profil" ON public.user_profiles;

-- Recréer une politique unifiée pour focal_points
-- (elle existe déjà avec "Only focal points and admins can view focal points")