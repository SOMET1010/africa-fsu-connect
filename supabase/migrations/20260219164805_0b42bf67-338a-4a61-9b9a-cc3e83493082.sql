UPDATE homepage_content_blocks 
SET content_fr = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          content_fr::jsonb,
          '{badge}', '"UAT Digital Connect Africa (ADCA)"'
        ),
        '{title}', '"Connecter l''écosystème"'
      ),
      '{subtitle_highlight}', '"numérique de l''Afrique"'
    ),
    '{subtitle_suffix}', '""'
  ),
  '{description}', '"Plateforme panafricaine pour la coordination, l''innovation et la mutualisation des ressources du Service Universel des Télécommunications."'
)
WHERE block_key = 'hero';