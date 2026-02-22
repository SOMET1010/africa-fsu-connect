

# Theme Switch institutionnel avec contraste WCAG

## Contexte

Le projet dispose deja de `next-themes` avec un `ThemeToggleButton` dans le `ModernHeader`, mais plusieurs problemes existent :
- Le toggle actuel est minimaliste (icone seule, pas de label)
- Le `PublicHeader` utilise des couleurs hardcodees dark (`nx-night`, `text-white`) -- il ne reagit pas au changement de theme
- Le `HomeLayoutToggle` (light/immersive) est un concept different du theme dark/light, ce qui cree de la confusion
- Les tokens dark mode dans `index.css` doivent etre verifies pour le contraste WCAG AA (ratio 4.5:1 minimum)

## Changements prevus

### 1. Creer un composant `ThemeSwitch` institutionnel dedie

Nouveau fichier : `src/components/shared/ThemeSwitch.tsx`

- Bouton accessible avec icone Sun/Moon et label textuel optionnel
- Animation douce de transition entre les icones
- Utilise `useTheme` de `next-themes`
- Cycle simplifie : light <-> dark (suppression du mode "system" pour la clarte)
- Attributs ARIA complets (`aria-label`, `role`)
- Style institutionnel : bordure subtile, fond `bg-muted`, texte `text-foreground`

### 2. Auditer et corriger les tokens dark mode (WCAG AA)

Fichier : `src/index.css`

Corrections sur les tokens `.dark` :
- `--muted-foreground` : passer de `215 20% 65%` a `215 20% 70%` pour atteindre un ratio 4.5:1 sur fond `222 20% 10%`
- `--border` : passer de `225 15% 22%` a `225 15% 28%` pour une meilleure visibilite des separateurs
- Ajouter `--card-foreground: 210 40% 98%` explicitement pour garantir le contraste texte/carte
- Verifier que `--destructive` sur fond dark atteint 4.5:1

### 3. Rendre le `PublicHeader` theme-aware

Fichier : `src/components/layout/PublicHeader.tsx`

Le header public utilise actuellement des couleurs hardcodees (`bg-[hsl(var(--nx-night))]`, `text-white`). Les changements :
- Remplacer `bg-[hsl(var(--nx-night))]/80` par `bg-background/80`
- Remplacer `text-white/70` par `text-muted-foreground`
- Remplacer `text-white` par `text-foreground`
- Remplacer les references `nx-gold` par `text-primary` et `bg-primary/10` pour les liens actifs
- Remplacer les bordures `border-white/10` par `border-border`
- Le header fonctionnera alors correctement en mode clair ET sombre

### 4. Integrer le `ThemeSwitch` dans les headers

Fichiers : `src/components/layout/ModernHeader.tsx`, `src/components/layout/PublicHeader.tsx`

- Remplacer le `ThemeToggleButton` inline dans `ModernHeader` par le nouveau `ThemeSwitch`
- Ajouter le `ThemeSwitch` dans le `PublicHeader` (section "Right side", a cote du `LanguageSelector`)

### 5. Supprimer le `HomeLayoutToggle` redondant

Le `THEME_CHANGELOG.md` indique deja que le `HomeLayoutToggle` est redondant. Il sera supprime de `Index.tsx` (s'il y est encore utilise) pour eviter la confusion entre "theme" et "layout variant".

---

## Details techniques

| Fichier | Changement |
|---|---|
| `src/components/shared/ThemeSwitch.tsx` | Nouveau composant theme toggle institutionnel |
| `src/index.css` | Correction tokens dark pour WCAG AA |
| `src/components/layout/PublicHeader.tsx` | Remplacement couleurs hardcodees par tokens semantiques |
| `src/components/layout/ModernHeader.tsx` | Remplacement du `ThemeToggleButton` inline par `ThemeSwitch` |
| `src/components/home/HomeLayoutToggle.tsx` | Suppression (redondant) |

### Pas de nouvelles dependances

Tout repose sur `next-themes` (deja installe) et Tailwind CSS.

