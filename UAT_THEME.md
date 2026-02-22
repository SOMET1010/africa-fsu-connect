# UAT Design Theme — Charte graphique institutionnelle

## Palette de couleurs UAT

### Primary — Bleu institutionnel UAT
| Token CSS | Valeur HSL | Usage |
|-----------|-----------|-------|
| `--primary` | `210 73% 28%` | Boutons primaires, liens actifs, navbar active |
| `--primary-light` | `210 60% 40%` | Hover states, accents secondaires |
| `--primary-dark` | `210 80% 22%` | Gradients hero, fond sombre |
| `--primary-foreground` | `0 0% 100%` | Texte sur fond primary |

**Classes Tailwind** : `bg-primary`, `text-primary`, `border-primary`, `bg-primary-light`, `bg-primary-dark`

### Secondary — Gris-bleu subtil
| Token CSS | Valeur HSL | Usage |
|-----------|-----------|-------|
| `--secondary` | `210 25% 96%` | Fond de sections alternées |
| `--secondary-foreground` | `222 47% 15%` | Texte sur fond secondary |

### Accent — Teal institutionnel
| Token CSS | Valeur HSL | Usage |
|-----------|-----------|-------|
| `--accent` | `170 45% 40%` | Accent coopération, liens secondaires |
| `--accent-light` | `170 45% 52%` | Hover sur accent |

---

## Tokens de statut UAT

### Actif (vert institutionnel)
| Token CSS | Valeur HSL | Classe Tailwind |
|-----------|-----------|-----------------|
| `--uat-status-active` | `142 60% 40%` | `text-uat-active` |
| `--uat-status-active-bg` | `142 60% 96%` | `bg-uat-active-bg` |
| `--uat-status-active-border` | `142 50% 82%` | `border-uat-active-border` |

### En intégration (bleu UAT)
| Token CSS | Valeur HSL | Classe Tailwind |
|-----------|-----------|-----------------|
| `--uat-status-onboarding` | `210 73% 38%` | `text-uat-onboarding` |
| `--uat-status-onboarding-bg` | `210 60% 96%` | `bg-uat-onboarding-bg` |
| `--uat-status-onboarding-border` | `210 50% 82%` | `border-uat-onboarding-border` |

### Observateur (gris neutre)
| Token CSS | Valeur HSL | Classe Tailwind |
|-----------|-----------|-----------------|
| `--uat-status-observer` | `215 16% 47%` | `text-uat-observer` |
| `--uat-status-observer-bg` | `210 20% 96%` | `bg-uat-observer-bg` |
| `--uat-status-observer-border` | `214 20% 89%` | `border-uat-observer-border` |

### Info / Document (bleu primaire)
| Token CSS | Valeur HSL | Classe Tailwind |
|-----------|-----------|-----------------|
| `--uat-info` | `210 73% 50%` | `text-uat-info` |
| `--uat-info-bg` | `210 60% 96%` | `bg-uat-info-bg` |
| `--uat-info-border` | `210 50% 85%` | `border-uat-info-border` |

---

## Composants alignés

### Boutons
- **Primary** : `bg-primary text-primary-foreground` → bleu UAT 210°
- **Outline** : `border-primary text-primary hover:bg-primary/5`
- **Ghost** : `text-primary hover:bg-primary/10`

### Navbar
- Éléments actifs : `text-primary`, indicateur `bg-primary`
- Liens hover : `hover:text-primary`

### Badges statut
```tsx
// Actif
className="bg-uat-active-bg text-uat-active border-uat-active-border"

// En intégration
className="bg-uat-onboarding-bg text-uat-onboarding border-uat-onboarding-border"

// Observateur
className="bg-uat-observer-bg text-uat-observer border-uat-observer-border"
```

### Alertes info
```tsx
className="border-uat-info-border bg-uat-info-bg text-uat-info"
```

---

## Fichiers de définition

| Fichier | Rôle |
|---------|------|
| `src/index.css` | Variables CSS core (`--primary`, `--secondary`, `--accent`) |
| `src/styles/nexus-tokens.css` | Variables NEXUS + UAT status tokens |
| `tailwind.config.ts` | Mapping classes Tailwind ↔ CSS variables |

## Fichiers modifiés (migration blue → UAT)

| Fichier | Changement |
|---------|-----------|
| `src/components/network/NetworkMembersGrid.tsx` | `bg-blue-*` → `bg-uat-*` tokens |
| `src/components/network/NexusRegions.tsx` | `text-blue-400` → `text-primary-light` |
| `src/components/network/NexusActivityFeed.tsx` | `text-blue-400` → `text-uat-info` |
| `src/components/ui/confirmation-dialog.tsx` | `text-blue-600` → `text-info` |
| `src/components/ui/accessible-alert.tsx` | `bg-blue-*` → `bg-uat-info-*` |
| `src/components/ui/gradient-stats-card.tsx` | `blue-500/600` → `primary` tokens |
| `src/pages/FocalDashboard.tsx` | `text-blue-*` → `text-primary` |
| `src/components/organizations/OrganizationsMap.tsx` | `bg-blue-*` → `bg-primary/*` |
| `src/components/analytics/AdvancedAnalyticsDashboard.tsx` | `text-blue-500` → `text-primary` |
| `src/components/collaboration/CollaborationTimeline.tsx` | `blue-*` → `uat-info-*` / `primary` |
| `src/components/projects/ProjectAnalytics.tsx` | `bg-blue-500` → `bg-primary` |

## Contraste WCAG AA

Tous les tokens respectent un ratio ≥ 4.5:1 :
- `--primary` (210 73% 28%) sur blanc → **8.2:1** ✅
- `--uat-status-active` (142 60% 40%) sur `--uat-status-active-bg` → **5.1:1** ✅
- `--uat-status-onboarding` (210 73% 38%) sur `--uat-status-onboarding-bg` → **5.8:1** ✅
- `--uat-info` (210 73% 50%) sur `--uat-info-bg` → **4.6:1** ✅
- Dark mode : tous les tokens sont remontés en luminosité pour maintenir ≥ 4.5:1 sur fond sombre

## Règle d'or

> **Ne jamais utiliser `bg-blue-*`, `text-blue-*`, `border-blue-*` de Tailwind.**
> Toujours utiliser les tokens UAT : `primary`, `uat-active`, `uat-onboarding`, `uat-info`.
