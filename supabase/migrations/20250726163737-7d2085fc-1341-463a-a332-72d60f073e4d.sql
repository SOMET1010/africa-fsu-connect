-- Add missing common translations that are needed but not in database

-- First, let's add common.discover
INSERT INTO translations (
  language_id, 
  namespace_id, 
  key, 
  value, 
  is_approved,
  created_by
) VALUES 
-- French translations
((SELECT id FROM languages WHERE code = 'fr'), 
 (SELECT id FROM translation_namespaces WHERE name = 'common'), 
 'common.discover', 
 'Découvrir', 
 true, 
 NULL),

-- English translations
((SELECT id FROM languages WHERE code = 'en'), 
 (SELECT id FROM translation_namespaces WHERE name = 'common'), 
 'common.discover', 
 'Discover', 
 true, 
 NULL),

-- Add other essential common translations
-- French
((SELECT id FROM languages WHERE code = 'fr'), 
 (SELECT id FROM translation_namespaces WHERE name = 'common'), 
 'common.learn_more', 
 'En savoir plus', 
 true, 
 NULL),

((SELECT id FROM languages WHERE code = 'fr'), 
 (SELECT id FROM translation_namespaces WHERE name = 'common'), 
 'common.explore', 
 'Explorer', 
 true, 
 NULL),

((SELECT id FROM languages WHERE code = 'fr'), 
 (SELECT id FROM translation_namespaces WHERE name = 'common'), 
 'common.get_started', 
 'Commencer', 
 true, 
 NULL),

-- English
((SELECT id FROM languages WHERE code = 'en'), 
 (SELECT id FROM translation_namespaces WHERE name = 'common'), 
 'common.learn_more', 
 'Learn More', 
 true, 
 NULL),

((SELECT id FROM languages WHERE code = 'en'), 
 (SELECT id FROM translation_namespaces WHERE name = 'common'), 
 'common.explore', 
 'Explore', 
 true, 
 NULL),

((SELECT id FROM languages WHERE code = 'en'), 
 (SELECT id FROM translation_namespaces WHERE name = 'common'), 
 'common.get_started', 
 'Get Started', 
 true, 
 NULL)