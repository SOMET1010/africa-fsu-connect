
# Plan : Cartes de statistiques Premium avec animations et interactivite

## Objectif

Transformer le bloc `HomeFeaturesBlock` (les 3 cartes "54 Pays Membres", "Projets FSU", "Ressources") en composants visuellement percutants avec compteurs animes, effets de survol premium et liens d'action.

## Changements prevus

### 1. Compteur anime au scroll pour "54 Pays Membres"

- Extraire le nombre du titre (ex: "54" de "54 Pays Membres") et l'afficher avec le composant `AnimatedCounter` existant
- L'animation ne demarre que lorsque la carte entre dans le viewport, en utilisant le hook `useScrollReveal` existant
- Le chiffre sera affiche en taille `text-3xl` tandis que le texte restant ("Pays Membres") sera en `text-base` -- creant un point focal immediat

### 2. Effets de survol premium

Chaque carte aura un etat hover enrichi :
- **Bordure lumineuse** : passage de `border-white/10` a `border-[hsl(var(--nx-gold))]/40` au hover
- **Soulevement** : `transform: translateY(-4px)` avec `shadow-lg shadow-[hsl(var(--nx-gold))]/5`
- **Icone animee** : l'icone passe de `text-[hsl(var(--nx-gold))]` a une version plus lumineuse, et le cercle d'icone gagne un glow subtil (`shadow-[hsl(var(--nx-gold))]/20`)
- Transition fluide sur toutes les proprietes (`transition-all duration-300`)

### 3. Glow subtil sur les icones

- Ajouter `shadow-[0_0_12px_hsl(var(--nx-gold)/0.15)]` sur le conteneur d'icone par defaut
- Au hover, intensifier a `shadow-[0_0_20px_hsl(var(--nx-gold)/0.3)]`

### 4. Icone "reseau" pour Projets FSU

- Remplacer `FolderGit2` par `Network` (disponible dans lucide-react) pour mieux illustrer le partage d'experiences et la connexion entre pays

### 5. Liens d'action discrets

- Ajouter un lien "En savoir plus" en bas de chaque carte pour "Projets FSU" (vers `/projects`) et "Ressources" (vers `/resources`)
- Style discret : `text-xs text-[hsl(var(--nx-gold))]/60` avec fleche, visible uniquement au hover de la carte

### 6. Animation d'entree decalee (stagger)

- Chaque carte apparait avec un delai progressif (0ms, 150ms, 300ms) via `ScrollReveal` pour un effet cascade elegant

## Details techniques

### Logique d'extraction du compteur

```text
Titre: "54 Pays Membres"
-> Regex: /^(\d+)\s+(.+)$/
-> number = 54, label = "Pays Membres"
-> Affichage: <AnimatedCounter value={54} /> <span>Pays Membres</span>

Titre sans nombre: "Ressources"
-> Pas de compteur, affichage normal
```

### Structure de carte finale

```text
+------------------------------------------+
|  [icone glow]                            |
|                                          |
|  54          (text-3xl, AnimatedCounter)  |
|  Pays Membres  (text-base)              |
|  Description...  (text-sm)              |
|                                          |
|  En savoir plus ->  (visible au hover)  |
+------------------------------------------+
```

### Liens d'action par carte

| Carte | Lien | Destination |
|---|---|---|
| Pays Membres | Explorer le reseau | `/map` |
| Projets FSU | Voir les projets | `/projects` |
| Ressources | Consulter | `/resources` |

### Fichier modifie

| Fichier | Modifications |
|---|---|
| `src/components/home/HomeFeaturesBlock.tsx` | Ajout AnimatedCounter + useScrollReveal, hover premium avec glow/lift/border, icone Network, liens CTA, stagger animation |
