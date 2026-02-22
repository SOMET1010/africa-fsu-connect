# Audit Navigation & UX — Rapport

Date : 2026-02-22

---

## ✅ Corrections appliquées

### P0 — Liens cassés (404)

| # | Fichier | Avant | Après |
|---|---------|-------|-------|
| 1 | `src/pages/FocalDashboard.tsx` | 3× `<a href="/indicators/submit">` | `<Link to="/submit">` (route existante) |
| 2 | `src/components/dashboard/NetworkDashboard.tsx` | `navigate('/community')` pour "Voir toute l'activité" | `navigate('/activity')` |
| 3 | `src/pages/Forum.tsx` | `avatar: "/api/placeholder/40/40"` | `avatar: ""` (AvatarFallback gère) |
| 4 | `src/components/dashboard/widgets/LearningWidget.tsx` | `to="/projects?filter=inspiring"` (param ignoré) | `to="/practices"` (page dédiée) |

### P1 — Incohérences de navigation

| # | Fichier | Avant | Après |
|---|---------|-------|-------|
| 5 | `src/components/community/CommunityLanguageMap.tsx` | `href="/members?country=${code}"` (param non lu) | `href="/country/${code}"` (fiche pays) |
| 6 | `src/pages/PublicDashboard.tsx` | `<a href="/map">` (full reload) | `<Link to="/map">` |

### Corrections précédentes (même sprint)

| Fichier | Modification |
|---------|-------------|
| `src/hooks/usePreloader.ts` | `'/docs'` → `'/resources'` |
| `src/components/admin/AdminLayout.tsx` | Suppression `src="/api/placeholder/32/32"` |
| `src/pages/MembersDirectory.tsx` | Validation `regionParam` contre liste `regions` |

---

## 📋 Points restants

### P1

| # | Fichier | Problème | Action requise |
|---|---------|----------|---------------|
| 6 | `src/components/organizations/LeafletInteractiveMap.tsx` | `href="/organizations"` et `href="/forum"` en `<a>` natif dans popup Leaflet | Acceptable (pas de contexte React dans popup Leaflet). Documenté. |

### P2

| # | Problème | Action |
|---|----------|--------|
| 8 | `RegionCards.tsx` utilise `region.name` pour le query param, `NexusRegions.tsx` utilise `region.slug` | La validation côté `MembersDirectory` protège contre les valeurs invalides. Harmonisation optionnelle. |
| 9 | Couleurs hardcodées (lint warnings) dans `FocalDashboard.tsx`, `Forum.tsx` | Pré-existant, non bloquant. Refactoring design tokens recommandé. |

---

## 🗺️ Routes déclarées (exhaustif)

Toutes les routes dans `src/config/routes.ts` ont un composant lazy existant. Aucune route orpheline.

### Routes publiques
`/`, `/network`, `/members`, `/community`, `/country/:code`, `/activity`, `/about`, `/contact`, `/presentation`, `/public-dashboard`, `/strategies`, `/roadmap`, `/privacy`, `/terms`, `/auth`

### Routes protégées
`/dashboard`, `/indicators`, `/my-country`, `/map`, `/organizations`, `/agency-documents`, `/projects`, `/collaboration`, `/resources`, `/practices`, `/webinars`, `/forum`, `/submit`, `/my-contributions`, `/concept-note`, `/events`, `/profile`, `/preferences`, `/preferences/advanced`, `/security`, `/analytics`, `/demo-guide`, `/elearning`, `/watch`, `/coauthoring`, `/suta-assistant`

### Routes admin
`/admin`, `/admin/users`, `/admin/forum`, `/admin/resources`, `/admin/dashboard`, `/admin/focal-points`, `/admin/config`, `/admin/translations`, `/admin/i18n-qa`, `/admin/homepage`, `/focal-dashboard`, `/advanced`, `/presentation/analytics`

---

## 🛡️ Garde-fous

- Test automatisé : `src/test/navigation-routes.test.ts`
  - Vérifie l'absence de `/api/placeholder` dans le code source
  - Vérifie l'absence de liens vers `/indicators/submit` (route supprimée)
  - Liste de référence des routes connues validées
