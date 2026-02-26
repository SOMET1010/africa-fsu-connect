# 📋 Audit Fonctionnel vs Modules

## Module 1 – Authentification & gestion des utilisateurs
- **Implémenté** : Supabase (migrations `20260224124520...`, profils, rôles).
- `src/contexts/AuthContext.tsx` gère inscription/connexion, journalisation, mots de passe, mise à jour.
- UIs admin (AdminUsers, QuickActions, navigation, tests de rôle) alignés sur les nouveaux noms de rôles.

## Module 2 – Projets & cartographie
- **Implémenté** : `agency_projects` table + RLS (`migrations/20260224125002_create_agency_projects.sql`).
- Hooks CRUD avec pagination/optimistic updates dans `src/hooks/useProjects.ts`.
- Sync et résolution de conflits ciblent `agency_projects`.

## Module 3 – Bibliothèque documentaire
- **Implémenté** : documents table, énumération, hooks (`learningContentService`, `ResourceFilters`, `DocumentUploadDialog`).
- TypeScript/JSUI alignés sur les mêmes `document_type` anglais.

## Module 4 – Forum & communauté
- **Implémenté** : tables posts/topics + front (`src/pages/Forum.tsx`) et fonctions de modération (`supabase/functions/forum-moderation/index.ts`).

## Module 5 – Co-rédaction collaborative
- **Non implémenté** : aucun code ou table `collaborative_docs` existant.
- Nécessite sélection d’un éditeur collaboratif et endpoints CRUD/versioning.

## Module 6 – Formation & e-learning
- **Partiel** : documents appliqués aux “contenus” (learning service), mais pas de catalogues/formations/quiz/certifications.

## Module 7 – Agenda & coordination
- **Implémenté** : table `events`, hooks `useEvents` + `useEventsPage`, page `src/pages/Events.tsx` avec filtres, création, inscription et export calendrier.

## Module 8 – Dashboard & reporting
- **Implémenté** : métriques projets/événements dans `src/pages/Admin.tsx`, `dashboard` widgets, stats (`useEnhancedDashboardStats`, `useAdvancedStats`).

## Module 9 – Back office admin
- **Implémenté** : navigation admin, security guards, QuickActions, AppRoutes, sidebar, etc., tous alignés sur les nouveaux rôles.

## Module 10 – API & intégrations
- **Partiel** : fonctions serverless (notifications, import, sync) et hooks Supabase exposent des endpoints, mais pas encore d’API publique documentée.

## Recommandations
1. **Développer le module 5 (co-rédaction)** : créer table `collaborative_docs`, endpoints, interface d’éditeur reprenant versioning/commentaires.
2. **Étendre le module 6** pour formaliser formations (cours/enrollments, quiz, certificats). La doc anglaise reste nécessaire dans les suites.
3. **Stabiliser la stratégie API** (module 10) en livrant une doc REST publique + clés/monitoring.
