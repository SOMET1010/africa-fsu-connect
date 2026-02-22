
# Corrections de liens casses et navigation incoherente (P0)

Ce plan corrige les 4 problemes de navigation identifies qui causent une experience "pas finie" pour les utilisateurs.

---

## 1. Route `/network/members` inexistante (404)

**Probleme** : `NexusRegions.tsx` construit des liens vers `/network/members?region=...` mais seule `/members` existe dans les routes.

**Correction** : Dans `src/components/network/NexusRegions.tsx`, remplacer toutes les occurrences de `/network/members` par `/members`. Ajouter aussi la lecture du parametre `region` dans `MembersDirectory.tsx` (le hook `useMembersDirectory` expose deja `setSelectedRegion`).

| Fichier | Modification |
|---|---|
| `src/components/network/NexusRegions.tsx` | `/network/members?region=...` devient `/members?region=...` |
| `src/pages/MembersDirectory.tsx` | Ajouter un `useEffect` qui lit `searchParams.get('region')` et appelle `setSelectedRegion()` (similaire au pattern `language` deja present) |

---

## 2. CTA "S'inscrire" qui n'ouvre pas l'onglet Inscription

**Probleme** : Les liens `/auth?tab=signup` et `/auth?mode=signup` menent a la page Auth mais l'onglet reste sur "Connexion" car `Tabs` utilise `defaultValue="login"` sans synchronisation avec l'URL.

**Correction** : Dans `src/pages/Auth.tsx`, lire le parametre URL (`tab` ou `mode`) via `useSearchParams` et piloter l'onglet actif avec un state controle.

| Fichier | Modification |
|---|---|
| `src/pages/Auth.tsx` | Importer `useSearchParams`, initialiser `activeTab` depuis l'URL, passer `value={activeTab}` et `onValueChange={setActiveTab}` a `Tabs` |
| `src/components/home/HomeHeroBlock.tsx` | Harmoniser vers `/auth?tab=signup` (remplacer `mode=signup`) |

---

## 3. Navigation "Evenements" depuis le Dashboard pointe vers `/community?tab=events`

**Probleme** : `NetworkDashboard.tsx` navigue vers `/community?tab=events` mais `Community.tsx` n'a pas de systeme d'onglets -- la page affiche toujours les communautes linguistiques.

**Correction** : Rediriger vers `/events` (route existante et fonctionnelle) au lieu de `/community?tab=events`.

| Fichier | Modification |
|---|---|
| `src/components/dashboard/NetworkDashboard.tsx` | `navigate('/community?tab=events')` devient `navigate('/events')` et `navigate(\`/community?tab=events&id=${eventId}\`)` devient `navigate(\`/events?id=${eventId}\`)` |

---

## 4. LiferayApp desynchronise (P1)

**Probleme** : `LiferayApp.tsx` maintient une table de routes separee avec seulement 15 routes (dont `/docs` au lieu de `/resources`), alors que l'app principale en a 40+. Les utilisateurs Liferay voient des 404 pour la majorite des pages.

**Correction** : Refactoriser `LiferayApp.tsx` pour reutiliser la configuration `ROUTES` de `src/config/routes.ts` au lieu de dupliquer les routes manuellement. Ajouter une redirection `/docs` vers `/resources` pour la retrocompatibilite.

| Fichier | Modification |
|---|---|
| `src/LiferayApp.tsx` | Importer `ROUTES`, generer les `<Route>` dynamiquement a partir de la config (meme logique que `AppRoutes.tsx`), ajouter une redirection `/docs` vers `/resources` |

---

## Resume des fichiers modifies

| Fichier | Nature |
|---|---|
| `src/components/network/NexusRegions.tsx` | Corriger liens `/network/members` vers `/members` |
| `src/pages/MembersDirectory.tsx` | Lire parametre `region` depuis l'URL |
| `src/pages/Auth.tsx` | Synchroniser onglet actif avec parametre URL |
| `src/components/home/HomeHeroBlock.tsx` | Harmoniser `mode=signup` vers `tab=signup` |
| `src/components/dashboard/NetworkDashboard.tsx` | Rediriger events vers `/events` |
| `src/LiferayApp.tsx` | Unifier routing avec `ROUTES` config |

Total : 6 fichiers modifies, 0 fichier cree, 0 dependance ajoutee, 0 migration SQL.
