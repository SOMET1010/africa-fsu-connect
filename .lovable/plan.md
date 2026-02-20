

# Corrections d'accessibilite et de qualite -- Audit Score 6.2/10

Ce plan cible les problemes concrets et corrigeables identifies dans l'audit. Les faux positifs (backend inexistant, pages manquantes, formulaires non fonctionnels) ont deja ete demystifies dans l'analyse precedente.

---

## 1. Images sans attribut `alt` descriptif (Accessibilite WCAG 2.1)

L'audit signale 18 images sans alt text. Apres verification du code :

| Fichier | Probleme | Correction |
|---|---|---|
| `src/components/practices/PracticeCover.tsx` | `alt=""` sur les images de couverture | Ajouter un prop `altText` avec fallback `"Illustration de bonne pratique"` |
| `src/components/admin/AdminLayout.tsx` | `AvatarImage src="/api/placeholder/32/32"` sans alt | Ajouter `alt="Avatar administrateur"` |
| `src/components/layout/SimplifiedSidebar.tsx` | `AvatarImage` sans alt | Ajouter `alt="Photo de profil"` |
| `src/components/layout/ModernSidebar.tsx` | `AvatarImage` sans alt | Ajouter `alt="Photo de profil"` |
| `src/components/layout/AppSidebar.tsx` | `AvatarImage` sans alt | Ajouter `alt="Photo de profil"` |
| `src/components/forum/ModernForumCard.tsx` | `AvatarImage` sans alt | Ajouter `alt={author.name}` |

---

## 2. Contraste insuffisant (61 elements signales)

Les principaux coupables sont les textes `text-white/50`, `text-white/60`, `text-white/70` sur fond sombre. Le ratio WCAG AA exige 4.5:1 pour le texte normal.

Corrections ciblees :

| Fichier | Element | Avant | Apres |
|---|---|---|---|
| `PublicHeader.tsx` | Sous-titre "Digital Connect Africa" | `text-white/60` | `text-white/80` |
| `HomePartnersBlock.tsx` | Titre section partenaires | `text-white/50` | `text-white/70` |
| `HomePartnersBlock.tsx` | Noms partenaires | `text-white/75` | `text-white/90` |
| `HomeMemberMapBlock.tsx` | Badge "Reseau continental" | `text-white/70` | `text-white/80` |
| `HomeMemberMapBlock.tsx` | Description section | `text-white/70` | `text-white/80` |
| `HomeTrustSection.tsx` | Descriptions piliers | `text-white/70` | `text-white/80` |
| `HomeMessagesBlock.tsx` | Citations | `text-white/70` | `text-white/85` |
| `HomeFeaturesBlock.tsx` | Descriptions features | `text-white/70` | `text-white/80` |

---

## 3. Navigation : regrouper pour reduire la charge cognitive

L'audit signale 7 items dans la navigation principale. Le menu "Projets" redirige vers une page protegee (login requis), ce qui est deroutant pour un visiteur.

Correction : Retirer "Projets" du menu public (accessible uniquement apres connexion via le sidebar). Cela reduit le menu a 6 items.

| Fichier | Modification |
|---|---|
| `src/components/layout/PublicHeader.tsx` | Supprimer la ligne `{ path: "/projects", ... }` de `NAV_ITEMS` |

---

## 4. PracticeCover : alt text dynamique

Ajouter un prop optionnel `altText` au composant `PracticeCover` pour que les images de couverture aient un texte alternatif significatif.

| Fichier | Modification |
|---|---|
| `src/components/practices/PracticeCover.tsx` | Ajouter prop `altText?: string`, utiliser `alt={altText \|\| "Illustration de bonne pratique"}` |

---

## Resume des fichiers modifies

| Fichier | Nature |
|---|---|
| `src/components/practices/PracticeCover.tsx` | Alt text dynamique |
| `src/components/admin/AdminLayout.tsx` | Alt sur AvatarImage |
| `src/components/layout/SimplifiedSidebar.tsx` | Alt sur AvatarImage |
| `src/components/layout/ModernSidebar.tsx` | Alt sur AvatarImage |
| `src/components/layout/AppSidebar.tsx` | Alt sur AvatarImage |
| `src/components/forum/ModernForumCard.tsx` | Alt sur AvatarImage |
| `src/components/layout/PublicHeader.tsx` | Retirer "Projets" du menu public + contraste sous-titre |
| `src/components/home/HomePartnersBlock.tsx` | Contraste textes |
| `src/components/home/HomeMemberMapBlock.tsx` | Contraste textes |
| `src/components/home/HomeTrustSection.tsx` | Contraste descriptions |
| `src/components/home/HomeMessagesBlock.tsx` | Contraste citations |
| `src/components/home/HomeFeaturesBlock.tsx` | Contraste descriptions |

Total : 12 fichiers modifies, 0 dependances ajoutees.

## Points hors perimetre (rappel)

- **Badge Lovable** : Parametres projet > Hide Lovable Badge
- **Backend/Auth** : Deja fonctionnel via Supabase (signalement faux positif)
- **Pages manquantes** : Toutes implementees (signalement faux positif)
- **Validation formulaires** : Deja implementee (email + force du mot de passe)
- **Dashboard utilisateur** : Existe derriere l'authentification
- **Carte interactive** : Version complete sur /map, version simplifiee en homepage volontairement

