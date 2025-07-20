
-- Correction complète des données FSU avec les vraies agences spécialisées
-- Basé sur l'enquête récente sur 40 pays africains

-- 1. Correction Côte d'Ivoire : FDSUT → ANSUT (vraie agence autonome)
UPDATE public.agencies 
SET 
  name = 'Agence nationale du service universel des télécommunications',
  acronym = 'ANSUT',
  description = 'Agence autonome déployant des projets pour étendre le service universel et l''inclusion numérique en Côte d''Ivoire. Financée par une contribution de 2% du CA des opérateurs télécoms.',
  website_url = 'https://www.ansut.ci',
  established_date = '2012-01-01'
WHERE acronym = 'FDSUT' AND country = 'Côte d''Ivoire';

-- 2. Correction Mali : FSUT-ML → AGEFAU (vraie agence de gestion autonome)
UPDATE public.agencies 
SET 
  name = 'Agence de gestion du fonds d''accès universel',
  acronym = 'AGEFAU',
  description = 'Agence autonome visant la connexion de zones rurales et mal desservies grâce à une gestion innovante des fonds FSU. Financée par une taxe de 1,5% sur le CA des opérateurs.',
  website_url = 'https://www.agefau.ml'
WHERE acronym = 'FSUT-ML' AND country = 'Mali';

-- 3. Ajout Sénégal : FDSUT (Fonds pour le Développement du Service Universel)
INSERT INTO public.agencies (
  name, acronym, country, region, description, website_url,
  sync_status, is_active, established_date, metadata
) VALUES (
  'Fonds pour le Développement du Service Universel des Télécommunications',
  'FDSUT',
  'Sénégal',
  'CEDEAO',
  'Fonds sénégalais soutenant l''extension de l''accès aux services électroniques dans les zones défavorisées. Gestion par unité spécialisée de l''ARTP avec contribution de 2,5% du CA opérateurs.',
  'https://www.artp.sn/service-universel',
  'pending',
  true,
  '2008-01-01',
  '{"governance_type": "unit_within_regulator", "funding_rate": "2.5%", "focus": "rural_digital_inclusion"}'
);

-- 4. Ajout Ghana : GIFEC (agence autonome de financement)
INSERT INTO public.agencies (
  name, acronym, country, region, description, website_url,
  sync_status, is_active, established_date, metadata
) VALUES (
  'Ghana Investment Fund for Electronic Communications',
  'GIFEC',
  'Ghana',
  'CEDEAO',
  'Agence autonome finançant les infrastructures numériques dans les zones mal desservies du Ghana. Modèle innovant d''investissement avec contribution de 1,75% du CA des opérateurs télécoms.',
  'https://www.gifec.gov.gh',
  'pending',
  true,
  '2005-01-01',
  '{"governance_type": "autonomous_agency", "funding_rate": "1.75%", "focus": "digital_infrastructure"}'
);

-- 5. Ajout RDC : FASUCE (opérationnel depuis 2020)
INSERT INTO public.agencies (
  name, acronym, country, region, description, website_url,
  sync_status, is_active, established_date, metadata
) VALUES (
  'Fonds pour l''accès et service universel des communications électroniques',
  'FASUCE',
  'République Démocratique du Congo',
  'Afrique',
  'Fonds opérationnel depuis 2020 pour développer l''accès universel aux communications électroniques en RDC. Gestion par l''ARPTC avec financement par contribution de 3% du CA opérateurs.',
  'https://www.arptc.cd/fasuce',
  'pending',
  true,
  '2020-01-01',
  '{"governance_type": "unit_within_regulator", "funding_rate": "3%", "operational_since": "2020"}'
);

-- 6. Ajout organismes continentaux : UAT (Union Africaine des Télécommunications)
INSERT INTO public.agencies (
  name, acronym, country, region, description, website_url,
  sync_status, is_active, established_date, metadata
) VALUES (
  'Union Africaine des Télécommunications',
  'UAT',
  'Multi-pays',
  'Afrique',
  'Agence spécialisée de l''Union africaine promouvant le développement rapide du secteur des TIC et le service universel sur le continent. Orientation stratégique et élaboration de politiques pour garantir l''accès universel aux TIC.',
  'https://www.atu-uat.org',
  'pending',
  true,
  '1977-01-01',
  '{"type": "continental_organization", "scope": "africa_wide", "role": "policy_coordination"}'
);

-- 7. Ajout ARTAC (Assemblée des Régulateurs Télécoms Afrique Centrale)
INSERT INTO public.agencies (
  name, acronym, country, region, description, website_url,
  sync_status, is_active, established_date, metadata
) VALUES (
  'Assemblée des Régulateurs des Télécommunications de l''Afrique Centrale',
  'ARTAC',
  'Multi-pays',
  'Afrique',
  'Organisation régionale visant à harmoniser les politiques pour faciliter l''accès universel et la pénétration des télécoms dans les zones rurales de la sous-région d''Afrique centrale.',
  'https://www.artac-regulators.org',
  'pending',
  true,
  '2009-01-01',
  '{"type": "regional_organization", "scope": "central_africa", "mission": "policy_harmonization"}'
);

-- Mise à jour des métadonnées pour les agences existantes avec les nouveaux défis et modalités
UPDATE public.agencies 
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'),
  '{funding_challenges}',
  '["slow_disbursement", "governance_issues", "transparency_lack", "political_interference", "inefficient_use"]'
) || jsonb_set(
  COALESCE(metadata, '{}'),
  '{recommendations}',
  '["greater_autonomy", "transparency_obligation", "results_accountability", "allocation_reforms", "project_monitoring"]'
) || jsonb_set(
  COALESCE(metadata, '{}'),
  '{core_missions}',
  '["digital_divide_reduction", "digital_inclusion", "socio_economic_development", "rural_connectivity"]'
)
WHERE acronym IN ('ANSUT', 'AGEFAU', 'FDSUT', 'GIFEC', 'FASUCE');
