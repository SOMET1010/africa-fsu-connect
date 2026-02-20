

# Toggle de mise en page deux zones pour la page d'accueil

## Contexte

La page d'accueil utilise actuellement une structure fixe en deux zones : hero sombre en haut, contenu clair au milieu, footer sombre en bas. L'objectif est de permettre aux utilisateurs de basculer entre ce mode clair et un mode entierement sombre (comme l'ancien design).

## Fonctionnement

Un nouveau champ `homeLayout` sera ajoute aux preferences utilisateur avec deux options :
- **`light`** (defaut) : hero sombre + contenu clair + footer sombre (design actuel)
- **`immersive`** : toute la page en fond sombre avec texte clair (ancien design)

La preference est sauvegardee via le systeme existant (Supabase pour les utilisateurs connectes, localStorage pour les visiteurs).

## Modifications

### 1. `src/contexts/UserPreferencesContext.tsx`

Ajouter `homeLayout: 'light' | 'immersive'` a l'interface `UserPreferences` et au `defaultPreferences` (valeur par defaut : `'light'`).

### 2. `src/pages/Index.tsx`

- Importer `useUserPreferences`
- Lire `preferences.homeLayout`
- Conditionner les classes CSS de la zone contenu :
  - `light` : `bg-[hsl(var(--nx-bg))]` (actuel)
  - `immersive` : `bg-[hsl(var(--nx-night))]` avec une classe `dark-zone` qui sera utilisee par les composants enfants

Passer un prop `darkMode` aux composants enfants, ou utiliser un simple wrapper CSS avec un attribut `data-zone="dark"` que les composants peuvent lire.

### 3. `src/components/home/HomeLayoutToggle.tsx` (nouveau fichier)

Un petit bouton flottant en bas a droite de l'ecran avec deux icones (soleil/lune) permettant de basculer entre les modes. Il appelle `updatePreferences({ homeLayout: ... })`.

- Position fixe, `bottom-6 right-6`, `z-50`
- Deux icones : Sun pour le mode clair, Moon pour le mode immersif
- Tooltip expliquant la fonction
- Transition animee au clic

### 4. `src/components/preferences/PreferencesPanel.tsx`

Ajouter dans l'onglet "Apparence" un selecteur pour la mise en page de la page d'accueil avec les deux options (Clair / Immersif), juste apres le selecteur de theme existant.

### 5. Composants home (ajustement conditionnel)

Les 6 composants de la zone contenu recoivent un prop `variant?: 'light' | 'dark'` (defaut `'light'`). Quand `variant="dark"`, ils utilisent les classes sombres (`text-white`, `bg-white/5`, etc.) au lieu des classes claires.

Fichiers concernes :
- `HomeMemberMapBlock.tsx`
- `HomeFeaturesBlock.tsx`
- `HomeTrustSection.tsx`
- `HomeMessagesBlock.tsx`
- `HomeCtaBlock.tsx`
- `HomePartnersBlock.tsx`

Chaque composant utilisera un simple ternaire sur le prop variant pour choisir ses classes CSS (texte, fond des cartes, bordures).

## Details techniques

| Fichier | Action |
|---------|--------|
| `src/contexts/UserPreferencesContext.tsx` | Ajouter `homeLayout` au type et aux valeurs par defaut |
| `src/pages/Index.tsx` | Lire la preference, conditionner les classes, passer le variant aux enfants, afficher le toggle |
| `src/components/home/HomeLayoutToggle.tsx` | Creer -- bouton flottant Sun/Moon |
| `src/components/preferences/PreferencesPanel.tsx` | Ajouter selecteur "Mise en page accueil" dans l'onglet Apparence |
| `src/components/home/HomeMemberMapBlock.tsx` | Ajouter prop `variant` et classes conditionnelles |
| `src/components/home/HomeFeaturesBlock.tsx` | Ajouter prop `variant` et classes conditionnelles |
| `src/components/home/HomeTrustSection.tsx` | Ajouter prop `variant` et classes conditionnelles |
| `src/components/home/HomeMessagesBlock.tsx` | Ajouter prop `variant` et classes conditionnelles |
| `src/components/home/HomeCtaBlock.tsx` | Ajouter prop `variant` et classes conditionnelles |
| `src/components/home/HomePartnersBlock.tsx` | Ajouter prop `variant` et classes conditionnelles |

## Impact

- 10 fichiers modifies/crees
- Aucune dependance ajoutee
- Retrocompatible : le mode `light` est le defaut, aucun changement visuel sans action utilisateur
- La preference persiste entre les sessions via le systeme existant

