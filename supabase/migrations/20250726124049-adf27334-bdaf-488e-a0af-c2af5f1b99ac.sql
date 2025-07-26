-- Add geographic coordinates to countries table
ALTER TABLE public.countries 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS capital_city TEXT;

-- Update countries with geographic coordinates (capitals)
UPDATE public.countries SET 
  latitude = 31.7917, longitude = -7.0926, capital_city = 'Rabat'
WHERE code = 'MA';

UPDATE public.countries SET 
  latitude = 33.8869, longitude = 9.5375, capital_city = 'Tunis'
WHERE code = 'TN';

UPDATE public.countries SET 
  latitude = 36.7372, longitude = 3.0869, capital_city = 'Alger'
WHERE code = 'DZ';

UPDATE public.countries SET 
  latitude = 14.6928, longitude = -17.4441, capital_city = 'Dakar'
WHERE code = 'SN';

UPDATE public.countries SET 
  latitude = 12.6392, longitude = -7.9889, capital_city = 'Bamako'
WHERE code = 'ML';

UPDATE public.countries SET 
  latitude = 13.5116, longitude = 2.1111, capital_city = 'Niamey'
WHERE code = 'NE';

UPDATE public.countries SET 
  latitude = 12.2383, longitude = -1.5616, capital_city = 'Ouagadougou'
WHERE code = 'BF';

UPDATE public.countries SET 
  latitude = 5.3600, longitude = -4.0305, capital_city = 'Abidjan'
WHERE code = 'CI';

UPDATE public.countries SET 
  latitude = 5.6037, longitude = -0.1870, capital_city = 'Accra'
WHERE code = 'GH';

UPDATE public.countries SET 
  latitude = 9.0765, longitude = 7.5244, capital_city = 'Abuja'
WHERE code = 'NG';

UPDATE public.countries SET 
  latitude = 3.8480, longitude = 11.5174, capital_city = 'Yaoundé'
WHERE code = 'CM';

UPDATE public.countries SET 
  latitude = -1.2921, longitude = 36.8219, capital_city = 'Nairobi'
WHERE code = 'KE';

UPDATE public.countries SET 
  latitude = -6.7924, longitude = 39.2083, capital_city = 'Dar es Salaam'
WHERE code = 'TZ';

UPDATE public.countries SET 
  latitude = 0.3476, longitude = 32.5825, capital_city = 'Kampala'
WHERE code = 'UG';

UPDATE public.countries SET 
  latitude = -1.9441, longitude = 30.0619, capital_city = 'Kigali'
WHERE code = 'RW';

UPDATE public.countries SET 
  latitude = -25.7479, longitude = 28.2293, capital_city = 'Pretoria'
WHERE code = 'ZA';

UPDATE public.countries SET 
  latitude = 12.1348, longitude = 15.0444, capital_city = 'N\'Djamena'
WHERE code = 'TD';

UPDATE public.countries SET 
  latitude = 0.4162, longitude = 9.4673, capital_city = 'Libreville'
WHERE code = 'GA';

UPDATE public.countries SET 
  latitude = -4.2634, longitude = 15.2662, capital_city = 'Brazzaville'
WHERE code = 'CG';

UPDATE public.countries SET 
  latitude = -4.4419, longitude = 15.2663, capital_city = 'Kinshasa'
WHERE code = 'CD';

-- Add coordinates for more African countries
UPDATE public.countries SET 
  latitude = -15.3875, longitude = 28.2871, capital_city = 'Lusaka'
WHERE code = 'ZM';

UPDATE public.countries SET 
  latitude = -24.6282, longitude = 25.9087, capital_city = 'Gaborone'
WHERE code = 'BW';

UPDATE public.countries SET 
  latitude = -22.5609, longitude = 17.0658, capital_city = 'Windhoek'
WHERE code = 'NA';