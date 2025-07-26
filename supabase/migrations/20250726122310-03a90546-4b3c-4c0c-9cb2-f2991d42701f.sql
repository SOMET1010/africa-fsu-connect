-- Créer la table pour les traductions de pays
CREATE TABLE public.countries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  region TEXT,
  continent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insérer les pays d'Afrique utilisés dans l'application
INSERT INTO public.countries (code, name_fr, name_en, region, continent) VALUES
('SN', 'Sénégal', 'Senegal', 'Afrique de l''Ouest', 'Afrique'),
('CI', 'Côte d''Ivoire', 'Ivory Coast', 'Afrique de l''Ouest', 'Afrique'),
('BF', 'Burkina Faso', 'Burkina Faso', 'Afrique de l''Ouest', 'Afrique'),
('ML', 'Mali', 'Mali', 'Afrique de l''Ouest', 'Afrique'),
('GH', 'Ghana', 'Ghana', 'Afrique de l''Ouest', 'Afrique'),
('CM', 'Cameroun', 'Cameroon', 'Afrique Centrale', 'Afrique'),
('NG', 'Nigeria', 'Nigeria', 'Afrique de l''Ouest', 'Afrique'),
('KE', 'Kenya', 'Kenya', 'Afrique de l''Est', 'Afrique'),
('UG', 'Ouganda', 'Uganda', 'Afrique de l''Est', 'Afrique'),
('TZ', 'Tanzanie', 'Tanzania', 'Afrique de l''Est', 'Afrique'),
('RW', 'Rwanda', 'Rwanda', 'Afrique de l''Est', 'Afrique'),
('ZA', 'Afrique du Sud', 'South Africa', 'Afrique Australe', 'Afrique'),
('MA', 'Maroc', 'Morocco', 'Afrique du Nord', 'Afrique'),
('TN', 'Tunisie', 'Tunisia', 'Afrique du Nord', 'Afrique'),
('EG', 'Égypte', 'Egypt', 'Afrique du Nord', 'Afrique');

-- Créer la table pour les traductions d'indicateurs
CREATE TABLE public.indicator_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  indicator_code TEXT NOT NULL,
  language_code TEXT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  category_name TEXT,
  unit_display TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(indicator_code, language_code)
);

-- Insérer les traductions pour les indicateurs les plus courants
INSERT INTO public.indicator_translations (indicator_code, language_code, display_name, description, category_name, unit_display) VALUES
-- Indicateurs de connectivité
('IT.NET.USER.ZS', 'fr', 'Utilisateurs Internet (% population)', 'Pourcentage de la population utilisant Internet', 'Connectivité', '% de la population'),
('IT.NET.USER.ZS', 'en', 'Internet Users (% of population)', 'Percentage of population using Internet', 'Connectivity', '% of population'),
('IT.CEL.SETS.P2', 'fr', 'Abonnements téléphonie mobile', 'Nombre d''abonnements de téléphonie mobile pour 100 habitants', 'Connectivité', 'pour 100 habitants'),
('IT.CEL.SETS.P2', 'en', 'Mobile Phone Subscriptions', 'Mobile phone subscriptions per 100 people', 'Connectivity', 'per 100 people'),
('IT.NET.BBND.P2', 'fr', 'Abonnements haut débit fixe', 'Abonnements Internet haut débit fixe pour 100 habitants', 'Connectivité', 'pour 100 habitants'),
('IT.NET.BBND.P2', 'en', 'Fixed Broadband Subscriptions', 'Fixed broadband Internet subscriptions per 100 people', 'Connectivity', 'per 100 people'),

-- Indicateurs économiques
('NY.GDP.PCAP.CD', 'fr', 'PIB par habitant', 'Produit intérieur brut par habitant en dollars US courants', 'Économie', 'USD'),
('NY.GDP.PCAP.CD', 'en', 'GDP per Capita', 'Gross domestic product per capita in current US dollars', 'Economy', 'USD'),
('SL.UEM.TOTL.ZS', 'fr', 'Taux de chômage', 'Taux de chômage en pourcentage de la population active', 'Économie', '% population active'),
('SL.UEM.TOTL.ZS', 'en', 'Unemployment Rate', 'Unemployment rate as percentage of total labor force', 'Economy', '% of labor force'),

-- Indicateurs d'éducation
('SE.ADT.LITR.ZS', 'fr', 'Taux d''alphabétisation adulte', 'Pourcentage d''adultes (15 ans et plus) sachant lire et écrire', 'Éducation', '% adultes'),
('SE.ADT.LITR.ZS', 'en', 'Adult Literacy Rate', 'Percentage of adults (15 years and older) who can read and write', 'Education', '% of adults'),
('SE.PRM.NENR', 'fr', 'Taux de scolarisation primaire', 'Taux net de scolarisation dans l''enseignement primaire', 'Éducation', '% enfants'),
('SE.PRM.NENR', 'en', 'Primary School Enrollment', 'Net enrollment rate in primary education', 'Education', '% of children'),

-- Indicateurs de santé
('SH.DYN.MORT', 'fr', 'Taux de mortalité infantile', 'Décès d''enfants de moins de 5 ans pour 1000 naissances vivantes', 'Santé', 'pour 1000 naissances'),
('SH.DYN.MORT', 'en', 'Child Mortality Rate', 'Deaths of children under 5 years per 1000 live births', 'Health', 'per 1000 births'),
('SP.DYN.LE00.IN', 'fr', 'Espérance de vie', 'Espérance de vie à la naissance en années', 'Santé', 'années'),
('SP.DYN.LE00.IN', 'en', 'Life Expectancy', 'Life expectancy at birth in years', 'Health', 'years');

-- Activer RLS sur les nouvelles tables
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicator_translations ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
CREATE POLICY "Anyone can view countries" ON public.countries FOR SELECT USING (true);
CREATE POLICY "Admins can manage countries" ON public.countries FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Anyone can view indicator translations" ON public.indicator_translations FOR SELECT USING (true);
CREATE POLICY "Admins can manage indicator translations" ON public.indicator_translations FOR ALL USING (is_admin(auth.uid()));

-- Créer les triggers pour updated_at
CREATE TRIGGER update_countries_updated_at
  BEFORE UPDATE ON public.countries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_indicator_translations_updated_at
  BEFORE UPDATE ON public.indicator_translations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();