-- =============================================
-- Migration: Ajouter les langues et communauté SUTEL aux pays
-- Description: Permet le regroupement par langue de travail et sous-réseau linguistique
-- =============================================

-- Ajouter colonne langue officielle principale
ALTER TABLE countries ADD COLUMN IF NOT EXISTS official_language TEXT DEFAULT 'fr';

-- Ajouter tableau des langues de travail (pour pays multilingues)
ALTER TABLE countries ADD COLUMN IF NOT EXISTS working_languages TEXT[] DEFAULT ARRAY['fr'];

-- Ajouter appartenance SUTEL (sous-réseau linguistique)
-- Valeurs possibles: 'CRTEL' (francophone), 'EACO' (anglophone), 'SADC', 'UMA' (arabophone)
ALTER TABLE countries ADD COLUMN IF NOT EXISTS sutel_community TEXT;

-- =============================================
-- Peupler les données linguistiques
-- =============================================

-- Pays francophones d'Afrique de l'Ouest et Centrale
UPDATE countries SET 
  official_language = 'fr', 
  working_languages = ARRAY['fr'],
  sutel_community = 'CRTEL'
WHERE code IN ('SN', 'CI', 'ML', 'BF', 'NE', 'TG', 'BJ', 'GA', 'CG', 'CF', 'TD', 'GN', 'GQ');

-- Pays francophones d'Afrique Centrale
UPDATE countries SET 
  official_language = 'fr', 
  working_languages = ARRAY['fr'],
  sutel_community = 'CEMAC'
WHERE code IN ('CD', 'BI', 'RW');

-- Cameroun - bilingue FR/EN
UPDATE countries SET 
  official_language = 'fr', 
  working_languages = ARRAY['fr', 'en'],
  sutel_community = 'CRTEL'
WHERE code = 'CM';

-- Pays anglophones d'Afrique de l'Est
UPDATE countries SET 
  official_language = 'en', 
  working_languages = ARRAY['en'],
  sutel_community = 'EACO'
WHERE code IN ('KE', 'TZ', 'UG', 'RW', 'SS');

-- Pays anglophones d'Afrique de l'Ouest
UPDATE countries SET 
  official_language = 'en', 
  working_languages = ARRAY['en'],
  sutel_community = 'ECOWAS'
WHERE code IN ('NG', 'GH', 'GM', 'SL', 'LR');

-- Pays anglophones d'Afrique Australe
UPDATE countries SET 
  official_language = 'en', 
  working_languages = ARRAY['en'],
  sutel_community = 'SADC'
WHERE code IN ('ZA', 'ZM', 'ZW', 'BW', 'NA', 'LS', 'SZ', 'MW');

-- Pays lusophones
UPDATE countries SET 
  official_language = 'pt', 
  working_languages = ARRAY['pt'],
  sutel_community = 'CPLP'
WHERE code IN ('AO', 'MZ', 'CV', 'GW', 'ST');

-- Pays arabophones d'Afrique du Nord
UPDATE countries SET 
  official_language = 'ar', 
  working_languages = ARRAY['ar', 'fr'],
  sutel_community = 'UMA'
WHERE code IN ('DZ', 'TN', 'MA', 'LY');

-- Mauritanie - arabe et français
UPDATE countries SET 
  official_language = 'ar', 
  working_languages = ARRAY['ar', 'fr'],
  sutel_community = 'UMA'
WHERE code = 'MR';

-- Egypte et Soudan - arabophone
UPDATE countries SET 
  official_language = 'ar', 
  working_languages = ARRAY['ar'],
  sutel_community = 'COMESA'
WHERE code IN ('EG', 'SD');

-- Ethiopie - amharique/anglais
UPDATE countries SET 
  official_language = 'am', 
  working_languages = ARRAY['am', 'en'],
  sutel_community = 'EACO'
WHERE code = 'ET';

-- Djibouti - français/arabe
UPDATE countries SET 
  official_language = 'fr', 
  working_languages = ARRAY['fr', 'ar'],
  sutel_community = 'COMESA'
WHERE code = 'DJ';

-- Somalie - arabe/somali
UPDATE countries SET 
  official_language = 'so', 
  working_languages = ARRAY['so', 'ar'],
  sutel_community = 'EACO'
WHERE code = 'SO';

-- Erythrée - tigrinya/arabe
UPDATE countries SET 
  official_language = 'ti', 
  working_languages = ARRAY['ti', 'ar'],
  sutel_community = 'COMESA'
WHERE code = 'ER';

-- Afrique du Sud - multilingue
UPDATE countries SET 
  official_language = 'en', 
  working_languages = ARRAY['en', 'af', 'zu'],
  sutel_community = 'SADC'
WHERE code = 'ZA';

-- Seychelles et Maurice - multilingues
UPDATE countries SET 
  official_language = 'en', 
  working_languages = ARRAY['en', 'fr'],
  sutel_community = 'SADC'
WHERE code IN ('SC', 'MU');

-- Madagascar - malgache/français
UPDATE countries SET 
  official_language = 'mg', 
  working_languages = ARRAY['mg', 'fr'],
  sutel_community = 'SADC'
WHERE code = 'MG';

-- Comores - arabe/français/comorien
UPDATE countries SET 
  official_language = 'ar', 
  working_languages = ARRAY['ar', 'fr'],
  sutel_community = 'COMESA'
WHERE code = 'KM';

-- Créer un index pour accélérer les requêtes par langue
CREATE INDEX IF NOT EXISTS idx_countries_official_language ON countries(official_language);
CREATE INDEX IF NOT EXISTS idx_countries_sutel_community ON countries(sutel_community);