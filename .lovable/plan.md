
# Plan : Refonte Premium de la carte des membres

## Problemes identifies

1. **Fond trop sombre** : les tuiles `dark_nolabels` de CartoDB rendent la carte quasi noire, sans frontieres visibles
2. **Zoom mal cadre** : centre sur [5, 20] avec zoom 3, laissant beaucoup d'espace vide autour de l'Afrique
3. **Chevauchement des marqueurs** : taille unique (36px), les pays proches (Afrique de l'Ouest, Afrique centrale) se superposent
4. **Tooltips basiques** : seulement le nom du pays et le statut, pas de donnees chiffrees (projets, contributions)
5. **Pas de filtrage** : aucun moyen de basculer entre Projets / Contributions / Tendances
6. **Bouton CTA peu visible** : bordure blanche transparente, se fond dans le fond sombre
7. **Taille des marqueurs non proportionnelle** aux donnees

## Changements prevus

### 1. Fond de carte "Midnight Blue" avec frontieres (`HomeMemberMap.tsx`)

- Remplacer les tuiles `dark_nolabels` par `dark_all` (CartoDB Dark Matter avec labels/frontieres)
- Appliquer un filtre CSS leger `hue-rotate(210deg) saturate(0.7) brightness(1.1)` pour obtenir un ton bleu nuit au lieu du noir pur
- Cela fait apparaitre les frontieres en gris clair et donne un fond "midnight blue" professionnel

### 2. Zoom centre sur l'Afrique

- Changer le centre a `[2, 20]` avec zoom `3.5`
- Ajouter `maxBounds` pour limiter le panoramique au continent africain (lat -40 a 40, lng -25 a 55)

### 3. Marqueurs proportionnels avec degradee de couleur

- Taille dynamique basee sur les contributions : de 28px (observateur) a 48px (tres actif)
- Remplacer les drapeaux emoji par le code pays (2 lettres) pour un look plus institutionnel
- Cercle avec fond en degradee d'opacite selon le niveau d'activite
- Garder le code couleur existant (vert/bleu/ambre/gris)

### 4. Tooltips enrichis

Au survol, afficher une carte flottante avec :
- Drapeau + nom complet du pays
- Badge de statut colore
- Nombre de contributions (icone)
- Nombre de projets (icone)
- Derniere activite

### 5. Barre de filtres par mode (`HomeMemberMapBlock.tsx`)

Ajouter 3 boutons au-dessus de la carte :
- **Membres** (par defaut) : taille = contributions
- **Projets** : taille = nombre de projets
- **Tendances** : taille = trendScore

Les donnees existent deja dans `activityData.ts` (`MapMode`, `getValueByMode`, `getLabelByMode`).

### 6. Bouton CTA plus visible

- Passer a un fond semi-blanc `bg-white/15` avec bordure plus marquee `border-white/40`
- Ajouter une ombre portee `shadow-lg`

### 7. Legende enrichie

Ajouter sous chaque pastille le nombre de pays concernes pour chaque niveau.

## Details techniques

### Fichiers modifies

| Fichier | Modifications |
|---|---|
| `src/components/home/HomeMemberMap.tsx` | Tuiles dark_all + filtre CSS, centre/zoom Afrique, maxBounds, marqueurs proportionnels avec code pays, tooltips enrichis avec projets/contributions |
| `src/components/home/HomeMemberMapBlock.tsx` | Barre de filtres (3 boutons Membres/Projets/Tendances), legende avec compteurs, bouton CTA plus visible |

### Logique des marqueurs proportionnels

```text
Taille = 28 + (contributions / maxContributions) * 20

Resultat :
- Observateur (1 contrib) -> ~28px
- Onboarding (5 contrib)  -> ~33px
- Medium (12 contrib)     -> ~39px
- High (22 contrib)       -> ~48px
```

### Filtre CSS pour le fond "Midnight Blue"

```text
.leaflet-tile-pane {
  filter: hue-rotate(210deg) saturate(0.7) brightness(1.1);
}
```

Ce filtre transforme le noir pur de CartoDB Dark Matter en un bleu nuit elegant, tout en gardant les frontieres et labels visibles grace a l'utilisation de `dark_all` au lieu de `dark_nolabels`.

### Structure de la barre de filtres

```text
[Membres]  [Projets]  [Tendances]
   actif     inactif     inactif
```

Boutons compacts en haut a droite de la section, utilisant le state local `useState<MapMode>('members')` passe au composant `HomeMemberMap` pour ajuster la taille des marqueurs dynamiquement.
