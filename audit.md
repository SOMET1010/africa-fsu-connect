# Audit — Modules vs Implementation

> Date: 26 February 2026  
> Sources: `module-app/modules/module-*.md`, `src/`, `supabase/migrations`

## Methodology
1. Mapped each module definition in `module-app/modules` to the corresponding React pages, hooks and Supabase migrations.
2. Verified critical workflows (authentication, documents, events, dashboards) still match the module expectations.
3. Logged outstanding gaps and ensured enums, role labels and persisted data remain aligned with the database schema.

## Module status

| Module | Status | Evidence / Notes |
| --- | --- | --- |
| Module 1 – Authentication & Users | ✅ Implemented with improvements | `src/pages/Auth.tsx`, `src/pages/auth/components/SignupForm.tsx`, `src/contexts/AuthContext.tsx`, new `src/types/userRole.ts`; signup now offers a `role` select tied to the `user_role` enum and inserts/merges a `profiles` row so the profile is saved immediately. |
| Module 2 – Projects & Mapping | ✅ Implemented | `src/pages/projects`, `src/hooks/useProjects.ts`, and `supabase/migrations/20260224125002_create_agency_projects.sql` deliver CRUD, filters and mapping per `module-2-projects.md`. |
| Module 3 – Document Library | ✅ Implemented | Document uploads, versioning, enums (`document_type`) and access controls live in `src/components/resources` + `supabase/migrations/20260224125013_create_documents.sql`. Enum values stay in English to match Postgres. |
| Module 4 – Forum & Community | ⚠️ Partial | Forum tables, `src/pages/Forum.tsx` and `supabase/functions/forum-moderation` exist but real‑time mentions/notifications remain on the backlog. |
| Module 5 – Collaboration | ⚠️ Partial | UI scaffolding is present, but there is no database-backed `collaborative_docs` system yet. |
| Module 6 – Learning | ⚠️ Partial | Learning catalog UI (`src/pages/ELearning.tsx`) exists; persistence (courses/enrollments/quiz) still missing. |
| Module 7 – Agenda & Events | ✅ Implemented | `src/pages/Events.tsx`, `supabase/migrations/20260224125017-20260224125018`, and `event-reminders` function satisfy the module scope. |
| Module 8 – Dashboard & Reporting | ✅ Implemented | Dashboards draw from `useDashboardStats`, Recharts widgets, and Supabase analytics tables per `module-8-dashboard.md`. |
| Module 9 – Back Office | ✅ Implemented | Admin routes, role guards (e.g., `config/routes.ts`) and audit tables cover the module needs. |
| Module 10 – API & Integrations | ⚠️ Partial | Edge functions, notifications and sync helpers exist, but UIT connector / API key gating still pending. |

## Observations
- The `user_role` enum remains English; the new `role` dropdown reuses those values to avoid mismatches between UI labels and stored data.
- Signup now upserts a `profiles` row with the chosen role, first/last name, country and organization, ensuring the backend reflects the registration immediately.
- Tests: `npm run lint` currently fails because `eslint-plugin-react-hooks` expects a different API (`context.getSourceCode`) in this ESLint version; no code changes were flagged beyond that plugin error.

## Next actions
1. Decide whether `focal_point` users should share the same editing permissions as contributors and update guards if needed.
2. Complete the remaining Module 4/5/6/API gaps noted above before the next release milestone.
