-- Mise à jour avec les vraies agences SUTEL africaines

-- Supprimer les anciennes données test
DELETE FROM public.agencies;

-- Insérer les vraies agences SUTEL avec données authentiques
INSERT INTO public.agencies (
  name, acronym, country, region, website_url, description, 
  contact_email, phone, address, logo_url, is_active, 
  metadata, established_date
) VALUES
-- Sénégal - FDSUT
(
  'Fonds de Développement du Service Universel des Télécommunications',
  'FDSUT',
  'Sénégal',
  'Afrique de l''Ouest',
  'https://fdsut.sn',
  'Fonds étatique destiné à favoriser l''accès et le développement des services de communications électroniques dans les zones défavorisées du Sénégal',
  'contact@fdsut.sn',
  '+221 33 869 46 46',
  'Dakar, Sénégal',
  'https://fdsut.sn/wp-content/themes/fdsut/assets/images/logo.png',
  true,
  '{
    "sutel_type": "autonomous_fund",
    "governance_type": "Fonds autonome",
    "parent_authority": "Ministère de l''Économie numérique et des Télécommunications",
    "mission": "Développement du service universel des télécommunications",
    "target_beneficiaries": "Zones rurales et défavorisées",
    "funding_source": "Contributions des opérateurs télécoms",
    "key_programs": ["Couverture mobile rurale", "Infrastructures numériques", "Centres d''accès communautaires"]
  }'::jsonb,
  '2012-01-01'
),

-- Afrique du Sud - USAASA
(
  'Universal Service and Access Agency of South Africa',
  'USAASA',
  'Afrique du Sud',
  'Afrique Australe',
  'http://www.usaasa.org.za',
  'Agence gouvernementale établie pour assurer l''accès universel aux services de communications électroniques en Afrique du Sud',
  'info@usaasa.org.za',
  '+27 11 321 8200',
  'Johannesburg, Afrique du Sud',
  'http://www.usaasa.org.za/images/logo.png',
  true,
  '{
    "sutel_type": "government_agency",
    "governance_type": "Agence gouvernementale",
    "parent_authority": "Department of Communications and Digital Technologies",
    "mission": "Accès universel et service aux communications électroniques",
    "target_beneficiaries": "Communautés rurales et défavorisées",
    "funding_source": "Universal Service and Access Fund (USAF)",
    "key_programs": ["Connectivité rurale", "Centres d''accès communautaires", "Alphabétisation numérique"]
  }'::jsonb,
  '2005-01-01'
),

-- Kenya - USF
(
  'Universal Service Fund Kenya',
  'USF Kenya',
  'Kenya',
  'Afrique de l''Est',
  'https://www.ca.go.ke/universal-service-fund',
  'Fonds administré par l''Autorité des Communications du Kenya pour soutenir l''accès répandu aux services TIC',
  'info@ca.go.ke',
  '+254 20 4242000',
  'Nairobi, Kenya',
  'https://www.ca.go.ke/sites/default/files/ca-logo.png',
  true,
  '{
    "sutel_type": "regulatory_fund",
    "governance_type": "Fonds réglementaire",
    "parent_authority": "Communications Authority of Kenya (CA)",
    "mission": "Soutenir l''accès répandu aux services TIC et promouvoir l''innovation",
    "target_beneficiaries": "Zones mal desservies et non desservies",
    "funding_source": "Prélèvement de 0.5% sur le chiffre d''affaires des opérateurs",
    "key_programs": ["Infrastructure TIC", "Renforcement des capacités", "Innovation TIC"]
  }'::jsonb,
  '2009-01-01'
),

-- Ghana - GIFEC
(
  'Ghana Investment Fund for Electronic Communications',
  'GIFEC',
  'Ghana',
  'Afrique de l''Ouest',
  'https://gifec.gov.gh',
  'Agence du Fonds d''Accès Universel pour les Communications Électroniques du Ministère des Communications et de la Digitalisation',
  'info@gifec.gov.gh',
  '+233 30 701 1000',
  'Accra, Ghana',
  'https://gifec.gov.gh/assets/images/logo.png',
  true,
  '{
    "sutel_type": "ministry_fund",
    "governance_type": "Fonds ministériel",
    "parent_authority": "Ministry of Communications and Digitalisation",
    "mission": "Faciliter la fourniture de communications électroniques aux communautés mal desservies",
    "target_beneficiaries": "Communautés mal desservies et non desservies",
    "funding_source": "Contributions des opérateurs de télécommunications",
    "key_programs": ["Programme de connectivité rurale", "Cyberlabs", "Renforcement des capacités TIC"]
  }'::jsonb,
  '2005-01-01'
),

-- Nigeria - USF Nigeria
(
  'Universal Service Provision Fund Nigeria',
  'USPF Nigeria',
  'Nigeria',
  'Afrique de l''Ouest',
  'https://uspf.gov.ng',
  'Agence pour la promotion de l''accès universel et de l''utilisation des services de communications électroniques au Nigeria',
  'info@uspf.gov.ng',
  '+234 9 461 4444',
  'Abuja, Nigeria',
  'https://uspf.gov.ng/assets/images/logo.png',
  true,
  '{
    "sutel_type": "government_agency",
    "governance_type": "Agence gouvernementale",
    "parent_authority": "Federal Ministry of Communications and Digital Economy",
    "mission": "Promouvoir l''accès universel aux services de communications électroniques",
    "target_beneficiaries": "Zones rurales et mal desservies",
    "funding_source": "Prélèvement de 2.5% sur le chiffre d''affaires des opérateurs",
    "key_programs": ["Connectivité rurale", "Centres d''accès TIC", "E-éducation", "E-santé"]
  }'::jsonb,
  '2007-01-01'
),

-- Rwanda - USF Rwanda
(
  'Universal Service Fund Rwanda',
  'USF Rwanda',
  'Rwanda',
  'Afrique de l''Est',
  'https://rura.rw/universal-service-fund',
  'Fonds géré par l''Autorité de Régulation des Services Publics du Rwanda pour promouvoir l''accès universel aux TIC',
  'info@rura.rw',
  '+250 252 584562',
  'Kigali, Rwanda',
  'https://rura.rw/fileadmin/templates/images/logo.png',
  true,
  '{
    "sutel_type": "regulatory_fund",
    "governance_type": "Fonds réglementaire",
    "parent_authority": "Rwanda Utilities Regulatory Authority (RURA)",
    "mission": "Promouvoir l''accès universel et abordable aux services TIC",
    "target_beneficiaries": "Zones rurales et groupes vulnérables",
    "funding_source": "Contributions des opérateurs de télécommunications",
    "key_programs": ["Infrastructure TIC rurale", "Centres d''accès communautaires", "Formation numérique"]
  }'::jsonb,
  '2013-01-01'
),

-- Uganda - RCDF
(
  'Rural Communications Development Fund',
  'RCDF',
  'Uganda',
  'Afrique de l''Est',
  'https://ucc.co.ug/rcdf',
  'Fonds pour le développement des communications rurales géré par la Commission des Communications de l''Ouganda',
  'rcdf@ucc.co.ug',
  '+256 41 4339000',
  'Kampala, Uganda',
  'https://ucc.co.ug/images/logo.png',
  true,
  '{
    "sutel_type": "regulatory_fund",
    "governance_type": "Fonds réglementaire",
    "parent_authority": "Uganda Communications Commission (UCC)",
    "mission": "Développer l''infrastructure de communications dans les zones rurales",
    "target_beneficiaries": "Communautés rurales et mal desservies",
    "funding_source": "Prélèvement de 1% sur le chiffre d''affaires des opérateurs",
    "key_programs": ["Infrastructure de communications rurales", "Centres d''accès TIC", "Formation en TIC"]
  }'::jsonb,
  '2003-01-01'
),

-- Côte d''Ivoire - FDSUT-CI
(
  'Fonds de Développement du Service Universel des Télécommunications de Côte d''Ivoire',
  'FDSUT-CI',
  'Côte d''Ivoire',
  'Afrique de l''Ouest',
  'https://www.artci.ci/fdsut',
  'Fonds pour le développement du service universel des télécommunications en Côte d''Ivoire',
  'fdsut@artci.ci',
  '+225 27 22 44 91 00',
  'Abidjan, Côte d''Ivoire',
  'https://www.artci.ci/images/logo.png',
  true,
  '{
    "sutel_type": "regulatory_fund",
    "governance_type": "Fonds réglementaire",
    "parent_authority": "Autorité de Régulation des Télécommunications de Côte d''Ivoire (ARTCI)",
    "mission": "Assurer le service universel des télécommunications",
    "target_beneficiaries": "Zones rurales et défavorisées",
    "funding_source": "Contributions des opérateurs de télécommunications",
    "key_programs": ["Couverture mobile rurale", "Télécentres communautaires", "Accès internet"]
  }'::jsonb,
  '2013-01-01'
);