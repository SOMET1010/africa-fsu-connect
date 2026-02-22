
# Refonte de l'ecran Reseau -- Design institutionnel clair et lisible

## Constat actuel

La page `/network` (fichier `src/pages/NetworkView.tsx`) presente :
- Un hero sombre (gradient primary) avec badge "Reseau actif" peu visible
- Le bouton secondaire "Explorer les projets" quasi invisible (outline blanc sur fond sombre)
- Aucune carte interactive ni KPI visible
- Aucune section "Pays membres" avec filtres
- Les sections existantes (UAT, Communautes linguistiques, Regions, Timeline, Actions) sont correctes en structure mais manquent de hierarchie

## Modifications prevues

### 1. Hero -- Fond clair, KPI visible, CTA renforcee

**Fichier : `src/pages/NetworkView.tsx`**

Remplacer le hero sombre par un hero blanc :
- Fond : `bg-white border-b border-gray-200` au lieu du gradient sombre
- Badge KPI : "Reseau actif -- 54 pays" dans un badge vert bien visible (`bg-emerald-50 text-emerald-700 border border-emerald-200`) avec un point vert anime
- Titre : `text-gray-900 text-3xl font-bold` -- raccourcir a "Le reseau des agences du service universel"
- Description : raccourcir a une seule ligne -- "Cooperation et partage entre 54 pays africains"
- Bouton primaire : "Voir les pays membres" -- `bg-primary text-white`
- Bouton secondaire : "Explorer les projets" -- `border-primary text-primary hover:bg-primary/5` (outline bleu visible au lieu de blanc)
- Fil d'Ariane : garder tel quel (deja present au-dessus)

### 2. Barre KPI sous le hero

**Fichier : `src/pages/NetworkView.tsx`** (nouvelle section inline)

Ajouter 4 cartes KPI juste sous le hero :
- 54 Pays membres (+3 cette annee)
- 127 Projets actifs (+18 ce trimestre)
- 5 Regions couvertes
- 4 Communautes linguistiques

Design : `bg-white rounded-xl border border-gray-200 shadow-sm p-4`
- Chiffres : `text-3xl font-bold text-gray-900`
- Labels : `text-xs text-gray-500 uppercase tracking-wide`
- Tendances "+3" : `text-xs text-emerald-600 font-medium`

Donnees depuis `useAfricanCountries()` pour le compte reel des pays.

### 3. Section Pays Membres avec carte et filtres

**Nouveau composant : `src/components/network/NetworkMembersGrid.tsx`**

Grille 2 colonnes (gauche : pays, droite : carte) :

**Colonne gauche -- Liste pays** :
- Titre "Pays Membres" avec icone Globe + lien "Voir tout" vers `/members`
- Barre de filtres : 3 boutons radio (Tous / Actif / En integration) + champ recherche compact
- Grille 2x3 de cartes pays :
  - Drapeau emoji (grand)
  - Nom en gras `font-semibold text-gray-900`
  - Badge statut : "Actif" vert ou "En integration" bleu
  - Compteur projets en petit
- Lien "+48 autres pays" en bas
- Donnees depuis `useAfricanCountries()`

**Colonne droite -- Carte** :
- Carte Leaflet dans une card blanche `bg-white rounded-xl border border-gray-200 shadow-sm`
- Pas de filtre CSS hue-rotate (style clair)
- Legende en bas de la card
- Reutiliser `LeafletInteractiveMap` ou `HomeMemberMap`

### 4. Section UAT -- Conserver, ajuster spacing

**Fichier : `src/components/network/UATCoordinationSection.tsx`**

Pas de changement structurel, mais uniformiser :
- `rounded-xl` au lieu de `rounded-2xl`
- `shadow-sm` coherent
- `border-gray-200`

### 5. Sections existantes -- Uniformisation

**Fichiers concernes :**
- `src/components/network/LinguisticCommunitiesSection.tsx` -- garder tel quel (deja propre)
- `src/components/network/RegionCards.tsx` -- uniformiser `rounded-xl border-gray-200 shadow-sm`
- `src/components/network/ActivityTimeline.tsx` -- uniformiser bordures
- `src/components/ui/nexus-card.tsx` -- pas de changement (utilise dans les action cards)

### 6. Design tokens appliques

Tous les composants modifies suivront :
- Bordures : `border-gray-200`
- Radius : `rounded-xl` (12px)
- Shadow : `shadow-sm` uniquement
- Typographie : `text-gray-900` titres, `text-gray-600` descriptions, `text-gray-500` labels
- Fond : `bg-white` pour les cartes, `bg-slate-50` pour les sections alternees
- Zero particule, zero glow, zero gradient decoratif

## Fichiers modifies

| Action | Fichier |
|--------|---------|
| Modifier | `src/pages/NetworkView.tsx` -- hero clair, barre KPI, integration carte+pays |
| Creer | `src/components/network/NetworkMembersGrid.tsx` -- grille pays + carte + filtres |
| Modifier | `src/components/network/UATCoordinationSection.tsx` -- uniformiser spacing |
| Modifier | `src/components/network/RegionCards.tsx` -- uniformiser tokens |
| Modifier | `src/components/network/PresenceIndicator.tsx` -- adapter au fond clair |

## Composants reutilises
- `useAfricanCountries()` -- donnees pays
- `LeafletInteractiveMap` ou `HomeMemberMap` -- carte dans la grille
- `PresenceIndicator` -- adapte pour fond clair (texte gris au lieu de blanc)
- `NexusActionCard` -- cartes actions en bas (inchangees)
