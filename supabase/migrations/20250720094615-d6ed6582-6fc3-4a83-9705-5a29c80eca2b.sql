
-- Correction complète des SUTEL africaines basée sur les données officielles

-- 1. Correction Côte d'Ivoire : FDSUT → ANSUT (agence autonome)
UPDATE public.agencies 
SET 
  name = 'Agence Nationale du Service Universel des Télécommunications',
  acronym = 'ANSUT',
  description = 'Agence autonome rattachée au secteur télécom et au ministère du numérique, dédiée au déploiement du service universel des télécommunications en Côte d''Ivoire.',
  website_url = 'https://www.ansut.ci',
  metadata = jsonb_set(
    COALESCE(metadata, '{}'),
    '{governance_type}',
    '"autonomous_agency"'
  ) || jsonb_set(
    COALESCE(metadata, '{}'),
    '{sutel_type}',
    '"dedicated_autonomous_agency"'
  ) || jsonb_set(
    COALESCE(metadata, '{}'),
    '{mission}',
    '"universal_service_deployment"'
  )
WHERE name LIKE '%Fonds de Développement des Services Universels de Télécommunications%' AND country = 'Côte d''Ivoire';

-- 2. Correction Mali : FSUT-ML → AGEFAU (agence autonome)
UPDATE public.agencies 
SET 
  name = 'Agence de Gestion du Fonds d''Accès Universel',
  acronym = 'AGEFAU',
  description = 'Agence autonome dédiée à la gestion du fonds pour les zones rurales et l''accès universel aux télécommunications au Mali.',
  website_url = 'https://www.agefau.ml',
  metadata = jsonb_set(
    COALESCE(metadata, '{}'),
    '{governance_type}',
    '"autonomous_agency"'
  ) || jsonb_set(
    COALESCE(metadata, '{}'),
    '{sutel_type}',
    '"autonomous_fund_management"'
  ) || jsonb_set(
    COALESCE(metadata, '{}'),
    '{mission}',
    '"rural_zone_funding"'
  )
WHERE name LIKE '%Fonds de Service Universel des Télécommunications du Mali%' AND country = 'Mali';

-- 3. Correction Maroc : FSUT-MA → FSU/ANRT
UPDATE public.agencies 
SET 
  name = 'Fonds de Service Universel des télécommunications',
  acronym = 'FSU',
  description = 'Fonds de service universel piloté par l''Agence Nationale de Réglementation des Télécommunications (ANRT) au Maroc.',
  website_url = 'https://www.anrt.ma/service-universel',
  metadata = jsonb_set(
    COALESCE(metadata, '{}'),
    '{governance_type}',
    '"unit_within_regulator"'
  ) || jsonb_set(
    COALESCE(metadata, '{}'),
    '{sutel_type}',
    '"regulator_managed_fund"'
  ) || jsonb_set(
    COALESCE(metadata, '{}'),
    '{parent_authority}',
    '"ANRT"'
  )
WHERE name LIKE '%Fonds de Service Universel des Télécommunications%' AND country = 'Maroc';

-- 4. Ajout Nigeria : USPF
INSERT INTO public.agencies (
  name, acronym, country, region, description, website_url,
  sync_status, is_active, metadata
) VALUES (
  'Universal Service Provision Fund',
  'USPF',
  'Nigeria',
  'CEDEAO',
  'Fonds géré par le régulateur NCC pour le service universel des télécommunications au Nigeria.',
  'https://www.ncc.gov.ng/consumer-resources/universal-service-provision',
  'pending',
  true,
  jsonb_build_object(
    'governance_type', 'unit_within_regulator',
    'sutel_type', 'regulator_managed_fund',
    'parent_authority', 'NCC',
    'mission', 'universal_service_provision'
  )
);

-- 5. Ajout Burkina Faso : FAU
INSERT INTO public.agencies (
  name, acronym, country, region, description, website_url,
  sync_status, is_active, metadata
) VALUES (
  'Fonds d''Accès Universel',
  'FAU',
  'Burkina Faso',
  'CEDEAO',
  'Direction spécialisée au sein de l''ARCEP pour la gestion du fonds d''accès universel au Burkina Faso.',
  'https://www.arcep.bf/service-universel',
  'pending',
  true,
  jsonb_build_object(
    'governance_type', 'unit_within_regulator',
    'sutel_type', 'specialized_direction',
    'parent_authority', 'ARCEP',
    'mission', 'universal_access_funding'
  )
);

-- 6. Ajout Cameroun : Fonds Spécial des Télécommunications
INSERT INTO public.agencies (
  name, acronym, country, region, description, website_url,
  sync_status, is_active, metadata
) VALUES (
  'Fonds Spécial des Télécommunications',
  'FST',
  'Cameroun',
  'Afrique',
  'Fonds spécial au sein du MINPOSTEL pour le développement des télécommunications au Cameroun.',
  'https://www.minpostel.gov.cm',
  'pending',
  true,
  jsonb_build_object(
    'governance_type', 'ministry_unit',
    'sutel_type', 'ministerial_fund',
    'parent_authority', 'MINPOSTEL',
    'mission', 'telecom_development'
  )
);

-- 7. Ajout Tunisie : Fonds de Service Universel
INSERT INTO public.agencies (
  name, acronym, country, region, description, website_url,
  sync_status, is_active, metadata
) VALUES (
  'Fonds de Service Universel des Télécommunications',
  'FSU-TN',
  'Tunisie',
  'UMA',
  'Fonds géré par le régulateur INT pour le service universel des télécommunications en Tunisie.',
  'https://www.int.tn/service-universel',
  'pending',
  true,
  jsonb_build_object(
    'governance_type', 'unit_within_regulator',
    'sutel_type', 'regulator_managed_fund',
    'parent_authority', 'INT',
    'mission', 'universal_service_funding'
  )
);

-- 8. Ajout Madagascar : Fonds d'Accès Universel
INSERT INTO public.agencies (
  name, acronym, country, region, description, website_url,
  sync_status, is_active, metadata
) VALUES (
  'Fonds d''Accès Universel',
  'FAU-MG',
  'Madagascar',
  'SADC',
  'Fonds d''accès universel sous supervision de l''ARTEC pour Madagascar.',
  'https://www.artec.mg/acces-universel',
  'pending',
  true,
  jsonb_build_object(
    'governance_type', 'unit_within_regulator',
    'sutel_type', 'regulator_supervised_fund',
    'parent_authority', 'ARTEC',
    'mission', 'universal_access_supervision'
  )
);

-- 9. Ajout Ouganda : RCDF
INSERT INTO public.agencies (
  name, acronym, country, region, description, website_url,
  sync_status, is_active, metadata
) VALUES (
  'Rural Communications Development Fund',
  'RCDF',
  'Ouganda',
  'EACO',
  'Fonds géré par UCC, autorité réglementaire, pour le développement des communications rurales en Ouganda.',
  'https://www.ucc.co.ug/rcdf',
  'pending',
  true,
  jsonb_build_object(
    'governance_type', 'unit_within_regulator',
    'sutel_type', 'rural_development_fund',
    'parent_authority', 'UCC',
    'mission', 'rural_communications_development'
  )
);

-- Mise à jour des agences existantes qui étaient déjà correctes pour ajouter les métadonnées SUTEL
UPDATE public.agencies 
SET metadata = COALESCE(metadata, '{}') || jsonb_build_object(
  'sutel_role', 'universal_service_agency',
  'focus_area', 'digital_inclusion'
)
WHERE acronym IN ('ANSUT', 'AGEFAU', 'FDSUT', 'GIFEC', 'FASUCE', 'FSU', 'USPF', 'FAU', 'FST', 'FSU-TN', 'FAU-MG', 'RCDF');
