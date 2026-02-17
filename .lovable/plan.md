
# Plan d'action -- Finalisation SUTEL Nexus (25% restants)

## Etat actuel : ~75% acheve

Le projet dispose de 55+ pages, 30+ tables Supabase, 50 migrations, 13 Edge Functions, et un systeme i18n partiel (FR/EN). Les fondations sont solides. Voici les chantiers restants organises par priorite.

---

## Phase 1 -- Traductions i18n (Priorite haute)

**Probleme** : Seuls 2 fichiers JSON existent (`fr/presentation.json` et `en/presentation.json`). Le reste des traductions est dans un dictionnaire statique de 1200+ lignes (`useTranslation.ts`). Certaines cles manquantes s'affichent en brut sur la page d'accueil (corrige recemment pour retourner `""` au lieu de la cle).

**Actions** :
1. Extraire le dictionnaire statique de `useTranslation.ts` vers des fichiers JSON (`fr/common.json`, `en/common.json`)
2. Completer les traductions anglaises manquantes
3. Ajouter les fichiers arabe (`ar/`) et portugais (`pt/`) pour les contenus principaux
4. Verifier chaque page pour les cles manquantes ou affichees en brut

**Estimation** : 3-4 sessions

---

## Phase 2 -- Donnees de production (Priorite haute)

**Probleme** : La base contient principalement des donnees de demonstration. Aucune donnee reelle des pays membres n'est importee.

**Actions** :
1. Finaliser le module d'import dans la page de configuration (`PlatformConfig.tsx` > onglet Data Imports)
2. Creer un Edge Function d'import CSV/Excel pour les agences, indicateurs et points focaux
3. Valider les schemas de donnees avec les fichiers reels de l'UAT
4. Importer les profils des 55 pays membres africains (noms, codes, regions, statuts)

**Estimation** : 3-4 sessions

---

## Phase 3 -- Securite et Edge Functions (Priorite haute)

**Probleme** : Les politiques RLS ont ete corrigees recemment (cast `user_role`, mapping `user_id`), mais certaines Edge Functions manquent de validation.

**Actions** :
1. Ajouter une authentification JWT sur toutes les Edge Functions sensibles (`ai-writing-assistant`, `forum-moderation`, `batch-sync`)
2. Ajouter un rate limiting sur les fonctions exposees
3. Configurer un monitoring d'erreurs (le `logger.ts` a un TODO pour Sentry)
4. Audit complet des politiques RLS sur les 30+ tables

**Estimation** : 2-3 sessions

---

## Phase 4 -- UX et responsive (Priorite moyenne)

**Probleme** : L'application fonctionne mais certaines pages manquent de polish mobile et d'etats de chargement coherents.

**Actions** :
1. Ajouter des Skeletons de chargement sur les pages qui n'en ont pas (seuls `Admin.tsx` et `Events.tsx` en ont actuellement)
2. Tester et corriger le responsive sur les 55+ pages (priorite : Index, Dashboard, MembersDirectory, Map)
3. Ameliorer les etats vides (empty states) avec des illustrations
4. Verifier la navigation RTL (arabe) sur toutes les pages

**Estimation** : 2-3 sessions

---

## Phase 5 -- Tests et qualite (Priorite moyenne)

**Actions** :
1. Ajouter des tests unitaires sur les hooks critiques (`useTranslation`, `usePlatformConfig`, `useProjects`)
2. Ajouter des tests E2E Playwright sur les parcours cles (connexion, navigation, soumission de projet)
3. Configurer la couverture de code (vitest coverage deja installe)

**Estimation** : 2-3 sessions

---

## Phase 6 -- Deploiement et go-live (Priorite basse, derniere etape)

**Actions** :
1. Remplir la fiche de configuration plateforme (`PlatformConfig.tsx`) avec les vraies informations UAT/ANSUT
2. Collecter les signatures de validation
3. Configurer les integrations email (Mailjet) et analytics (Google Analytics)
4. Publier la version finale sur le domaine de production

**Estimation** : 1-2 sessions

---

## Resume

| Phase | Chantier | Effort | Priorite |
|-------|----------|--------|----------|
| 1 | Traductions i18n | 3-4 sessions | Haute |
| 2 | Donnees de production | 3-4 sessions | Haute |
| 3 | Securite et Edge Functions | 2-3 sessions | Haute |
| 4 | UX et responsive | 2-3 sessions | Moyenne |
| 5 | Tests et qualite | 2-3 sessions | Moyenne |
| 6 | Deploiement | 1-2 sessions | Basse |

**Total estime : 14-19 sessions pour atteindre 100%**

Par quelle phase souhaitez-vous commencer ?
