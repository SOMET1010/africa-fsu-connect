-- Phase 1: Système de Points Focaux pour les États Membres

-- 1. Ajouter le rôle 'point_focal' à l'enum user_role
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'point_focal';

-- 2. Créer la table focal_points pour gérer les désignations
CREATE TABLE public.focal_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  country_code TEXT NOT NULL,
  designation_type TEXT NOT NULL CHECK (designation_type IN ('primary', 'secondary')),
  designated_by TEXT, -- Nom de l'autorité/ministère qui a désigné
  designation_document_url TEXT, -- Lettre de désignation officielle
  designation_date DATE DEFAULT CURRENT_DATE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  whatsapp_number TEXT,
  organization TEXT, -- Ministère ou organisme
  job_title TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'invited', 'active', 'suspended', 'revoked')),
  invitation_token UUID DEFAULT gen_random_uuid(),
  invitation_sent_at TIMESTAMP WITH TIME ZONE,
  invitation_expires_at TIMESTAMP WITH TIME ZONE,
  activated_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE, -- Date de fin de mandat
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id),
  UNIQUE(country_code, designation_type), -- Un seul point focal primary et secondary par pays
  UNIQUE(email),
  UNIQUE(invitation_token)
);

-- 3. Créer la table indicator_submissions pour les soumissions d'indicateurs
CREATE TABLE public.indicator_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL,
  indicator_code TEXT NOT NULL,
  year INTEGER NOT NULL,
  quarter INTEGER CHECK (quarter IN (1, 2, 3, 4)),
  submitted_value NUMERIC,
  value_text TEXT, -- Pour les indicateurs non-numériques
  unit TEXT,
  data_source TEXT,
  methodology_notes TEXT,
  submitted_by UUID NOT NULL REFERENCES public.profiles(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'validated', 'rejected', 'published')),
  validated_by UUID REFERENCES public.profiles(id),
  validation_date TIMESTAMP WITH TIME ZONE,
  validation_notes TEXT,
  rejected_reason TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  published_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(country_code, indicator_code, year, quarter)
);

-- 4. Créer la table focal_point_invitations pour suivre les invitations
CREATE TABLE public.focal_point_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  focal_point_id UUID NOT NULL REFERENCES public.focal_points(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token UUID NOT NULL DEFAULT gen_random_uuid(),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '30 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(token)
);

-- 5. Enable RLS
ALTER TABLE public.focal_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicator_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focal_point_invitations ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for focal_points

-- Admins can do everything
CREATE POLICY "Admins can manage focal points"
ON public.focal_points
FOR ALL
USING (public.is_admin(auth.uid()));

-- Focal points can view their own record
CREATE POLICY "Focal points can view own record"
ON public.focal_points
FOR SELECT
USING (user_id = auth.uid());

-- Focal points can update their contact info
CREATE POLICY "Focal points can update own contact info"
ON public.focal_points
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 7. RLS Policies for indicator_submissions

-- Admins can do everything
CREATE POLICY "Admins can manage submissions"
ON public.indicator_submissions
FOR ALL
USING (public.is_admin(auth.uid()));

-- Focal points can manage submissions for their country
CREATE POLICY "Focal points can manage own country submissions"
ON public.indicator_submissions
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.focal_points fp
    WHERE fp.user_id = auth.uid()
    AND fp.country_code = indicator_submissions.country_code
    AND fp.status = 'active'
  )
);

-- Published submissions are readable by all authenticated users
CREATE POLICY "Published submissions are public"
ON public.indicator_submissions
FOR SELECT
USING (status = 'published' AND auth.uid() IS NOT NULL);

-- 8. RLS Policies for focal_point_invitations

-- Admins can manage invitations
CREATE POLICY "Admins can manage invitations"
ON public.focal_point_invitations
FOR ALL
USING (public.is_admin(auth.uid()));

-- Anyone can read their own invitation by token (for signup flow)
CREATE POLICY "Anyone can read invitation by token"
ON public.focal_point_invitations
FOR SELECT
USING (true); -- Token-based lookup handled in app

-- 9. Indexes for performance
CREATE INDEX idx_focal_points_country ON public.focal_points(country_code);
CREATE INDEX idx_focal_points_user ON public.focal_points(user_id);
CREATE INDEX idx_focal_points_status ON public.focal_points(status);
CREATE INDEX idx_focal_points_invitation_token ON public.focal_points(invitation_token);
CREATE INDEX idx_indicator_submissions_country_year ON public.indicator_submissions(country_code, year);
CREATE INDEX idx_indicator_submissions_status ON public.indicator_submissions(status);
CREATE INDEX idx_indicator_submissions_submitted_by ON public.indicator_submissions(submitted_by);

-- 10. Trigger for updated_at
CREATE TRIGGER update_focal_points_updated_at
  BEFORE UPDATE ON public.focal_points
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_indicator_submissions_updated_at
  BEFORE UPDATE ON public.indicator_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 11. Function to check if user is a focal point for a country
CREATE OR REPLACE FUNCTION public.is_focal_point(user_id uuid, country text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  IF country IS NULL THEN
    RETURN EXISTS (
      SELECT 1 FROM public.focal_points
      WHERE focal_points.user_id = is_focal_point.user_id
      AND status = 'active'
    );
  ELSE
    RETURN EXISTS (
      SELECT 1 FROM public.focal_points
      WHERE focal_points.user_id = is_focal_point.user_id
      AND country_code = country
      AND status = 'active'
    );
  END IF;
END;
$$;

-- 12. Function to get focal points for a country
CREATE OR REPLACE FUNCTION public.get_country_focal_points(country text)
RETURNS TABLE(
  id uuid,
  designation_type text,
  first_name text,
  last_name text,
  email text,
  organization text,
  job_title text,
  status text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT 
    fp.id,
    fp.designation_type,
    fp.first_name,
    fp.last_name,
    fp.email,
    fp.organization,
    fp.job_title,
    fp.status
  FROM public.focal_points fp
  WHERE fp.country_code = country
  AND fp.status IN ('active', 'pending', 'invited')
  ORDER BY fp.designation_type;
$$;