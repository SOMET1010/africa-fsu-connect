
-- Table site_settings
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings"
  ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Table navigation_items
CREATE TABLE public.navigation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL CHECK (location IN ('header', 'footer_modules', 'footer_partners', 'footer_legal')),
  label JSONB NOT NULL DEFAULT '{}',
  href TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  is_external BOOLEAN NOT NULL DEFAULT false,
  icon TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read nav items"
  ON public.navigation_items FOR SELECT USING (true);

CREATE POLICY "Admins can manage nav items"
  ON public.navigation_items FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Seed site_settings
INSERT INTO public.site_settings (key, value) VALUES
  ('platform_name', '{"fr": "UDC", "en": "UDC", "ar": "UDC", "pt": "UDC"}'),
  ('contact_email', '{"value": "secretariat@atuuat.africa"}'),
  ('contact_phone', '{"value": "+225 27 22 44 44 44"}'),
  ('contact_location', '{"fr": "Abidjan, Côte d''Ivoire", "en": "Abidjan, Ivory Coast", "ar": "أبيدجان، ساحل العاج", "pt": "Abidjan, Costa do Marfim"}'),
  ('site_slogan', '{"fr": "Digital Connect Africa", "en": "Digital Connect Africa"}');

-- Seed header navigation items
INSERT INTO public.navigation_items (location, label, href, sort_order) VALUES
  ('header', '{"fr": "Accueil", "en": "Home", "ar": "الرئيسية", "pt": "Início"}', '/', 0),
  ('header', '{"fr": "À propos", "en": "About", "ar": "حول", "pt": "Sobre"}', '/about', 1),
  ('header', '{"fr": "Plateforme", "en": "Platform", "ar": "المنصة", "pt": "Plataforma"}', '/network', 2),
  ('header', '{"fr": "Stratégies", "en": "Strategies", "ar": "استراتيجيات", "pt": "Estratégias"}', '/strategies', 3),
  ('header', '{"fr": "Événements", "en": "Events", "ar": "الفعاليات", "pt": "Eventos"}', '/events', 4),
  ('header', '{"fr": "Contact", "en": "Contact", "ar": "اتصل بنا", "pt": "Contato"}', '/contact', 5);

-- Storage bucket for CMS assets
INSERT INTO storage.buckets (id, name, public) VALUES ('cms-assets', 'cms-assets', true);

CREATE POLICY "Anyone can read cms assets"
  ON storage.objects FOR SELECT USING (bucket_id = 'cms-assets');

CREATE POLICY "Admins can manage cms assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cms-assets' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update cms assets"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'cms-assets' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete cms assets"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'cms-assets' AND public.is_admin(auth.uid()));
