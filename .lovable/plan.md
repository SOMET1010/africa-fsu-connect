
# Plan : Refonte visuelle de la carte des membres (Homepage)

## Probleme actuel

La carte utilise le composant `CommandCenterMap` concu pour un tableau de bord "command center" avec :
- Un filtre CSS tres sombre (`brightness(0.7) grayscale(0.3)`) qui rend la carte quasi invisible
- Une grille tactique en surimpression (dots blancs)
- Un effet vignette qui assombrit encore les bords
- Des marqueurs HUD militaires avec animations "pulse" et badges de chiffres -- trop charges pour une homepage

Le resultat est une zone sombre, chargee et peu lisible sur la page d'accueil.

## Solution proposee

Creer un nouveau composant dedie `HomeMemberMap` optimise pour la homepage, avec un style epure et institutionnel.

### Changements cles

**1. Nouveau composant `src/components/home/HomeMemberMap.tsx`**

Un composant Leaflet autonome (sans reutiliser `CommandCenterMap`) avec :
- Fond de carte CartoDB Dark Matter (sans labels) SANS filtres CSS -- la carte reste lisible
- Pas de grille tactique ni de vignette
- Marqueurs simplifies : cercles colores avec drapeau emoji au centre, sans badge de chiffres ni animation pulse
- Taille uniforme des marqueurs (pas de variation par activite)
- Couleurs par niveau : vert (actif), bleu (membre), ambre (integration), gris (observateur)
- Popup au hover : design epure avec nom du pays et statut, fond semi-transparent
- Zoom desactive (scroll wheel) pour eviter le piege de scroll sur la homepage
- Bordure subtile doree (`nx-gold`) autour du conteneur de carte

**2. Mise a jour de `HomeMemberMapBlock.tsx`**

- Remplacer `CommandCenterMap` par le nouveau `HomeMemberMap`
- Ajouter une legende compacte sous la carte (4 niveaux de statut avec pastilles colorees)
- Augmenter legerement le padding et l'espacement

### Apercu du design

```text
+--------------------------------------------------+
|           Reseau continental (badge)              |
|       Participation des Membres (titre)           |
|           Description (sous-titre)                |
|                                                   |
|  +----------------------------------------------+ |
|  |                                              | |
|  |     Carte Leaflet sombre                     | |
|  |     avec marqueurs cercles + drapeaux        | |
|  |     sans filtres ni grille                   | |
|  |                                              | |
|  +----------------------------------------------+ |
|                                                   |
|   [vert] Actif  [bleu] Membre  [ambre] En        |
|   integration  [gris] Observateur                 |
|                                                   |
|        [ Explorer la carte complete -> ]          |
+--------------------------------------------------+
```

### Details techniques

| Aspect | Avant (CommandCenterMap) | Apres (HomeMemberMap) |
|---|---|---|
| Filtres CSS | brightness 0.7, grayscale 0.3 | Aucun |
| Grille overlay | Oui (dots blancs) | Non |
| Vignette | Oui (gradient radial) | Non |
| Marqueurs | HUD pulse + badge chiffres (3 tailles) | Cercles simples + drapeau (taille unique) |
| Scroll zoom | Active | Desactive |
| Legende | Absente | Integree sous la carte |

### Fichiers concernes

| Fichier | Action |
|---|---|
| `src/components/home/HomeMemberMap.tsx` | Creer -- composant Leaflet epure |
| `src/components/home/HomeMemberMapBlock.tsx` | Modifier -- utiliser `HomeMemberMap` + ajouter legende |
