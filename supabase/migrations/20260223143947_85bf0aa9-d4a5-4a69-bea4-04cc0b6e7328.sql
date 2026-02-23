-- 1. Supprimer l'ancienne contrainte CHECK basée sur les codes communauté
ALTER TABLE public.agencies DROP CONSTRAINT agencies_region_check;

-- 2. Mettre à jour les données existantes vers les noms géographiques
UPDATE public.agencies SET region = 'Afrique de l''Ouest' WHERE region = 'CEDEAO';
UPDATE public.agencies SET region = 'Afrique de l''Est' WHERE region IN ('EACO', 'EAC');
UPDATE public.agencies SET region = 'Afrique Australe' WHERE region = 'SADC';
UPDATE public.agencies SET region = 'Afrique Centrale' WHERE region IN ('CEMAC', 'ECCAS');
UPDATE public.agencies SET region = 'Afrique du Nord' WHERE region IN ('COMESA', 'UMA');

-- 3. Recréer la contrainte CHECK avec les noms géographiques standards
ALTER TABLE public.agencies ADD CONSTRAINT agencies_region_check 
  CHECK (region = ANY (ARRAY[
    'Afrique de l''Ouest'::text, 
    'Afrique Centrale'::text, 
    'Afrique de l''Est'::text, 
    'Afrique du Nord'::text, 
    'Afrique Australe'::text
  ]));

-- 4. Documenter
COMMENT ON COLUMN public.agencies.region IS 'Région géographique africaine. Valeurs: Afrique de l''Ouest, Afrique Centrale, Afrique de l''Est, Afrique du Nord, Afrique Australe';