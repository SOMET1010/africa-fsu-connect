

# Plan : Dynamiser la page Roadmap et ameliorer le design

## Modifications prevues

### 1. Renforcer le Hero de la page Roadmap

**Fichier : `src/pages/Roadmap.tsx`** (section PageHero)

- Remplacer le composant `PageHero` generique par un hero personnalise avec un arriere-plan degrade plus sombre (`from-[hsl(var(--nx-night))] via-[hsl(var(--nx-bg))] to-[hsl(var(--nx-night))]`)
- Augmenter la taille du titre a `text-4xl md:text-5xl` avec `font-extrabold`
- Mettre les mots "Transformation Numerique" en surbrillance avec la couleur dore (`text-[hsl(var(--nx-gold))]`) via un `<span>` dedie
- Augmenter le contraste du sous-titre : passer de `text-white/60` a `text-white/85`
- Ajouter un espacement supplementaire sous le hero (`mb-16` au lieu du `space-y-12` global)

**Fichier : `src/components/shared/PageHero.tsx`**
- Augmenter le contraste du sous-titre de `text-white/60` a `text-white/80`

### 2. Timeline visuelle pour les "Jalons Cles 2025"

**Fichier : `src/pages/Roadmap.tsx`** (section milestones)

Transformer la liste plate en une vraie timeline horizontale :

- Ajouter une ligne de connexion horizontale continue entre les jalons (bordure `border-t-2 border-dashed border-[hsl(var(--nx-gold)/0.3)]` reliant les points)
- Encapsuler chaque jalon dans une mini-carte avec fond `bg-white/5`, `rounded-xl`, `p-4`, et une ombre `shadow-lg shadow-black/10`
- Ajouter un point circulaire decore (`w-4 h-4 rounded-full bg-[hsl(var(--nx-gold))]`) au-dessus de chaque carte, connecte a la ligne
- Effet de survol sur chaque carte : `hover:bg-white/10 hover:scale-105 hover:shadow-xl` avec `transition-all duration-300`
- Icone qui s'agrandit au hover : `group-hover:scale-110` sur l'icone
- Sur mobile : disposition verticale avec une ligne verticale a gauche

### 3. Contraste et hierarchie des sections Phases

**Fichier : `src/pages/Roadmap.tsx`** (section phases)

- Augmenter le contraste des textes faibles :
  - `text-white/50` (items non faits) -> `text-white/70`
  - `text-white/60` (label "Progression") -> `text-white/80`
  - `text-white/70` (highlight badge) -> `text-white/85`
  - `text-white/50` (dates milestones) -> `text-white/70`
  - `text-white/60` (sous-titre milestones) -> `text-white/80`
- Augmenter l'espacement entre le hero et les jalons : `py-8 space-y-12` -> `py-12 space-y-16`

### 4. Section CTA

**Fichier : `src/pages/Roadmap.tsx`** (section CTA)

- Augmenter le contraste du texte descriptif : `text-white/70` -> `text-white/85`

---

## Resume technique

| Fichier | Action |
|---|---|
| `src/pages/Roadmap.tsx` | Hero renforce, timeline visuelle, contrastes ameliores, espacement |
| `src/components/shared/PageHero.tsx` | Contraste sous-titre ameliore |

Aucune nouvelle dependance ni migration requise. Les modifications sont purement visuelles et CSS.

