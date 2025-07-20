
-- Correction des données pour les vraies agences du Fonds de Service Universel
-- Mise à jour des organisations existantes avec les bonnes agences FSU

-- Côte d'Ivoire : FDSUT (Fonds de Développement des Services Universels de Télécommunications)
UPDATE public.agencies 
SET 
  name = 'Fonds de Développement des Services Universels de Télécommunications',
  acronym = 'FDSUT',
  description = 'Agence ivoirienne en charge du financement et de la mise en œuvre du service universel des télécommunications pour réduire la fracture numérique',
  website_url = 'https://www.artci.ci/fonds-service-universel'
WHERE acronym = 'ARCEP' AND country = 'Côte d''Ivoire';

-- Kenya : Universal Service Fund (géré par Communications Authority)
UPDATE public.agencies 
SET 
  name = 'Universal Service Fund Kenya',
  acronym = 'USF-KE',
  description = 'Fonds kényan pour le service universel gérant les programmes d''accès aux TIC dans les zones mal desservies et pour les populations vulnérables',
  website_url = 'https://ca.go.ke/industry/universal-access/'
WHERE acronym = 'CA' AND country = 'Kenya';

-- Mali : Agence des Technologies de l'Information et de la Communication (AGETIC) - Service Universel
UPDATE public.agencies 
SET 
  name = 'Fonds de Service Universel des Télécommunications du Mali',
  acronym = 'FSUT-ML',
  description = 'Fonds malien dédié au développement des services universels de télécommunications et à la réduction de la fracture numérique',
  website_url = 'https://www.arpce.gov.ml/service-universel'
WHERE acronym = 'ARPCE' AND country = 'Mali';

-- Maroc : Fonds de Service Universel des Télécommunications
UPDATE public.agencies 
SET 
  name = 'Fonds de Service Universel des Télécommunications',
  acronym = 'FSUT-MA',
  description = 'Fonds marocain pour le service universel des télécommunications, finançant les programmes d''accès numérique dans les zones rurales et reculées',
  website_url = 'https://www.anrt.ma/service-universel'
WHERE acronym = 'ANRT' AND country = 'Maroc';

-- Botswana : Universal Access and Service Fund
UPDATE public.agencies 
SET 
  name = 'Universal Access and Service Fund',
  acronym = 'UASF-BW',
  description = 'Fonds du Botswana pour l''accès et le service universels, promouvant la connectivité dans les zones mal desservies',
  website_url = 'https://www.bocra.org.bw/universal-service'
WHERE acronym = 'BOCRA' AND country = 'Botswana';

-- Mise à jour des statuts de synchronisation pour refléter les nouvelles données
UPDATE public.agencies 
SET sync_status = 'pending', last_sync_at = NULL
WHERE acronym IN ('FDSUT', 'USF-KE', 'FSUT-ML', 'FSUT-MA', 'UASF-BW');
