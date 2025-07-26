-- Ajouter les traductions manquantes pour les clés utilisées dans les composants

-- Traductions pour les clés manquantes trouvées dans AppSidebar et Index
INSERT INTO translations (language_id, namespace_id, key, value, is_approved)
SELECT 
  l.id as language_id,
  n.id as namespace_id,
  t.key,
  t.value,
  true as is_approved
FROM (
  SELECT 'fr' as lang, 'common' as ns, 'landing.title' as key, 'Fonds de Solidarité de l''Universalité Africaine' as value
  UNION ALL SELECT 'en', 'common', 'landing.title', 'African University Solidarity Fund'
  UNION ALL SELECT 'fr', 'common', 'features.analytics.reporting', 'Analyses & Rapports'
  UNION ALL SELECT 'en', 'common', 'features.analytics.reporting', 'Analytics & Reports'
  UNION ALL SELECT 'fr', 'common', 'features.analytics.reporting.desc', 'Tableaux de bord avancés et rapports personnalisés pour un suivi efficace'
  UNION ALL SELECT 'en', 'common', 'features.analytics.reporting.desc', 'Advanced dashboards and custom reports for effective monitoring'
  UNION ALL SELECT 'fr', 'common', 'features.analytics.reporting.highlight1', 'Métriques en temps réel'
  UNION ALL SELECT 'en', 'common', 'features.analytics.reporting.highlight1', 'Real-time metrics'
  UNION ALL SELECT 'fr', 'common', 'features.analytics.reporting.highlight2', 'Rapports personnalisables'
  UNION ALL SELECT 'en', 'common', 'features.analytics.reporting.highlight2', 'Customizable reports'
  UNION ALL SELECT 'fr', 'common', 'features.analytics.reporting.highlight3', 'Exportation de données'
  UNION ALL SELECT 'en', 'common', 'features.analytics.reporting.highlight3', 'Data export'
  UNION ALL SELECT 'fr', 'common', 'features.collaborative.forum', 'Forum Collaboratif'
  UNION ALL SELECT 'en', 'common', 'features.collaborative.forum', 'Collaborative Forum'
  UNION ALL SELECT 'fr', 'common', 'features.collaborative.forum.desc', 'Espace d''échange et de collaboration entre les membres'
  UNION ALL SELECT 'en', 'common', 'features.collaborative.forum.desc', 'Exchange and collaboration space for members'
  UNION ALL SELECT 'fr', 'common', 'features.collaborative.forum.highlight1', 'Discussions thématiques'
  UNION ALL SELECT 'en', 'common', 'features.collaborative.forum.highlight1', 'Thematic discussions'
  UNION ALL SELECT 'fr', 'common', 'features.collaborative.forum.highlight2', 'Partage d''expériences'
  UNION ALL SELECT 'en', 'common', 'features.collaborative.forum.highlight2', 'Experience sharing'
  UNION ALL SELECT 'fr', 'common', 'features.collaborative.forum.highlight3', 'Résolution collaborative'
  UNION ALL SELECT 'en', 'common', 'features.collaborative.forum.highlight3', 'Collaborative resolution'
  UNION ALL SELECT 'fr', 'common', 'features.events.training', 'Événements & Formation'
  UNION ALL SELECT 'en', 'common', 'features.events.training', 'Events & Training'
  UNION ALL SELECT 'fr', 'common', 'features.events.training.desc', 'Formations, webinaires et événements pour renforcer les capacités'
  UNION ALL SELECT 'en', 'common', 'features.events.training.desc', 'Training, webinars and events to strengthen capacities'
  UNION ALL SELECT 'fr', 'common', 'features.events.training.highlight1', 'Formations certifiantes'
  UNION ALL SELECT 'en', 'common', 'features.events.training.highlight1', 'Certified training'
  UNION ALL SELECT 'fr', 'common', 'features.events.training.highlight2', 'Webinaires interactifs'
  UNION ALL SELECT 'en', 'common', 'features.events.training.highlight2', 'Interactive webinars'
  UNION ALL SELECT 'fr', 'common', 'features.events.training.highlight3', 'Événements régionaux'
  UNION ALL SELECT 'en', 'common', 'features.events.training.highlight3', 'Regional events'
  UNION ALL SELECT 'fr', 'common', 'features.fsu.projects', 'Projets FSU'
  UNION ALL SELECT 'en', 'common', 'features.fsu.projects', 'FSU Projects'
  UNION ALL SELECT 'fr', 'common', 'features.fsu.projects.desc', 'Découvrez et participez aux projets du Fonds de Solidarité'
  UNION ALL SELECT 'en', 'common', 'features.fsu.projects.desc', 'Discover and participate in Solidarity Fund projects'
  UNION ALL SELECT 'fr', 'common', 'features.fsu.projects.highlight1', 'Suivi en temps réel'
  UNION ALL SELECT 'en', 'common', 'features.fsu.projects.highlight1', 'Real-time tracking'
  UNION ALL SELECT 'fr', 'common', 'features.fsu.projects.highlight2', 'Collaboration ouverte'
  UNION ALL SELECT 'en', 'common', 'features.fsu.projects.highlight2', 'Open collaboration'
  UNION ALL SELECT 'fr', 'common', 'features.fsu.projects.highlight3', 'Impact mesurable'
  UNION ALL SELECT 'en', 'common', 'features.fsu.projects.highlight3', 'Measurable impact'
  UNION ALL SELECT 'fr', 'common', 'features.organizations.directory', 'Annuaire des Organisations'
  UNION ALL SELECT 'en', 'common', 'features.organizations.directory', 'Organizations Directory'
  UNION ALL SELECT 'fr', 'common', 'features.organizations.directory.desc', 'Répertoire complet des organisations partenaires en Afrique'
  UNION ALL SELECT 'en', 'common', 'features.organizations.directory.desc', 'Complete directory of partner organizations in Africa'
  UNION ALL SELECT 'fr', 'common', 'features.organizations.directory.highlight1', 'Cartographie interactive'
  UNION ALL SELECT 'en', 'common', 'features.organizations.directory.highlight1', 'Interactive mapping'
  UNION ALL SELECT 'fr', 'common', 'features.organizations.directory.highlight2', 'Informations détaillées'
  UNION ALL SELECT 'en', 'common', 'features.organizations.directory.highlight2', 'Detailed information'
  UNION ALL SELECT 'fr', 'common', 'features.organizations.directory.highlight3', 'Contacts directs'
  UNION ALL SELECT 'en', 'common', 'features.organizations.directory.highlight3', 'Direct contacts'
  UNION ALL SELECT 'fr', 'common', 'features.shared.resources', 'Ressources Partagées'
  UNION ALL SELECT 'en', 'common', 'features.shared.resources', 'Shared Resources'
  UNION ALL SELECT 'fr', 'common', 'features.shared.resources.desc', 'Bibliothèque de documents, guides et outils pratiques'
  UNION ALL SELECT 'en', 'common', 'features.shared.resources.desc', 'Library of documents, guides and practical tools'
  UNION ALL SELECT 'fr', 'common', 'features.shared.resources.highlight1', 'Documents techniques'
  UNION ALL SELECT 'en', 'common', 'features.shared.resources.highlight1', 'Technical documents'
  UNION ALL SELECT 'fr', 'common', 'features.shared.resources.highlight2', 'Guides méthodologiques'
  UNION ALL SELECT 'en', 'common', 'features.shared.resources.highlight2', 'Methodological guides'
  UNION ALL SELECT 'fr', 'common', 'features.shared.resources.highlight3', 'Outils pratiques'
  UNION ALL SELECT 'en', 'common', 'features.shared.resources.highlight3', 'Practical tools'
) t
CROSS JOIN languages l
CROSS JOIN translation_namespaces n
WHERE l.code = t.lang AND n.name = t.ns
ON CONFLICT (language_id, namespace_id, key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();