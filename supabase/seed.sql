-- Seed: insertion de tous les pays d'Afrique
-- Basé sur la liste des États membres de l'Union africaine + Sahara occidental

INSERT INTO public.countries
  (code, name_fr, name_en, region, continent, latitude, longitude, capital_city, official_language, working_languages, sutel_community)
VALUES
  ('DZ', 'Algérie', 'Algeria', 'Afrique du Nord', 'Afrique', 28.0339, 1.6596, 'Alger', 'ar', '["ar","fr"]', NULL),
  ('AO', 'Angola', 'Angola', 'Afrique centrale', 'Afrique', -11.2027, 17.8739, 'Luanda', 'pt', '["pt"]', NULL),
  ('BJ', 'Bénin', 'Benin', 'Afrique de l''Ouest', 'Afrique', 9.3077, 2.3158, 'Porto-Novo', 'fr', '["fr"]', NULL),
  ('BW', 'Botswana', 'Botswana', 'Afrique australe', 'Afrique', -22.3285, 24.6849, 'Gaborone', 'en', '["en"]', NULL),
  ('BF', 'Burkina Faso', 'Burkina Faso', 'Afrique de l''Ouest', 'Afrique', 12.2383, -1.5616, 'Ouagadougou', 'fr', '["fr"]', NULL),
  ('BI', 'Burundi', 'Burundi', 'Afrique de l''Est', 'Afrique', -3.3731, 29.9189, 'Gitega', 'rn', '["rn","fr"]', NULL),
  ('CM', 'Cameroun', 'Cameroon', 'Afrique centrale', 'Afrique', 7.3697, 12.3547, 'Yaoundé', 'fr', '["fr","en"]', NULL),
  ('CV', 'Cap-Vert', 'Cape Verde', 'Afrique de l''Ouest', 'Afrique', 16.5388, -23.0418, 'Praia', 'pt', '["pt"]', NULL),
  ('CF', 'République centrafricaine', 'Central African Republic', 'Afrique centrale', 'Afrique', 6.6111, 20.9394, 'Bangui', 'fr', '["fr"]', NULL),
  ('TD', 'Tchad', 'Chad', 'Afrique centrale', 'Afrique', 15.4542, 18.7322, 'N''Djaména', 'fr', '["fr","ar"]', NULL),
  ('KM', 'Comores', 'Comoros', 'Afrique de l''Est', 'Afrique', -11.8750, 43.8722, 'Moroni', 'ar', '["ar","fr"]', NULL),
  ('CG', 'Congo', 'Congo', 'Afrique centrale', 'Afrique', -0.2280, 15.8277, 'Brazzaville', 'fr', '["fr"]', NULL),
  ('CD', 'République démocratique du Congo', 'Democratic Republic of the Congo', 'Afrique centrale', 'Afrique', -4.0383, 21.7587, 'Kinshasa', 'fr', '["fr"]', NULL),
  ('CI', 'Côte d''Ivoire', 'Ivory Coast', 'Afrique de l''Ouest', 'Afrique', 7.5400, -5.5471, 'Yamoussoukro', 'fr', '["fr"]', NULL),
  ('DJ', 'Djibouti', 'Djibouti', 'Afrique de l''Est', 'Afrique', 11.8251, 42.5903, 'Djibouti', 'fr', '["fr","ar"]', NULL),
  ('EG', 'Égypte', 'Egypt', 'Afrique du Nord', 'Afrique', 26.8206, 30.8025, 'Le Caire', 'ar', '["ar"]', NULL),
  ('GQ', 'Guinée équatoriale', 'Equatorial Guinea', 'Afrique centrale', 'Afrique', 1.6508, 10.2679, 'Malabo', 'es', '["es","fr"]', NULL),
  ('ER', 'Érythrée', 'Eritrea', 'Afrique de l''Est', 'Afrique', 15.1794, 39.7823, 'Asmara', 'ti', '["ti","ar","en"]', NULL),
  ('SZ', 'Eswatini', 'Eswatini', 'Afrique australe', 'Afrique', -26.5225, 31.4659, 'Mbabane', 'en', '["en","ss"]', NULL),
  ('ET', 'Éthiopie', 'Ethiopia', 'Afrique de l''Est', 'Afrique', 9.1450, 40.4897, 'Addis-Abeba', 'am', '["am"]', NULL),
  ('GA', 'Gabon', 'Gabon', 'Afrique centrale', 'Afrique', -0.8037, 11.6094, 'Libreville', 'fr', '["fr"]', NULL),
  ('GM', 'Gambie', 'Gambia', 'Afrique de l''Ouest', 'Afrique', 13.4432, -15.3101, 'Banjul', 'en', '["en"]', NULL),
  ('GH', 'Ghana', 'Ghana', 'Afrique de l''Ouest', 'Afrique', 7.9465, -1.0232, 'Accra', 'en', '["en"]', NULL),
  ('GN', 'Guinée', 'Guinea', 'Afrique de l''Ouest', 'Afrique', 9.9456, -9.6966, 'Conakry', 'fr', '["fr"]', NULL),
  ('GW', 'Guinée-Bissau', 'Guinea-Bissau', 'Afrique de l''Ouest', 'Afrique', 11.8037, -15.1804, 'Bissau', 'pt', '["pt"]', NULL),
  ('KE', 'Kenya', 'Kenya', 'Afrique de l''Est', 'Afrique', -0.0236, 37.9062, 'Nairobi', 'en', '["en","sw"]', NULL),
  ('LS', 'Lesotho', 'Lesotho', 'Afrique australe', 'Afrique', -29.6100, 28.2336, 'Maseru', 'en', '["en","st"]', NULL),
  ('LR', 'Libéria', 'Liberia', 'Afrique de l''Ouest', 'Afrique', 6.4281, -9.4295, 'Monrovia', 'en', '["en"]', NULL),
  ('LY', 'Libye', 'Libya', 'Afrique du Nord', 'Afrique', 26.3351, 17.2283, 'Tripoli', 'ar', '["ar"]', NULL),
  ('MG', 'Madagascar', 'Madagascar', 'Afrique de l''Est', 'Afrique', -18.7669, 46.8691, 'Antananarivo', 'mg', '["mg","fr"]', NULL),
  ('MW', 'Malawi', 'Malawi', 'Afrique australe', 'Afrique', -13.2543, 34.3015, 'Lilongwe', 'en', '["en","ny"]', NULL),
  ('ML', 'Mali', 'Mali', 'Afrique de l''Ouest', 'Afrique', 17.5707, -3.9962, 'Bamako', 'fr', '["fr"]', NULL),
  ('MR', 'Mauritanie', 'Mauritania', 'Afrique de l''Ouest', 'Afrique', 21.0079, -10.9408, 'Nouakchott', 'ar', '["ar","fr"]', NULL),
  ('MU', 'Maurice', 'Mauritius', 'Afrique de l''Est', 'Afrique', -20.3484, 57.5522, 'Port-Louis', 'en', '["en","fr"]', NULL),
  ('MA', 'Maroc', 'Morocco', 'Afrique du Nord', 'Afrique', 31.7917, -7.0926, 'Rabat', 'ar', '["ar","fr"]', NULL),
  ('MZ', 'Mozambique', 'Mozambique', 'Afrique australe', 'Afrique', -18.6657, 35.5296, 'Maputo', 'pt', '["pt"]', NULL),
  ('NA', 'Namibie', 'Namibia', 'Afrique australe', 'Afrique', -22.9576, 18.4904, 'Windhoek', 'en', '["en"]', NULL),
  ('NE', 'Niger', 'Niger', 'Afrique de l''Ouest', 'Afrique', 17.6078, 8.0817, 'Niamey', 'fr', '["fr"]', NULL),
  ('NG', 'Nigeria', 'Nigeria', 'Afrique de l''Ouest', 'Afrique', 9.0820, 8.6753, 'Abuja', 'en', '["en"]', NULL),
  ('RW', 'Rwanda', 'Rwanda', 'Afrique de l''Est', 'Afrique', -1.9403, 29.8739, 'Kigali', 'rw', '["rw","fr","en"]', NULL),
  ('ST', 'Sao Tomé-et-Principe', 'Sao Tome and Principe', 'Afrique centrale', 'Afrique', 0.1864, 6.6131, 'São Tomé', 'pt', '["pt"]', NULL),
  ('SN', 'Sénégal', 'Senegal', 'Afrique de l''Ouest', 'Afrique', 14.4974, -14.4524, 'Dakar', 'fr', '["fr"]', NULL),
  ('SC', 'Seychelles', 'Seychelles', 'Afrique de l''Est', 'Afrique', -4.6796, 55.4920, 'Victoria', 'fr', '["fr","en"]', NULL),
  ('SL', 'Sierra Leone', 'Sierra Leone', 'Afrique de l''Ouest', 'Afrique', 8.4606, -11.7799, 'Freetown', 'en', '["en"]', NULL),
  ('SO', 'Somalie', 'Somalia', 'Afrique de l''Est', 'Afrique', 5.1521, 46.1996, 'Mogadiscio', 'so', '["so","ar"]', NULL),
  ('ZA', 'Afrique du Sud', 'South Africa', 'Afrique australe', 'Afrique', -30.5595, 22.9375, 'Pretoria', 'af', '["af","en","zu","xh","nr","st","tn","ts","ss","ve","nso"]', NULL),
  ('SS', 'Soudan du Sud', 'South Sudan', 'Afrique de l''Est', 'Afrique', 6.8770, 31.3070, 'Djouba', 'en', '["en"]', NULL),
  ('SD', 'Soudan', 'Sudan', 'Afrique du Nord', 'Afrique', 12.8628, 30.2176, 'Khartoum', 'ar', '["ar","en"]', NULL),
  ('TZ', 'Tanzanie', 'Tanzania', 'Afrique de l''Est', 'Afrique', -6.3690, 34.8888, 'Dodoma', 'sw', '["sw","en"]', NULL),
  ('TG', 'Togo', 'Togo', 'Afrique de l''Ouest', 'Afrique', 8.6195, 0.8248, 'Lomé', 'fr', '["fr"]', NULL),
  ('TN', 'Tunisie', 'Tunisia', 'Afrique du Nord', 'Afrique', 33.8869, 9.5375, 'Tunis', 'ar', '["ar","fr"]', NULL),
  ('UG', 'Ouganda', 'Uganda', 'Afrique de l''Est', 'Afrique', 1.3733, 32.2903, 'Kampala', 'en', '["en","sw"]', NULL),
  ('EH', 'Sahara occidental', 'Western Sahara', 'Afrique du Nord', 'Afrique', 24.2155, -12.8858, 'Laâyoune', 'ar', '["ar","es"]', NULL),
  ('ZM', 'Zambie', 'Zambia', 'Afrique australe', 'Afrique', -13.1339, 27.8493, 'Lusaka', 'en', '["en"]', NULL),
  ('ZW', 'Zimbabwe', 'Zimbabwe', 'Afrique australe', 'Afrique', -19.0154, 29.1549, 'Harare', 'en', '["en","sn","nd"]', NULL);

-- Note : Pour l'Afrique du Sud (ZA), les langues officielles sont nombreuses (11). Nous avons mis un exemple simplifié.
-- Les colonnes `official_language` et `working_languages` peuvent être ajustées selon vos besoins précis.

-- Global CMS data ------------------------------------------------------------
insert into auth.users (id, aud, email, email_confirmed_at, created_at, updated_at)
values 
  ('00000000-0000-0000-0000-000000000001', 'authenticated', 'seed@udc.local', now(), now(), now());

insert into public.site_settings (key, value) values
  ('platform_name', '{"fr":"UDC • Union Africaine des Télécommunications","en":"UDC • African Telecommunications Union"}'),
  ('hero', '{"fr":{"title":"Connecter l''Afrique","subtitle_highlight":"Ensemble","description":"Une plateforme panafricaine pour coordonner les projets d''inclusion numérique et diffuser les meilleures pratiques du Service Universel."},"en":{"title":"Connecting Africa","subtitle_highlight":"Together","description":"A pan-African platform to coordinate digital inclusion initiatives and share Universal Service best practices."}}'),
  ('hero_cta', '{"fr":"Explorer le réseau","en":"Explore the network"}');

  


  INSERT INTO public.navigation_items (href, location, label, sort_order, user_role, reference, parent, is_visible, is_external, icon, description) VALUES 
  ('/events', 'header', '{"ar": "الجدول الزمني", "en": "Agenda", "fr": "Agenda", "pt": "Agenda"}', '5', '["public","reader"]', 'events', null, 'true', 'false', null, null), 
  ('/events-calendar', 'header', '{"ar": "تقويم", "en": "Calendar", "fr": "Calendrier", "pt": "Calendário"}', '0', '["public","reader"]', 'events-calendar', 'events', 'true', 'false', null, null), 
  ('/events?cmdt25=true', 'header', '{"ar": "CMDT-25", "en": "CMDT-25", "fr": "CMDT-25", "pt": "CMDT-25"}', '1', '["public","reader"]', 'events?cmdt25=true', 'events', 'true', 'false', null, null),  
  ('/projects', 'header', '{"ar": "مشاريع الخدمة الشاملة", "en": "FSU Projects", "fr": "Projets", "pt": "Projetos FSU"}', '1', '["public","reader"]', 'projects', null, 'true', 'false', null, null), 
  ('/projects', 'header', '{"ar": "قائمة المشاريع", "en": "FSU Projects", "fr": "Liste des Projets", "pt": "Projetos FSU"}', '1', '["public","reader"]', 'project-view', 'projects', 'true', 'false', null, null), 
  ('/map', 'header', '{"ar": "الخريطة التفاعلية", "en": "Interactive Map", "fr": "Carte Interactive", "pt": "Mapa interativo"}', '0', '["public","reader"]', 'map', 'projects', 'true', 'false', null, 'Par région/pays/statut'),
  ('/my-contributions', 'header', '{"ar": "مشاريعي", "en": "My Projects", "fr": "Mes Projets", "pt": "Os meus projetos"}', '2', '["public","reader"]', 'my-contributions', 'projects', 'true', 'false', null, null),
  ('/', 'header', '{"ar": "الرئيسية", "en": "Home", "fr": "Accueil", "pt": "Início"}', '0', '["public","reader"]', 'home', null, 'true', 'false', null, null), 
  ('/', 'header', '{"ar": "الرئيسية", "en": "Home", "fr": "Accueil", "pt": "Início"}', '0', '["public","reader"]', 'public-home', 'home', 'true', 'false', null, 'Vue d''ensemble dynamique'), 
  ('/about', 'header', '{"ar": "عن", "en": "About", "fr": "A Propos", "pt": "Sobre"}', '0', '["public","reader"]', 'about', 'home', 'true', 'false', null, 'Mot de la DG ANSUT et du SG UAT'), 
  ('/public-dashboard', 'header', '{"ar": "لوحة القيادة", "en": "Dashboard", "fr": "Tableau de Bord", "pt": "Painel"}', '7', '["public","reader"]', 'public-dashboard', null, 'false', 'false', null, null), 
  ('/resources', 'header', '{"ar": "الموارد", "en": "Resources", "fr": "Ressources", "pt": "Recursos"}', '2', '["public","reader"]', 'resources', null, 'true', 'false', null, null), 
  ('/strategies', 'header', '{"ar": "السياسات والأطر", "en": "Policies & Frameworks", "fr": "Politiques & Cadres", "pt": "Políticas e Estruturas"}', '1', '["public","reader"]', 'strategies', 'resources', 'true', 'false', null, null), 
  ('/resources', 'header', '{"ar": "مكتبة", "en": "Library", "fr": "Bibliothèque", "pt": "Biblioteca"}', '0', '["public","reader"]', 'library', 'resources', 'true', 'false', null, null), 
  ('/agency-documents', 'header', '{"ar": "القوالب والنماذج", "en": "Templates & Forms", "fr": "Modèles & Formulaires", "pt": "Modelos e formulários"}', '2', '["public","reader"]', 'agency-documents', 'resources', 'true', 'false', null, null), 
  ('/watch', 'header', '{"ar": "المراقبة", "en": "Watch", "fr": "Veille", "pt": "Vigilância"}', '6', '["public","reader"]', 'watch', null, 'true', 'false', null, null), 
  ('/watch', 'header', '{"ar": "أخبار", "en": "News", "fr": "Actualités", "pt": "Notícias"}', '0', '["public","reader"]', 'news-watch', 'watch', 'true', 'false', null, null), 
  ('/watch', 'header', '{"ar": "تغذية آر إس إس", "en": "RSS feed", "fr": "Flux RSS", "pt": "Feed RSS"}', '1', '["public","reader"]', 'rss-watch', 'watch', 'true', 'false', null, null), 
  ('/forum', 'header', '{"ar": "المجتمع", "en": "Community", "fr": "Communauté", "pt": "Comunidade"}', '3', '["public","reader"]', 'forum', null, 'true', 'false', null, null), 
  ('/members', 'header', '{"ar": "دليل", "en": "Members", "fr": "Annuaire", "pt": "Diretório"}', '1', '["public","reader"]', 'directory', 'forum', 'true', 'false', null, null), 
  ('/coauthoring', 'header', '{"ar": "التأليف المشترك", "en": "Co-authoring", "fr": "Co-rédaction", "pt": "Coautoria"}', '2', '["public","reader"]', 'coauthoring', 'forum', 'true', 'false', null, null), 
  ('/forum', 'header', '{"ar": "منتدى المناقشة", "en": "Discussion Forum", "fr": "Forum de Discussion", "pt": "Fórum de discussão"}', '0', '["public","reader"]', 'forum-view', 'forum', 'true', 'false', null, null), 
  ('/elearning', 'header', '{"ar": "التدريب", "en": "Training", "fr": "Formation", "pt": "Formação"}', '4', '["public","reader"]', 'elearning', null, 'true', 'false', null, null), 
  ('/elearning', 'header', '{"ar": "التعلم الإلكتروني", "en": "E-Learning", "fr": "E-Learning", "pt": "E-Learning"}', '1', '["public","reader"]', 'elearning-view', 'elearning', 'true', 'false', null, null), 
  ('/catalog', 'header', '{"ar": "كتالوج", "en": "Catalog", "fr": "Catalogue", "pt": "Catálogo"}', '0', '["public","reader"]', 'catalog', 'elearning', 'true', 'false', null, null), 
  ('/registrations-elearning', 'header', '{"ar": "تسجيلاتي", "en": "My Registrations", "fr": "Mes Inscriptions", "pt": "Minhas Inscrições"}', '2', '["public","reader"]', 'registrations-elearning', 'elearning', 'true', 'false', null, null), 
  
  ('/admin-dashbord', 'admin', '{"ar": "لوحة القيادة", "en": "Dashboard", "fr": "Tableau de Bord", "pt": "Painel"}', '0', '["public","reader"]', 'admin-dashbord', null, 'true', 'false', null, null),
  ('/admin-users', 'admin', '{"ar": "إدارة المستخدم", "en": "User management", "fr": "Gestion des utilisateurs", "pt": "Gestão de usuários"}', '1', '["public","reader"]', 'admin-users', null, 'true', 'false', null, 'Gestion des utilisateurs (CRUD)'),
  ('/admin-focal-points', 'admin', '{"ar": "نقاط التركيز", "en": "Focal points", "fr": "Points focaux", "pt": "Pontos focais"}', '2', '["public","reader"]', 'admin-focal-points', null, 'true', 'false', null, 'Répertoire des contacts par agence/pays'),
  ('/admin-contents', 'admin', '{"ar": "محتويات", "en": "Contents", "fr": "Contenus", "pt": "Conteúdo"}', '3', '["public","reader"]', 'admin-contents', null, 'true', 'false', null, null),
  ('/admin-editorial', 'admin', '{"ar": "افتتاحية", "en": "Editorial", "fr": "Editoriale", "pt": "Editorial"}', '0', '["public","reader"]', 'admin-editorial', 'admin-contents', 'true', 'false', null, 'Workflow de validation éditoriale'),
  ('/admin-library', 'admin', '{"ar": "إدارة المكتبة", "en": "Library Management", "fr": "Gestion Bibliothèque", "pt": "Gestão de Biblioteca"}', '1', '["public","reader"]', 'admin-library', 'admin-contents', 'true', 'false', null, 'Gestion bibliothèque (upload, versions, archive)'),
  ('/admin-co-authorship', 'admin', '{"ar": "التأليف المشترك", "en": "Co-authorship", "fr": "Co-rédations", "pt": "Coautoria"}', '2', '["public","reader"]', 'admin-co-authorship', 'admin-contents', 'true', 'false', null, 'Validation co-rédactions & documents stratégiques'),
  ('/admin-publications', 'admin', '{"ar": "المنشورات", "en": "Publications", "fr": "Publications", "pt": "Publicações"}', '3', '["public","reader"]', 'admin-publications', 'admin-contents', 'true', 'false', null, 'Planification publications Actualités & newsletters'),
  ('/admin-moderation', 'admin', '{"ar": "الاعتدال", "en": "Moderation", "fr": "Modération", "pt": "Moderação"}', '4', '["public","reader"]', 'admin-moderation', null, 'true', 'false', null, null),
  ('/admin-forums', 'admin', '{"ar": "المنتديات", "en": "Forums", "fr": "Forums", "pt": "Fóruns"}', '0', '["public","reader"]', 'admin-forums', 'admin-moderation', 'true', 'false', null, 'Modérer commentaires & discussions'),
  ('/admin-reported-content', 'admin', '{"ar": "المحتوى المبلغ عنه", "en": "Reported Content", "fr": "Contenus signalés", "pt": "Conteúdo denunciado"}', '1', '["public","reader"]', 'admin-reported-content', 'admin-moderation', 'true', 'false', null, 'Gestion des contenus signalés par utilisateurs'),
  ('/admin-blockages', 'admin', '{"ar": "الانسدادات", "en": "Blockages", "fr": "Blocages", "pt": "Bloqueios"}', '2', '["public","reader"]', 'admin-blockages', 'admin-moderation', 'true', 'false', null, 'Suspension utilisateurs/contenus non conformes'),
  ('/admin-training', 'admin', '{"ar": "تمرين", "en": "Training", "fr": "Formation", "pt": "Treinamento"}', '5', '["public","reader"]', 'admin-training', null, 'true', 'false', null, null),
  ('/admin-catalog', 'admin', '{"ar": "كتالوج", "en": "Catalog", "fr": "Catalogue", "pt": "Catálogo"}', '0', '["public","reader"]', 'admin-catalog', 'admin-training', 'true', 'false', null, 'Créer/modifier formations & webinaires'),
  ('/admin-certifications', 'admin', '{"ar": "الشهادات", "en": "Certifications", "fr": "Certifications", "pt": "Certificações"}', '1', '["public","reader"]', 'admin-certifications', 'admin-training', 'true', 'false', null, 'Générer/valider attestations'),
  ('/admin-statistics', 'admin', '{"ar": "إحصائيات", "en": "Statistics", "fr": "Statistiques", "pt": "Estatísticas"}', '6', '["public","reader"]', 'admin-statistics', null, 'true', 'false', null, 'Consultations, téléchargements, interactions'),
  ('/admin-calendar', 'admin', '{"ar": "تقويم", "en": "Calendar", "fr": "Calendrier", "pt": "Calendário"}', '7', '["public","reader"]', 'admin-calendar', null, 'true', 'false', null, null),
  ('/admin-events', 'admin', '{"ar": "الأحداث", "en": "Events", "fr": "Événements", "pt": "Eventos"}', '0', '["public","reader"]', 'admin-events', 'admin-calendar', 'true', 'false', null, 'Créer/modifier événements & deadlines'),
  ('/admin-cmdt-25', 'admin', '{"ar": "CMDT-25", "en": "CMDT-25", "fr": "CMDT-25", "pt": "CMDT-25"}', '1', '["public","reader"]', 'admin-cmdt-25', 'admin-calendar', 'true', 'false', null, 'Gestion spécifique des échéances CMDT'),
  ('/admin-reminders', 'admin', '{"ar": "تذكيرات", "en": "Reminders", "fr": "Rappels", "pt": "Lembretes"}', '2', '["public","reader"]', 'admin-reminders', 'admin-calendar', 'true', 'false', null, 'Configuration notifications automatiques'),
  ('/admin-monitoring', 'admin', '{"ar": "يراقب", "en": "Reminders", "fr": "Surveillance", "pt": "Monitorização"}', '8', '["public","reader"]', 'admin-monitoring', null, 'true', 'false', null, 'Configurer règles d''alertes personnalisées'),
  ('/admin-apis-integrations', 'admin', '{"ar": "واجهات برمجة التطبيقات والتكاملات", "en": "APIs & Integrations", "fr": "API & Intégrations", "pt": "APIs e integrações"}', '9', '["public","reader"]', 'admin-apis-integrations', null, 'true', 'false', null, null),
  ('/admin-mapping', 'admin', '{"ar": "رسم الخرائط", "en": "Mapping", "fr": "Cartographie", "pt": "Mapeamento"}', '0', '["public","reader"]', 'admin-mapping', 'admin-apis-integrations', 'true', 'false', null, 'Configuration API maps (Leaflet/Mapbox)'),
  ('/admin-connectors', 'admin', '{"ar": "موصلات", "en": "Connectors", "fr": "Connecteurs", "pt": "Conectores"}', '1', '["public","reader"]', 'admin-connectors', 'admin-apis-integrations', 'true', 'false', null, 'Services externes (stats, veille, SSO)'),
  ('/admin-support', 'admin', '{"ar": "يدعم", "en": "Support", "fr": "Support", "pt": "Apoiar"}', '10', '["public","reader"]', 'admin-support', null, 'true', 'false', null, null),
  ('/admin-internal-messaging', 'admin', '{"ar": "الرسائل الداخلية", "en": "Internal messaging", "fr": "Messagerie interne", "pt": "Mensagens internas"}', '0', '["public","reader"]', 'admin-internal-messaging', 'admin-support', 'true', 'false', null, 'Communication admin - utilisateurs'),
  ('/admin-tickets', 'admin', '{"ar": "التذاكر", "en": "Tickets", "fr": "Tickets", "pt": "Ingressos"}', '1', '["public","reader"]', 'admin-tickets', 'admin-support', 'true', 'false', null, 'Gestion des signalements d''anomalies'),
  ('/admin-faq', 'admin', '{"ar": "الأسئلة الشائعة", "en": "FAQ", "fr": "FAQ", "pt": "Perguntas frequentes"}', '2', '["public","reader"]', 'admin-faq', 'admin-support', 'true', 'false', null, 'Gestion base de connaissances support'),
  ('/admin-settings', 'admin', '{"ar": "إعدادات", "en": "Settings", "fr": "Paramètres", "pt": "Configurações"}', '11', '["public","reader"]', 'admin-settings', null, 'true', 'false', null, null),
  ('/admin-global', 'admin', '{"ar": "إجمالي", "en": "Global", "fr": "Général", "pt": "Geral"}', '0', '["public","reader"]', 'admin-global', 'admin-settings', 'true', 'false', null, 'Nom plateforme, logos, couleurs, langues'),
  ('/admin-security', 'admin', '{"ar": "حماية", "en": "Security", "fr": "Sécurité", "pt": "Segurança"}', '1', '["public","reader"]', 'admin-security', 'admin-settings', 'true', 'false', null, 'Chiffrement, sessions, 2FA, logs'),
  ('/admin-backups', 'admin', '{"ar": "النسخ الاحتياطية", "en": "Backups", "fr": "Sauvegardes", "pt": "Cópias de segurança"}', '2', '["public","reader"]', 'admin-backups', 'admin-settings', 'true', 'false', null, 'Configuration backups & restauration'),
  ('/admin-rgpd', 'admin', '{"ar": "اللائحة العامة لحماية البيانات", "en": "RGPD", "fr": "RGPD", "pt": "RGPD"}', '3', '["public","reader"]', 'admin-rgpd', 'admin-settings', 'true', 'false', null, 'Conformité, droit à l''oubli, export données');



insert into public.homepage_content_blocks (block_key, content_fr, content_en, sort_order, is_visible) values
  ('hero', 
    '{"title":"Connecter l''Afrique","subtitle_highlight":"Ensemble","description":"Une plateforme panafricaine pour coordonner les projets d''inclusion numérique et diffuser les meilleures pratiques du Service Universel.","cta_text":"Explorer le réseau","cta_url":"/network"}',
    '{"title":"Connecting Africa","subtitle_highlight":"Together","description":"A pan-African platform to coordinate digital inclusion initiatives and share Universal Service best practices.","cta_text":"Explore the network","cta_url":"/network"}',
    0,
    true
  );

insert into public.agencies (id, name, acronym, country, region, website_url, description, contact_email, established_date) values
  ('00000000-0000-0000-0000-000000000010', 'Agence Nationale du Service Universel (ANSUT)', 'ANSUT', 'Côte d''Ivoire', 'cedeao', 'https://www.ansut.ci', 'Coordonne les programmes d''accès universel et les investissements en Côte d''Ivoire.', 'secretariat@ansut.ci', '2002-02-17'),
  ('00000000-0000-0000-0000-000000000011', 'Union Africaine des Télécommunications (UAT)', 'UAT', 'Éthiopie', 'uma', 'https://www.itu.int', 'Mandatée pour piloter la stratégie numérique continentale.', 'contact@uat.africa', '1997-01-01'),
  ('00000000-0000-0000-0000-000000000012', 'Agence Tunisienne du Développement des Télécommunications (ATDT)', 'ATDT', 'Tunisie', 'uma', 'https://www.mtc.tn', 'Déploie des plateformes de connectivité éducative et de santé.', 'info@atdt.tn', '2004-07-11');

insert into public.agency_projects (id, agency_id, title, description, status, budget, beneficiaries, start_date, end_date, completion_percentage, tags, location, source_url, metadata, created_at, last_updated_at, sync_status) values
  ('00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000010', 'Villages connectés Phase II', 'Mise à niveau des infrastructures ICT dans 120 villages en Côte d''Ivoire.', 'active', 12500000, 350000, '2025-06-01', '2025-12-31', 65, '["connectivity","villages"]', 'Côte d''Ivoire', 'https://example.org/projects/villages-connectes', '{"villages_connected": 120, "jobs_created": 450}', '2024-01-05T00:00:00+00', now(), 'synced'),
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000011', 'Observatoire numérique africain', 'Collecte et analyse des indicateurs FSU pour 15 pays.', 'active', 22000000, 780000, '2024-09-15', '2026-03-01', 80, '["data","observatory"]', 'Afrique', 'https://example.org/projects/observatoire', '{"villages_connected": 0, "jobs_created": 820}', '2024-03-10T00:00:00+00', now(), 'synced'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000012', 'Campus numérique Tunisie', 'Équipement de 80 campus ruraux avec plateformes d''apprentissage.', 'in_progress', 8400000, 210000, '2025-01-10', '2026-08-20', 45, '["education","campus"]', 'Tunisie', 'https://example.org/projects/campus-tunisie', '{"villages_connected": 40, "jobs_created": 200}', '2024-05-20T00:00:00+00', now(), 'synced'),
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000011', 'Clinics numériques régionales', 'Déploiement de centres de télémédecine pour 42 districts.', 'in_progress', 9600000, 260000, '2024-10-01', '2025-04-30', 52, '["telemedicine"]', 'Afrique de l''Est', 'https://example.org/projects/digital-clinics', '{"villages_connected": 0, "jobs_created": 210}', '2024-07-08T00:00:00+00', now(), 'synced'),
  ('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000010', 'Échange de données e-gouvernement', 'Plateforme de data sharing pour les régulateurs.', 'active', 4300000, 130000, '2024-11-10', '2025-03-15', 72, '["e-government","data"]', 'Afrique', 'https://example.org/projects/data-exchange', '{"villages_connected": 0, "jobs_created": 190}', '2024-09-14T00:00:00+00', now(), 'synced'),
  ('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000012', 'Laboratoires connectés ruraux', 'Pôles d''innovation pour 60 villages pilotes.', 'planned', 5100000, 95000, '2025-02-01', '2025-09-30', 30, '["connectivity","villages"]', 'Afrique du Nord', 'https://example.org/projects/rural-labs', '{"villages_connected": 60, "jobs_created": 160}', '2024-11-02T00:00:00+00', now(), 'synced');

insert into public.events (id, title, description, start_date, end_date, location, is_virtual, max_attendees, current_attendees, created_by) values
  ('00000000-0000-0000-0000-000000010001', 'Forum Régional USF', 'Rencontre régionale pour co-construire les feuilles de route 2026', '2025-11-15T09:00:00+00', '2025-11-17T17:00:00+00', 'Abidjan, Côte d\''Ivoire', false, 250, 180, '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000010002', 'Atelier Données Ouvertes', 'Session hands-on pour ouvrir les jeux de données FSU.', '2025-12-08T10:00:00+00', '2025-12-08T16:00:00+00', 'Nairobi, Kenya', false, 120, 94, '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000010003', 'Conférence Annuelle UDC', 'Point de synthèse annuel sur l''impact du réseau.', '2026-01-20T09:00:00+00', '2026-01-22T16:00:00+00', 'Dakar, Sénégal', false, 350, 220, '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000010004', 'Forum Innovation Numérique', 'Exploration des outils d''IA pour l''inclusion.', '2026-03-15T08:30:00+00', '2026-03-16T18:00:00+00', 'Casablanca, Maroc', false, 180, 60, '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000010005', 'Bootcamp Smart Villages', 'Ateliers pratiques pour accélérer les villages intelligents.', '2026-04-08T09:00:00+00', '2026-04-10T17:00:00+00', 'Kigali, Rwanda', false, 150, 30, '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000010006', 'Sommet Connectivité Éducation', 'Tables rondes sur les infrastructures scolaires.', '2026-05-22T09:00:00+00', '2026-05-23T15:00:00+00', 'Niamey, Niger', false, 200, 45, '00000000-0000-0000-0000-000000000001');