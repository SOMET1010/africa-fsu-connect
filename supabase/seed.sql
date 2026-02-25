-- Seed: insertion de tous les pays d'Afrique
-- Basé sur la liste des États membres de l'Union africaine + Sahara occidental

INSERT INTO public.countries
  (code, name_fr, name_en, region, continent, latitude, longitude, capital_city, official_language, working_languages, sutel_community)
VALUES
  ('DZ', 'Algérie', 'Algeria', 'Afrique du Nord', 'Afrique', 28.0339, 1.6596, 'Alger', 'ar', ARRAY['ar','fr'], NULL),
  ('AO', 'Angola', 'Angola', 'Afrique centrale', 'Afrique', -11.2027, 17.8739, 'Luanda', 'pt', ARRAY['pt'], NULL),
  ('BJ', 'Bénin', 'Benin', 'Afrique de l''Ouest', 'Afrique', 9.3077, 2.3158, 'Porto-Novo', 'fr', ARRAY['fr'], NULL),
  ('BW', 'Botswana', 'Botswana', 'Afrique australe', 'Afrique', -22.3285, 24.6849, 'Gaborone', 'en', ARRAY['en'], NULL),
  ('BF', 'Burkina Faso', 'Burkina Faso', 'Afrique de l''Ouest', 'Afrique', 12.2383, -1.5616, 'Ouagadougou', 'fr', ARRAY['fr'], NULL),
  ('BI', 'Burundi', 'Burundi', 'Afrique de l''Est', 'Afrique', -3.3731, 29.9189, 'Gitega', 'rn', ARRAY['rn','fr'], NULL),
  ('CM', 'Cameroun', 'Cameroon', 'Afrique centrale', 'Afrique', 7.3697, 12.3547, 'Yaoundé', 'fr', ARRAY['fr','en'], NULL),
  ('CV', 'Cap-Vert', 'Cape Verde', 'Afrique de l''Ouest', 'Afrique', 16.5388, -23.0418, 'Praia', 'pt', ARRAY['pt'], NULL),
  ('CF', 'République centrafricaine', 'Central African Republic', 'Afrique centrale', 'Afrique', 6.6111, 20.9394, 'Bangui', 'fr', ARRAY['fr'], NULL),
  ('TD', 'Tchad', 'Chad', 'Afrique centrale', 'Afrique', 15.4542, 18.7322, 'N''Djaména', 'fr', ARRAY['fr','ar'], NULL),
  ('KM', 'Comores', 'Comoros', 'Afrique de l''Est', 'Afrique', -11.8750, 43.8722, 'Moroni', 'ar', ARRAY['ar','fr'], NULL),
  ('CG', 'Congo', 'Congo', 'Afrique centrale', 'Afrique', -0.2280, 15.8277, 'Brazzaville', 'fr', ARRAY['fr'], NULL),
  ('CD', 'République démocratique du Congo', 'Democratic Republic of the Congo', 'Afrique centrale', 'Afrique', -4.0383, 21.7587, 'Kinshasa', 'fr', ARRAY['fr'], NULL),
  ('CI', 'Côte d''Ivoire', 'Ivory Coast', 'Afrique de l''Ouest', 'Afrique', 7.5400, -5.5471, 'Yamoussoukro', 'fr', ARRAY['fr'], NULL),
  ('DJ', 'Djibouti', 'Djibouti', 'Afrique de l''Est', 'Afrique', 11.8251, 42.5903, 'Djibouti', 'fr', ARRAY['fr','ar'], NULL),
  ('EG', 'Égypte', 'Egypt', 'Afrique du Nord', 'Afrique', 26.8206, 30.8025, 'Le Caire', 'ar', ARRAY['ar'], NULL),
  ('GQ', 'Guinée équatoriale', 'Equatorial Guinea', 'Afrique centrale', 'Afrique', 1.6508, 10.2679, 'Malabo', 'es', ARRAY['es','fr'], NULL),
  ('ER', 'Érythrée', 'Eritrea', 'Afrique de l''Est', 'Afrique', 15.1794, 39.7823, 'Asmara', 'ti', ARRAY['ti','ar','en'], NULL),
  ('SZ', 'Eswatini', 'Eswatini', 'Afrique australe', 'Afrique', -26.5225, 31.4659, 'Mbabane', 'en', ARRAY['en','ss'], NULL),
  ('ET', 'Éthiopie', 'Ethiopia', 'Afrique de l''Est', 'Afrique', 9.1450, 40.4897, 'Addis-Abeba', 'am', ARRAY['am'], NULL),
  ('GA', 'Gabon', 'Gabon', 'Afrique centrale', 'Afrique', -0.8037, 11.6094, 'Libreville', 'fr', ARRAY['fr'], NULL),
  ('GM', 'Gambie', 'Gambia', 'Afrique de l''Ouest', 'Afrique', 13.4432, -15.3101, 'Banjul', 'en', ARRAY['en'], NULL),
  ('GH', 'Ghana', 'Ghana', 'Afrique de l''Ouest', 'Afrique', 7.9465, -1.0232, 'Accra', 'en', ARRAY['en'], NULL),
  ('GN', 'Guinée', 'Guinea', 'Afrique de l''Ouest', 'Afrique', 9.9456, -9.6966, 'Conakry', 'fr', ARRAY['fr'], NULL),
  ('GW', 'Guinée-Bissau', 'Guinea-Bissau', 'Afrique de l''Ouest', 'Afrique', 11.8037, -15.1804, 'Bissau', 'pt', ARRAY['pt'], NULL),
  ('KE', 'Kenya', 'Kenya', 'Afrique de l''Est', 'Afrique', -0.0236, 37.9062, 'Nairobi', 'en', ARRAY['en','sw'], NULL),
  ('LS', 'Lesotho', 'Lesotho', 'Afrique australe', 'Afrique', -29.6100, 28.2336, 'Maseru', 'en', ARRAY['en','st'], NULL),
  ('LR', 'Libéria', 'Liberia', 'Afrique de l''Ouest', 'Afrique', 6.4281, -9.4295, 'Monrovia', 'en', ARRAY['en'], NULL),
  ('LY', 'Libye', 'Libya', 'Afrique du Nord', 'Afrique', 26.3351, 17.2283, 'Tripoli', 'ar', ARRAY['ar'], NULL),
  ('MG', 'Madagascar', 'Madagascar', 'Afrique de l''Est', 'Afrique', -18.7669, 46.8691, 'Antananarivo', 'mg', ARRAY['mg','fr'], NULL),
  ('MW', 'Malawi', 'Malawi', 'Afrique australe', 'Afrique', -13.2543, 34.3015, 'Lilongwe', 'en', ARRAY['en','ny'], NULL),
  ('ML', 'Mali', 'Mali', 'Afrique de l''Ouest', 'Afrique', 17.5707, -3.9962, 'Bamako', 'fr', ARRAY['fr'], NULL),
  ('MR', 'Mauritanie', 'Mauritania', 'Afrique de l''Ouest', 'Afrique', 21.0079, -10.9408, 'Nouakchott', 'ar', ARRAY['ar','fr'], NULL),
  ('MU', 'Maurice', 'Mauritius', 'Afrique de l''Est', 'Afrique', -20.3484, 57.5522, 'Port-Louis', 'en', ARRAY['en','fr'], NULL),
  ('MA', 'Maroc', 'Morocco', 'Afrique du Nord', 'Afrique', 31.7917, -7.0926, 'Rabat', 'ar', ARRAY['ar','fr'], NULL),
  ('MZ', 'Mozambique', 'Mozambique', 'Afrique australe', 'Afrique', -18.6657, 35.5296, 'Maputo', 'pt', ARRAY['pt'], NULL),
  ('NA', 'Namibie', 'Namibia', 'Afrique australe', 'Afrique', -22.9576, 18.4904, 'Windhoek', 'en', ARRAY['en'], NULL),
  ('NE', 'Niger', 'Niger', 'Afrique de l''Ouest', 'Afrique', 17.6078, 8.0817, 'Niamey', 'fr', ARRAY['fr'], NULL),
  ('NG', 'Nigeria', 'Nigeria', 'Afrique de l''Ouest', 'Afrique', 9.0820, 8.6753, 'Abuja', 'en', ARRAY['en'], NULL),
  ('RW', 'Rwanda', 'Rwanda', 'Afrique de l''Est', 'Afrique', -1.9403, 29.8739, 'Kigali', 'rw', ARRAY['rw','fr','en'], NULL),
  ('ST', 'Sao Tomé-et-Principe', 'Sao Tome and Principe', 'Afrique centrale', 'Afrique', 0.1864, 6.6131, 'São Tomé', 'pt', ARRAY['pt'], NULL),
  ('SN', 'Sénégal', 'Senegal', 'Afrique de l''Ouest', 'Afrique', 14.4974, -14.4524, 'Dakar', 'fr', ARRAY['fr'], NULL),
  ('SC', 'Seychelles', 'Seychelles', 'Afrique de l''Est', 'Afrique', -4.6796, 55.4920, 'Victoria', 'fr', ARRAY['fr','en'], NULL),
  ('SL', 'Sierra Leone', 'Sierra Leone', 'Afrique de l''Ouest', 'Afrique', 8.4606, -11.7799, 'Freetown', 'en', ARRAY['en'], NULL),
  ('SO', 'Somalie', 'Somalia', 'Afrique de l''Est', 'Afrique', 5.1521, 46.1996, 'Mogadiscio', 'so', ARRAY['so','ar'], NULL),
  ('ZA', 'Afrique du Sud', 'South Africa', 'Afrique australe', 'Afrique', -30.5595, 22.9375, 'Pretoria', 'af', ARRAY['af','en','zu','xh','nr','st','tn','ts','ss','ve','nso'], NULL),
  ('SS', 'Soudan du Sud', 'South Sudan', 'Afrique de l''Est', 'Afrique', 6.8770, 31.3070, 'Djouba', 'en', ARRAY['en'], NULL),
  ('SD', 'Soudan', 'Sudan', 'Afrique du Nord', 'Afrique', 12.8628, 30.2176, 'Khartoum', 'ar', ARRAY['ar','en'], NULL),
  ('TZ', 'Tanzanie', 'Tanzania', 'Afrique de l''Est', 'Afrique', -6.3690, 34.8888, 'Dodoma', 'sw', ARRAY['sw','en'], NULL),
  ('TG', 'Togo', 'Togo', 'Afrique de l''Ouest', 'Afrique', 8.6195, 0.8248, 'Lomé', 'fr', ARRAY['fr'], NULL),
  ('TN', 'Tunisie', 'Tunisia', 'Afrique du Nord', 'Afrique', 33.8869, 9.5375, 'Tunis', 'ar', ARRAY['ar','fr'], NULL),
  ('UG', 'Ouganda', 'Uganda', 'Afrique de l''Est', 'Afrique', 1.3733, 32.2903, 'Kampala', 'en', ARRAY['en','sw'], NULL),
  ('EH', 'Sahara occidental', 'Western Sahara', 'Afrique du Nord', 'Afrique', 24.2155, -12.8858, 'Laâyoune', 'ar', ARRAY['ar','es'], NULL),
  ('ZM', 'Zambie', 'Zambia', 'Afrique australe', 'Afrique', -13.1339, 27.8493, 'Lusaka', 'en', ARRAY['en'], NULL),
  ('ZW', 'Zimbabwe', 'Zimbabwe', 'Afrique australe', 'Afrique', -19.0154, 29.1549, 'Harare', 'en', ARRAY['en','sn','nd'], NULL);

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

insert into public.navigation_items (href, location, label, sort_order, is_visible, is_external) values
  ('/', 'header', '{"fr":"Accueil","en":"Home"}', 0, true, false),
  ('/network', 'header', '{"fr":"Réseau","en":"Network"}', 1, true, false),
  ('/projects', 'header', '{"fr":"Collaborer","en":"Collaborate"}', 2, true, false),
  ('/elearning', 'header', '{"fr":"Apprendre","en":"Learn"}', 3, true, false),
  ('/about', 'header', '{"fr":"À propos","en":"About"}', 4, true, false);

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

insert into public.agency_projects (id, agency_id, title, description, status, budget, beneficiaries, start_date, end_date, completion_percentage, tags, location, source_url, metadata, created_at, last_updated_at, sync_status)
values
  ('00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000010', 'Villages connectés Phase II', 'Mise à niveau des infrastructures ICT dans 120 villages en Côte d''Ivoire.', 'active', 12500000, 350000, '2025-06-01', '2025-12-31', 65, array['connectivity','villages'], 'Côte d''Ivoire', 'https://example.org/projects/villages-connectes', '{"villages_connected": 120, "jobs_created": 450}', '2024-01-05T00:00:00+00', now(), 'synced'),
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000011', 'Observatoire numérique africain', 'Collecte et analyse des indicateurs FSU pour 15 pays.', 'active', 22000000, 780000, '2024-09-15', '2026-03-01', 80, array['data','observatory'], 'Afrique', 'https://example.org/projects/observatoire', '{"villages_connected": 0, "jobs_created": 820}', '2024-03-10T00:00:00+00', now(), 'synced'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000012', 'Campus numérique Tunisie', 'Équipement de 80 campus ruraux avec plateformes d''apprentissage.', 'in_progress', 8400000, 210000, '2025-01-10', '2026-08-20', 45, array['education','campus'], 'Tunisie', 'https://example.org/projects/campus-tunisie', '{"villages_connected": 40, "jobs_created": 200}', '2024-05-20T00:00:00+00', now(), 'synced'),
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000011', 'Clinics numériques régionales', 'Déploiement de centres de télémédecine pour 42 districts.', 'in_progress', 9600000, 260000, '2024-10-01', '2025-04-30', 52, array['telemedicine'], 'Afrique de l''Est', 'https://example.org/projects/digital-clinics', '{"villages_connected": 0, "jobs_created": 210}', '2024-07-08T00:00:00+00', now(), 'synced'),
  ('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000010', 'Échange de données e-gouvernement', 'Plateforme de data sharing pour les régulateurs.', 'active', 4300000, 130000, '2024-11-10', '2025-03-15', 72, array['e-government','data'], 'Afrique', 'https://example.org/projects/data-exchange', '{"villages_connected": 0, "jobs_created": 190}', '2024-09-14T00:00:00+00', now(), 'synced'),
  ('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000012', 'Laboratoires connectés ruraux', 'Pôles d''innovation pour 60 villages pilotes.', 'planned', 5100000, 95000, '2025-02-01', '2025-09-30', 30, array['connectivity','villages'], 'Afrique du Nord', 'https://example.org/projects/rural-labs', '{"villages_connected": 60, "jobs_created": 160}', '2024-11-02T00:00:00+00', now(), 'synced');

insert into public.events (id, title, description, start_date, end_date, location, is_virtual, max_attendees, current_attendees, created_by)
values
  ('00000000-0000-0000-0000-000000010001', 'Forum Régional USF', 'Rencontre régionale pour co-construire les feuilles de route 2026', '2025-11-15T09:00:00+00', '2025-11-17T17:00:00+00', 'Abidjan, Côte d\''Ivoire', false, 250, 180, '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000010002', 'Atelier Données Ouvertes', 'Session hands-on pour ouvrir les jeux de données FSU.', '2025-12-08T10:00:00+00', '2025-12-08T16:00:00+00', 'Nairobi, Kenya', false, 120, 94, '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000010003', 'Conférence Annuelle UDC', 'Point de synthèse annuel sur l''impact du réseau.', '2026-01-20T09:00:00+00', '2026-01-22T16:00:00+00', 'Dakar, Sénégal', false, 350, 220, '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000010004', 'Forum Innovation Numérique', 'Exploration des outils d''IA pour l''inclusion.', '2026-03-15T08:30:00+00', '2026-03-16T18:00:00+00', 'Casablanca, Maroc', false, 180, 60, '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000010005', 'Bootcamp Smart Villages', 'Ateliers pratiques pour accélérer les villages intelligents.', '2026-04-08T09:00:00+00', '2026-04-10T17:00:00+00', 'Kigali, Rwanda', false, 150, 30, '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000010006', 'Sommet Connectivité Éducation', 'Tables rondes sur les infrastructures scolaires.', '2026-05-22T09:00:00+00', '2026-05-23T15:00:00+00', 'Niamey, Niger', false, 200, 45, '00000000-0000-0000-0000-000000000001');