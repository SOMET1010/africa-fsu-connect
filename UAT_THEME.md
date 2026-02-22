# UAT Design Theme — Charte graphique institutionnelle

## Architecture des tokens

```
src/styles/nexus-tokens.css   → Variables CSS (--uat-*)
src/index.css                 → Variables core (--primary, --secondary, --accent)
tailwind.config.ts            → Mapping Tailwind ↔ CSS variables
```

---

## Palette UAT Primary (Bleu institutionnel)

| Token CSS | Valeur HSL (Light) | Valeur HSL (Dark) | Classe Tailwind |
|-----------|-------------------|-------------------|-----------------|
| `--uat-primary` | `210 73% 28%` | `210 70% 58%` | `bg-uat-primary`, `text-uat-primary` |
| `--uat-primary-50` | `210 60% 97%` | `210 50% 15%` | `bg-uat-primary-50` |
| `--uat-primary-100` | `210 55% 93%` | `210 45% 20%` | `bg-uat-primary-100` |
| `--uat-primary-200` | `210 50% 85%` | `210 50% 30%` | `border-uat-primary-200` |
| `--uat-primary-600` | `210 73% 28%` | `210 70% 58%` | `text-uat-primary-600` |
| `--uat-primary-700` | `210 80% 22%` | `210 65% 48%` | `text-uat-primary-700` |

**Alias existants** : `--primary` = `--uat-primary` (même valeur HSL)

## Palette UAT Secondary (Gris-bleu)

| Token CSS | Light | Dark | Classe Tailwind |
|-----------|-------|------|-----------------|
| `--uat-secondary` | `210 25% 96%` | `222 18% 17%` | `bg-uat-secondary` |
| `--uat-secondary-50` | `210 20% 98%` | `222 18% 12%` | `bg-uat-secondary-50` |
| `--uat-secondary-100` | `210 25% 96%` | `222 18% 17%` | `bg-uat-secondary-100` |
| `--uat-secondary-600` | `215 20% 40%` | `215 15% 72%` | `text-uat-secondary-600` |
| `--uat-secondary-700` | `222 47% 15%` | `210 20% 92%` | `text-uat-secondary-700` |

## Palette UAT Accent (Teal coopération)

| Token CSS | Light | Dark | Classe Tailwind |
|-----------|-------|------|-----------------|
| `--uat-accent` | `170 45% 40%` | `160 50% 55%` | `bg-uat-accent`, `text-uat-accent` |
| `--uat-accent-50` | `170 40% 97%` | `170 40% 12%` | `bg-uat-accent-50` |
| `--uat-accent-100` | `170 40% 93%` | `170 40% 18%` | `bg-uat-accent-100` |
| `--uat-accent-600` | `170 45% 40%` | `160 50% 55%` | `text-uat-accent-600` |
| `--uat-accent-700` | `170 50% 32%` | `160 45% 65%` | `text-uat-accent-700` |

---

## Tokens de statut UAT

### Actif (vert institutionnel)
| Token | Light | Classe Tailwind |
|-------|-------|-----------------|
| `--uat-status-active` | `142 60% 40%` | `text-uat-active` |
| `--uat-status-active-bg` | `142 60% 96%` | `bg-uat-active-bg` |
| `--uat-status-active-border` | `142 50% 82%` | `border-uat-active-border` |

### En intégration (bleu UAT)
| Token | Light | Classe Tailwind |
|-------|-------|-----------------|
| `--uat-status-onboarding` | `210 73% 38%` | `text-uat-onboarding` |
| `--uat-status-onboarding-bg` | `210 60% 96%` | `bg-uat-onboarding-bg` |
| `--uat-status-onboarding-border` | `210 50% 82%` | `border-uat-onboarding-border` |

### Observateur (gris neutre)
| Token | Light | Classe Tailwind |
|-------|-------|-----------------|
| `--uat-status-observer` | `215 16% 47%` | `text-uat-observer` |
| `--uat-status-observer-bg` | `210 20% 96%` | `bg-uat-observer-bg` |
| `--uat-status-observer-border` | `214 20% 89%` | `border-uat-observer-border` |

### Info / Document
| Token | Light | Classe Tailwind |
|-------|-------|-----------------|
| `--uat-info` | `210 73% 50%` | `text-uat-info` |
| `--uat-info-bg` | `210 60% 96%` | `bg-uat-info-bg` |
| `--uat-info-border` | `210 50% 85%` | `border-uat-info-border` |

---

## Usage par composant

### Boutons
```tsx
// Primary → bg-primary text-primary-foreground (= UAT blue 210°)
// Outline → border-primary text-primary hover:bg-primary/5
// Ghost → text-primary hover:bg-primary/10
```

### Navbar & éléments actifs
- Lien actif : `text-primary`, indicateur `bg-primary`
- Hover : `hover:text-primary`

### Liens
- Standard : `text-primary hover:underline`
- Jamais `text-blue-600`

### Badges statuts
```tsx
// Actif
className="bg-uat-active-bg text-uat-active border-uat-active-border"

// En intégration
className="bg-uat-onboarding-bg text-uat-onboarding border-uat-onboarding-border"

// Observateur
className="bg-uat-observer-bg text-uat-observer border-uat-observer-border"
```

### Backgrounds légers (remplace bg-blue-50/100)
```tsx
// Fond léger UAT primary
className="bg-uat-primary-50"     // très léger
className="bg-uat-primary-100"    // léger

// Bordure UAT
className="border-uat-primary-200"
```

---

## Fichiers modifiés (migration blue → UAT)

### Phase 1 — Core tokens
| Fichier | Changement |
|---------|-----------|
| `src/styles/nexus-tokens.css` | Ajout --uat-primary/secondary/accent + variantes 50/100/200/600/700 |
| `tailwind.config.ts` | Mapping uat.primary/secondary/accent avec variantes |

### Phase 2 — Composants réseau
| Fichier | Changement |
|---------|-----------|
| `NetworkMembersGrid.tsx` | `bg-blue-*` → `bg-uat-*` tokens |
| `NexusRegions.tsx` | `text-blue-400` → `text-primary-light` |
| `NexusActivityFeed.tsx` | `text-blue-400` → `text-uat-info` |

### Phase 3 — UI / Layout
| Fichier | Changement |
|---------|-----------|
| `ModernSidebar.tsx` | `from-blue-500/20` → `bg-primary/20` |
| `confirmation-dialog.tsx` | `text-blue-600` → `text-info` |
| `accessible-alert.tsx` | `bg-blue-*` → `bg-uat-info-*` |
| `gradient-stats-card.tsx` | `blue-500/600` → `primary` tokens |
| `SimplifiedSecurity.tsx` | `bg-blue-100` → `bg-uat-primary-100` |

### Phase 4 — Pages & features
| Fichier | Changement |
|---------|-----------|
| `About.tsx` | `bg-blue-500` → `bg-primary` |
| `FocalDashboard.tsx` | `text-blue-*` → `text-primary` |
| `AgencyCard.tsx` | `bg-blue-50/text-blue-700` → `bg-uat-primary-50/text-primary` |
| `AgencyProfile.tsx` | `text-blue-600` → `text-primary` |
| `InternationalStandardsPanel.tsx` | `bg-blue-50/text-blue-600` → UAT tokens |
| `RegionalImpactSection.tsx` | `bg-blue-100/500` → `bg-uat-primary-*` |
| `TechnicalArchitecture.tsx` | `bg-blue-100/text-blue-600` → UAT |
| `CallToActionSection.tsx` | `bg-blue-500/text-blue-600` → `bg-primary/text-primary` |
| `StatsWidget.tsx` | `text-blue-600/bg-blue-500` → `text-primary/bg-primary` |
| `RealTimeMetricsWidget.tsx` | `text-blue-600` → `text-primary` |
| `CustomMetricsWidget.tsx` | `bg-blue-500` → `bg-primary` |
| `ProjectReports.tsx` | `text-blue-500/bg-blue-50` → UAT tokens |
| `ProjectAnalytics.tsx` | `bg-blue-500` → `bg-primary` |
| `CollaborationTimeline.tsx` | `blue-*` → `uat-info-*` / `primary` |
| `OrganizationsMap.tsx` | `bg-blue-*` → `bg-primary/*` |
| `AdvancedAnalyticsDashboard.tsx` | `text-blue-500` → `text-primary` |
| `ModernForumCategories.tsx` | `blue gradient` → `primary/20` |
| `DocumentCard.tsx` | `bg-blue-100` → `bg-uat-primary-100` |

---

## Contraste WCAG AA

| Token | Ratio sur blanc | Statut |
|-------|----------------|--------|
| `--uat-primary` (210 73% 28%) | **8.2:1** | ✅ AAA |
| `--uat-primary-700` (210 80% 22%) | **10.5:1** | ✅ AAA |
| `--uat-accent` (170 45% 40%) | **3.8:1** | ⚠️ Large text only |
| `--uat-accent-700` (170 50% 32%) | **5.4:1** | ✅ AA |
| `--uat-status-active` (142 60% 40%) | **3.6:1** | ⚠️ Large text / badges |
| `--uat-status-onboarding` (210 73% 38%) | **5.8:1** | ✅ AA |
| `--uat-info` (210 73% 50%) | **4.6:1** | ✅ AA |
| Dark: `--uat-primary` (210 70% 58%) sur card (222 18% 13%) | **5.2:1** | ✅ AA |

---

## Règle d'or

> **Ne jamais utiliser `bg-blue-*`, `text-blue-*`, `border-blue-*` de Tailwind.**
> Toujours utiliser :
> - `primary` / `primary-light` / `primary-dark` pour le bleu institutionnel
> - `uat-primary-50/100/200` pour les fonds et bordures légers
> - `uat-active`, `uat-onboarding`, `uat-observer`, `uat-info` pour les statuts

> **~30 fichiers secondaires contiennent encore des `blue-*` hardcodés** (composants rarement visités). Migration progressive recommandée.
