

# Refonte Theme Clair / Sombre -- Plan d'implementation

## Diagnostic

### Comment le theme est pilote aujourd'hui

Le systeme actuel est **100% dark, sans option de basculer** :

- **AppShell.tsx** (ligne 52) force `bg-[hsl(var(--nx-night))] text-white` sur TOUTES les pages internes
- **102 fichiers** utilisent `text-white` en dur (2943 occurrences) -- tout est code "pour du sombre"
- **`preferences.theme`** existe (`'light' | 'dark' | 'system'`) mais **n'est jamais applique au DOM** -- c'est un setting fantome
- **Aucun ThemeProvider** (next-themes est installe mais seulement utilise par sonner.tsx pour les toasts)
- **Tailwind** est configure avec `darkMode: ["class"]` mais la classe `dark` n'est jamais togglee
- Les tokens CSS `.dark { ... }` dans `index.css` existent mais sont inutilises

### Pages/composants "tres dark"

| Zone | Fichier | Probleme |
|------|---------|----------|
| Shell global | `AppShell.tsx` | `bg-[hsl(var(--nx-night))] text-white` sur tout |
| Header interne | `ModernHeader.tsx` | Tout en `text-white`, `bg-nx-night` |
| Footer | `Footer.tsx` | Tout en `text-white/60`, fond `nx-night` |
| About | `About.tsx` | Cards `bg-white/5`, textes `text-white` |
| Dashboard | `NetworkDashboard.tsx` | GlassCards sur fond sombre |
| Forum, Events, Members... | 95+ fichiers | Hardcode dark partout |
| Ambient effects | `AppShell.tsx` l.54-67 | Noise texture + glow effects permanents |

### Conclusion

Le probleme n'est pas "un toggle mal configure". Toute l'application a ete construite en dark-only. Passer en "light par defaut" necessite de toucher l'infrastructure + convertir les pages une par une.

---

## Strategie de correction (en 2 phases)

### Phase 1 -- Infrastructure + Pages publiques (cette implementation)

Objectif : rendre l'app **claire par defaut** pour les pages les plus visibles, avec toggle pour repasser en sombre.

### Phase 2 -- Pages internes (future iteration)

Convertir les pages protegees restantes (dashboard widgets, tools, admin...).

---

## Phase 1 -- Plan detaille

### 1. Installer et configurer le ThemeProvider

**Fichier : `src/components/app/AppProviders.tsx`**

- Ajouter `ThemeProvider` de `next-themes` (deja installe) autour de l'app
- Configuration : `attribute="class"`, `defaultTheme="light"`, `enableSystem={true}`
- Synchroniser avec `preferences.theme`

### 2. Connecter preferences.theme au DOM

**Fichier : `src/contexts/UserPreferencesContext.tsx`**

- Ajouter un `useEffect` qui appelle `setTheme()` de next-themes quand `preferences.theme` change
- Le default passe de `'system'` a `'light'`

### 3. Modifier AppShell -- Fond semantique

**Fichier : `src/components/layout/AppShell.tsx`**

Avant :
```
<div className="min-h-screen bg-[hsl(var(--nx-night))] text-white ...">
  <!-- noise texture -->
  <!-- ambient glow -->
```

Apres :
```
<div className="min-h-screen bg-background text-foreground ...">
  <!-- noise + glow uniquement en dark -->
```

- Remplacer `bg-[hsl(var(--nx-night))] text-white` par `bg-background text-foreground`
- Conditionner les effets visuels (noise texture, ambient glow) au mode dark uniquement
- Le contenu des pages utilisera les tokens semantiques

### 4. Garder Header et Footer toujours sombres

Le header (`ModernHeader.tsx`) et le footer (`Footer.tsx`) restent en fond sombre `nx-night` -- c'est un pattern de branding courant et ca evite de toucher ces composants complexes. Pas de modification.

### 5. Ajouter un toggle theme dans le Header

**Fichier : `src/components/layout/ModernHeader.tsx`**

- Ajouter un bouton Sun/Moon/Monitor a cote du selecteur de langue
- 3 etats : Clair / Sombre / Systeme
- Appelle `updatePreferences({ theme: ... })` et `setTheme()` de next-themes

### 6. Convertir les pages publiques cles (6 pages)

Pour chaque page, remplacer les classes hardcodees par des tokens semantiques :

| Classe dark hardcodee | Remplacement semantique |
|---|---|
| `text-white` | `text-foreground` |
| `text-white/70` | `text-muted-foreground` |
| `text-white/60` | `text-muted-foreground` |
| `text-white/50` | `text-muted-foreground/70` |
| `bg-white/5` | `bg-muted` |
| `bg-white/10` | `bg-muted/80` |
| `border-white/10` | `border-border` |
| `border-white/20` | `border-border` |

**Pages converties :**

- `src/pages/About.tsx` -- Page "A propos" (actuellement visitee)
- `src/pages/Auth.tsx` -- Connexion/Inscription
- `src/pages/Contact.tsx` -- Contact
- `src/pages/Strategies.tsx` -- Strategies
- `src/pages/Events.tsx` -- Evenements
- `src/pages/MembersDirectory.tsx` -- Annuaire membres

### 7. Supprimer HomeLayoutToggle devenu redondant

**Fichier : `src/components/home/HomeLayoutToggle.tsx`**

Le toggle flottant bas-droite (mode immersif/clair pour la homepage) devient redondant avec le toggle global dans le header. Le supprimer ou le remplacer par le toggle global.

### 8. Mettre a jour les tokens dark CSS

**Fichier : `src/index.css`**

Adoucir le mode dark (pas noir pur) :
- `--background: 222 20% 12%` (au lieu de `225 15% 8%` -- trop sombre)
- `--card: 222 18% 16%` (au lieu de `225 15% 8%`)
- Augmenter le contraste du `--muted-foreground`

### 9. Creer THEME_CHANGELOG.md

**Nouveau fichier : `THEME_CHANGELOG.md`**

Documenter :
- Ce qui a change
- Comment activer light/dark/system
- Liste des composants convertis
- Liste des composants restant en dark-only (Phase 2)

---

## Fichiers modifies (Phase 1)

```
src/components/app/AppProviders.tsx          -- Ajout ThemeProvider next-themes
src/contexts/UserPreferencesContext.tsx       -- Sync theme avec DOM + default light
src/components/layout/AppShell.tsx            -- bg-background au lieu de nx-night
src/components/layout/ModernHeader.tsx        -- Ajout toggle theme
src/pages/About.tsx                          -- Tokens semantiques
src/pages/Auth.tsx                           -- Tokens semantiques
src/pages/Contact.tsx                        -- Tokens semantiques
src/pages/Strategies.tsx                     -- Tokens semantiques
src/pages/Events.tsx                         -- Tokens semantiques
src/pages/MembersDirectory.tsx               -- Tokens semantiques
src/index.css                                -- Dark tokens adoucis
src/pages/Index.tsx                          -- Suppression HomeLayoutToggle
THEME_CHANGELOG.md                           -- Documentation
```

**13 fichiers modifies, 1 fichier cree, 0 dependance ajoutee, 0 migration SQL.**

---

## Ce qui reste apres Phase 1 (Phase 2, future)

- ~95 fichiers internes (dashboard, forum, tools, admin...) encore en dark hardcode
- Ces pages fonctionneront toujours en mode sombre grace au wrapper `dark` sur `<html>`, mais en mode clair elles auront un fond clair avec du texte blanc (illisible)
- Solution temporaire : ces pages peuvent forcer `.dark` localement en attendant la conversion
- La Phase 2 les convertira progressivement vers les tokens semantiques

