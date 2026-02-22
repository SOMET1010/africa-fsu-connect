

# Audit de contraste et typographie accessible sur les dashboards et cartes

## Probleme identifie

Tous les composants du dashboard utilisent des couleurs hardcodees pour un fond sombre (`bg-white/5`, `text-white`, `text-white/50`, `border-white/10`) au lieu des tokens semantiques du design system (`bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`). En mode clair, ces composants sont quasi invisibles ou illisibles.

**10 fichiers concernes**, tous dans `src/components/dashboard/`.

## Changements prevus

### 1. Convertir tous les widgets dashboard en tokens semantiques

Remplacement systematique dans chaque fichier :

| Couleur hardcodee | Token semantique |
|---|---|
| `bg-white/5 backdrop-blur-md border-white/10` | `bg-card border-border shadow-sm` |
| `text-white` | `text-foreground` |
| `text-white/80`, `text-white/70` | `text-foreground/80` ou `text-muted-foreground` |
| `text-white/50`, `text-white/40` | `text-muted-foreground` |
| `bg-white/10` (hover) | `hover:bg-muted` |
| `border-white/20` | `border-border` |
| `bg-white/10` (skeleton) | `bg-muted` |
| `text-[hsl(var(--nx-gold))]` (hover) | `text-primary` (hover) |
| `text-[hsl(var(--nx-electric))]` (icones) | `text-primary` |

### Fichiers modifies

**Widgets :**
- `src/components/dashboard/widgets/UserKPICards.tsx` -- cartes KPI + bouton export
- `src/components/dashboard/widgets/DashboardMapWidget.tsx` -- carte reseau + stats overlay
- `src/components/dashboard/widgets/NetworkActivityWidget.tsx` -- activite reseau
- `src/components/dashboard/widgets/UserRecentActivity.tsx` -- activite recente utilisateur

**Composants :**
- `src/components/dashboard/components/InspiringProjects.tsx` -- cartes projets
- `src/components/dashboard/components/RecentResources.tsx` -- ressources recentes
- `src/components/dashboard/components/UpcomingEvents.tsx` -- evenements a venir
- `src/components/dashboard/components/NetworkSummary.tsx` -- synthese narrative
- `src/components/dashboard/components/DashboardHero.tsx` -- hero (deja sur fond primaire, ajuster textes secondaires)
- `src/components/dashboard/NetworkDashboard.tsx` -- bouton replay tour

### 2. Ameliorer la hierarchie typographique

- Uniformiser les titres de section en `text-lg font-semibold text-foreground`
- Uniformiser les textes secondaires en `text-sm text-muted-foreground` (minimum)
- Remplacer `text-xs text-white/40` par `text-xs text-muted-foreground` -- le `text-xs` reste pour les metadonnees mais avec un contraste suffisant
- Les valeurs numeriques (KPIs, stats) restent en `text-2xl font-bold text-foreground`

### 3. Tokens de couleur pour icones (palette coherente)

Remplacer les references `nx-gold` et `nx-electric` par des couleurs semantiques du design system :
- Icones primaires : `text-primary`
- Icones or/accent : `text-amber-600 dark:text-amber-400` (ratio WCAG valide dans les deux modes)
- Icones emerald : `text-emerald-600 dark:text-emerald-400`
- Icones violet : `text-purple-600 dark:text-purple-400`
- Fonds d'icones : `bg-primary/10`, `bg-amber-100 dark:bg-amber-500/10`, etc.

### 4. Skeleton loading states

Remplacer `bg-white/10` par `bg-muted` dans tous les etats de chargement (UserKPICards, DashboardMapWidget, UserRecentActivity).

---

## Verification WCAG

Tous les remplacements garantissent :
- Ratio **4.5:1** minimum pour le texte principal (`text-foreground` sur `bg-card`)
- Ratio **3:1** minimum pour le texte secondaire large (`text-muted-foreground` sur `bg-card`)
- Les tokens sont deja audites dans `index.css` (corrections precedentes)

## Pas de nouvelles dependances

Tout utilise les tokens Tailwind existants.
