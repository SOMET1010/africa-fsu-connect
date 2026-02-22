-- Update hero CMS content with consistent branding across all 4 languages
UPDATE homepage_content_blocks SET 
  content_fr = jsonb_build_object(
    'badge', 'USF Digital Connect Africa',
    'title', 'Connecter l''écosystème',
    'subtitle_highlight', 'numérique de l''Afrique',
    'subtitle_suffix', '',
    'description', 'Plateforme panafricaine pour la coordination, l''innovation et la mutualisation des ressources du Service Universel des Télécommunications.',
    'cta_explore', 'Explorer le réseau',
    'cta_signup', 'S''inscrire',
    'cta_login', 'Se connecter',
    'cta_member', 'Espace membre'
  ),
  content_en = jsonb_build_object(
    'badge', 'USF Digital Connect Africa',
    'title', 'Connecting Africa''s',
    'subtitle_highlight', 'Digital Ecosystem',
    'subtitle_suffix', '',
    'description', 'Pan-African platform for coordination, innovation and resource sharing for Universal Telecommunication Services.',
    'cta_explore', 'Explore the network',
    'cta_signup', 'Sign up',
    'cta_login', 'Log in',
    'cta_member', 'Member Area'
  ),
  content_ar = jsonb_build_object(
    'badge', 'USF Digital Connect Africa',
    'title', 'ربط النظام البيئي',
    'subtitle_highlight', 'الرقمي لأفريقيا',
    'subtitle_suffix', '',
    'description', 'منصة أفريقية شاملة للتنسيق والابتكار وتقاسم موارد خدمات الاتصالات الشاملة.',
    'cta_explore', 'استكشاف الشبكة',
    'cta_signup', 'إنشاء حساب',
    'cta_login', 'تسجيل الدخول',
    'cta_member', 'مساحة الأعضاء'
  ),
  content_pt = jsonb_build_object(
    'badge', 'USF Digital Connect Africa',
    'title', 'Conectar o ecossistema',
    'subtitle_highlight', 'digital de África',
    'subtitle_suffix', '',
    'description', 'Plataforma pan-africana para coordenação, inovação e partilha de recursos dos Serviços Universais de Telecomunicações.',
    'cta_explore', 'Explorar a rede',
    'cta_signup', 'Registar-se',
    'cta_login', 'Entrar',
    'cta_member', 'Área de Membro'
  ),
  updated_at = now()
WHERE block_key = 'hero';