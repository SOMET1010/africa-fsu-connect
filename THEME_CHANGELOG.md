# Theme Changelog — Light/Dark Mode

## Date : 2026-02-22

## Résumé

L'application passe d'un mode **100% sombre** à un thème **clair par défaut** avec possibilité de basculer en mode sombre ou système.

## Comment activer le thème

- **Toggle dans le header** : cliquer sur l'icône ☀️/🌙/🖥️ à côté du sélecteur de langue
- **Cycle** : Clair → Sombre → Système → Clair
- Le choix est mémorisé dans `localStorage` (clé `nexus-theme`)

## Infrastructure modifiée

| Fichier | Modification |
|---------|-------------|
| `src/components/app/AppProviders.tsx` | Ajout `<ThemeProvider>` de `next-themes` (`defaultTheme="light"`, `enableSystem`) |
| `src/contexts/UserPreferencesContext.tsx` | Default theme passé de `'system'` à `'light'` |
| `src/components/layout/AppShell.tsx` | `bg-[hsl(var(--nx-night))] text-white` → `bg-background text-foreground` ; effets visuels (noise, glow) conditionnés à `.dark` |
| `src/components/layout/ModernHeader.tsx` | Ajout `ThemeToggleButton` (Sun/Moon/Monitor) |
| `src/index.css` | Tokens `.dark` adoucis (fond `222 20% 12%` au lieu de `225 15% 8%`, `--muted-foreground` plus contrasté) |
| `src/pages/Index.tsx` | Suppression de `HomeLayoutToggle` (redondant) |

## Pages converties (tokens sémantiques)

| Page | Avant | Après |
|------|-------|-------|
| `About.tsx` | `text-white`, `bg-white/5`, `border-white/10` | `text-foreground`, `bg-card`, `border-border` |
| `Auth.tsx` | Déjà bien isolée (fond gradient propre) | Inchangée (fonctionne en light & dark) |
| `Contact.tsx` | Hero `text-white` | Déjà en tokens sémantiques (inchangée) |
| `Strategies.tsx` | Hero `text-white` | Déjà en tokens sémantiques (inchangée) |
| `Events.tsx` | `bg-white/5 border-white/10` | `bg-muted/50 border-border` |
| `MembersDirectory.tsx` | `bg-white/10 border-white/20 text-white` | `bg-background border-border text-foreground` |

## Header & Footer

Le header (`ModernHeader.tsx`) et le footer (`Footer.tsx`) **restent toujours sombres** (`bg-[hsl(var(--nx-night))]`). C'est un choix de branding — ces zones sont visuellement "fixes" quel que soit le thème.

## Ce qui reste (Phase 2)

~95 fichiers internes (dashboard, forum, tools, admin...) utilisent encore `text-white` / `bg-white/5` en dur. Ces pages :
- Fonctionnent correctement en mode sombre
- Peuvent avoir des problèmes de lisibilité en mode clair
- Seront converties progressivement vers les tokens sémantiques

### Pages prioritaires pour Phase 2
- `NetworkDashboard.tsx` — Dashboard principal
- `Forum.tsx` — Forum communautaire
- `FocalDashboard.tsx` — Dashboard focal
- Widgets de dashboard (`src/components/dashboard/widgets/`)
