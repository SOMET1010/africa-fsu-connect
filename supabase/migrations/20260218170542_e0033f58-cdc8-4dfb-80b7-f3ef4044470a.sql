
-- Create homepage_content_blocks table for CMS
CREATE TABLE public.homepage_content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  block_key text UNIQUE NOT NULL,
  content_fr jsonb DEFAULT '{}'::jsonb,
  content_en jsonb DEFAULT '{}'::jsonb,
  content_ar jsonb DEFAULT '{}'::jsonb,
  content_pt jsonb DEFAULT '{}'::jsonb,
  is_visible boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.homepage_content_blocks ENABLE ROW LEVEL SECURITY;

-- Everyone can read
CREATE POLICY "Anyone can read homepage blocks"
ON public.homepage_content_blocks
FOR SELECT
USING (true);

-- Only super_admin and admin_pays can write
CREATE POLICY "Admins can insert homepage blocks"
ON public.homepage_content_blocks
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update homepage blocks"
ON public.homepage_content_blocks
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete homepage blocks"
ON public.homepage_content_blocks
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_homepage_content_blocks_updated_at
BEFORE UPDATE ON public.homepage_content_blocks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default content blocks
INSERT INTO public.homepage_content_blocks (block_key, sort_order, content_fr, content_en, content_ar, content_pt) VALUES
('hero', 1,
  '{"badge": "Réseau SUTEL — Service Universel Africain", "title": "Plateforme de coopération", "subtitle_highlight": "Service Universel", "subtitle_suffix": "Africain", "description": "Une plateforme de coopération, de projets et de partage au service de l''inclusion numérique africaine.", "cta_explore": "Découvrir le réseau", "cta_member": "Espace membre"}'::jsonb,
  '{"badge": "SUTEL Network — African Universal Service", "title": "Cooperation Platform", "subtitle_highlight": "Universal Service", "subtitle_suffix": "African", "description": "A platform for cooperation, projects and sharing in service of African digital inclusion.", "cta_explore": "Explore the network", "cta_member": "Member Area"}'::jsonb,
  '{"badge": "شبكة SUTEL — الخدمة الشاملة الأفريقية", "title": "منصة التعاون", "subtitle_highlight": "الخدمة الشاملة", "subtitle_suffix": "الأفريقية", "description": "منصة تعاون ومشاريع ومشاركة لخدمة الشمول الرقمي الأفريقي.", "cta_explore": "استكشاف الشبكة", "cta_member": "مساحة الأعضاء"}'::jsonb,
  '{"badge": "Rede SUTEL — Serviço Universal Africano", "title": "Plataforma de cooperação", "subtitle_highlight": "Serviço Universal", "subtitle_suffix": "Africano", "description": "Uma plataforma de cooperação, projetos e partilha ao serviço da inclusão digital africana.", "cta_explore": "Explorar a rede", "cta_member": "Área de Membro"}'::jsonb
),
('features', 2,
  '{"items": [{"icon": "Users", "title": "54 Pays Membres", "description": "Réseau panafricain des agences de régulation"}, {"icon": "FolderGit2", "title": "Projets FSU", "description": "Partage d''expériences et bonnes pratiques"}, {"icon": "FileText", "title": "Ressources", "description": "Documentation et guides méthodologiques"}]}'::jsonb,
  '{"items": [{"icon": "Users", "title": "54 Member Countries", "description": "Pan-African network of regulatory agencies"}, {"icon": "FolderGit2", "title": "USF Projects", "description": "Experience sharing and best practices"}, {"icon": "FileText", "title": "Resources", "description": "Documentation and methodological guides"}]}'::jsonb,
  '{"items": [{"icon": "Users", "title": "54 دولة عضو", "description": "الشبكة الأفريقية للهيئات التنظيمية"}, {"icon": "FolderGit2", "title": "مشاريع FSU", "description": "تبادل الخبرات والممارسات الجيدة"}, {"icon": "FileText", "title": "الموارد", "description": "الوثائق والأدلة المنهجية"}]}'::jsonb,
  '{"items": [{"icon": "Users", "title": "54 Países Membros", "description": "Rede pan-africana de agências reguladoras"}, {"icon": "FolderGit2", "title": "Projetos FSU", "description": "Partilha de experiências e boas práticas"}, {"icon": "FileText", "title": "Recursos", "description": "Documentação e guias metodológicos"}]}'::jsonb
),
('partners', 3,
  '{"title": "Partenaires", "items": ["Union Africaine des Télécommunications", "Union Internationale des Télécommunications", "Banque Mondiale", "Union Européenne"]}'::jsonb,
  '{"title": "Partners", "items": ["African Telecommunications Union", "International Telecommunication Union", "World Bank", "European Union"]}'::jsonb,
  '{"title": "الشركاء", "items": ["الاتحاد الأفريقي للاتصالات", "الاتحاد الدولي للاتصالات", "البنك الدولي", "الاتحاد الأوروبي"]}'::jsonb,
  '{"title": "Parceiros", "items": ["União Africana de Telecomunicações", "União Internacional de Telecomunicações", "Banco Mundial", "União Europeia"]}'::jsonb
),
('cta', 4,
  '{"kicker": "Rejoignez-nous", "title": "Rejoignez le réseau SUTEL", "subtitle": "Participez à la construction collective du Service Universel en Afrique", "button_label": "Créer un compte", "button_link": "/auth"}'::jsonb,
  '{"kicker": "Join us", "title": "Join the SUTEL Network", "subtitle": "Participate in building Universal Service collectively in Africa", "button_label": "Create an account", "button_link": "/auth"}'::jsonb,
  '{"kicker": "انضم إلينا", "title": "انضم إلى شبكة SUTEL", "subtitle": "شارك في البناء الجماعي للخدمة الشاملة في أفريقيا", "button_label": "إنشاء حساب", "button_link": "/auth"}'::jsonb,
  '{"kicker": "Junte-se a nós", "title": "Junte-se à rede SUTEL", "subtitle": "Participe na construção coletiva do Serviço Universal em África", "button_label": "Criar conta", "button_link": "/auth"}'::jsonb
),
('stats', 5,
  '{"items": [{"value": "54", "label": "Pays membres"}, {"value": "200+", "label": "Projets partagés"}, {"value": "1.3Md", "label": "Bénéficiaires potentiels"}, {"value": "4", "label": "Langues officielles"}]}'::jsonb,
  '{"items": [{"value": "54", "label": "Member countries"}, {"value": "200+", "label": "Shared projects"}, {"value": "1.3B", "label": "Potential beneficiaries"}, {"value": "4", "label": "Official languages"}]}'::jsonb,
  '{"items": [{"value": "54", "label": "دولة عضو"}, {"value": "200+", "label": "مشروع مشترك"}, {"value": "1.3 مليار", "label": "مستفيد محتمل"}, {"value": "4", "label": "لغات رسمية"}]}'::jsonb,
  '{"items": [{"value": "54", "label": "Países membros"}, {"value": "200+", "label": "Projetos partilhados"}, {"value": "1.3Md", "label": "Beneficiários potenciais"}, {"value": "4", "label": "Línguas oficiais"}]}'::jsonb
);
